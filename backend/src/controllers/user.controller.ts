import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { registerSchema, loginSchema } from "../validators/user.validator.js";
import { sendVerificationEmail } from "../utils/email.service.js";
import { OAuth2Client } from "google-auth-library";
import { TrackingLog } from "../models/trackingLog.model.js";
import geoip from "geoip-lite";
import crypto from "crypto";

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

const getDeviceInfo = (userAgent: string) => {
    let browser = "Unknown";
    let os = "Unknown";
    let deviceType = "Desktop";

    if (/mobi/i.test(userAgent)) deviceType = "Mobile";
    else if (/tablet/i.test(userAgent)) deviceType = "Tablet";

    if (/windows/i.test(userAgent)) os = "Windows";
    else if (/mac/i.test(userAgent)) os = "MacOS";
    else if (/linux/i.test(userAgent)) os = "Linux";
    else if (/android/i.test(userAgent)) os = "Android";
    else if (/ios|iphone|ipad/i.test(userAgent)) os = "iOS";

    if (/edg/i.test(userAgent)) browser = "Edge";
    else if (/chrome|crios/i.test(userAgent)) browser = "Chrome";
    else if (/firefox|fxios/i.test(userAgent)) browser = "Firefox";
    else if (/safari/i.test(userAgent) && !/chrome|crios/i.test(userAgent)) browser = "Safari";
    else if (/msie|trident/i.test(userAgent)) browser = "IE";

    return { browser, os, deviceType };
};

const createTrackingLog = async (
    action: "LOGIN" | "SIGNUP" | "UPDATE" | "DELETE" | "LOGOUT",
    email: string,
    status: "SUCCESS" | "FAILED" | "BLOCKED",
    req: Request,
    failureReason?: string,
    user?: any,
    metadata?: any
) => {
    let ipAddress = req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress || "Unknown";
    if (ipAddress === "::1") ipAddress = "127.0.0.1";

    const deviceInfo = getDeviceInfo(req.headers["user-agent"] || "");
    const geo = geoip.lookup(ipAddress);
    const location = geo ? { city: geo.city, country: geo.country, lat: geo.ll[0], lng: geo.ll[1] } : undefined;
    
    // Generate a unique session ID for this instance
    const sessionId = crypto.randomBytes(16).toString("hex");

    await TrackingLog.create({
        userId: user?._id,
        email,
        action,
        status,
        metadata,
        ipAddress,
        location,
        deviceDetails: deviceInfo,
        failureReason,
        sessionId,
    });
};

/**
 * @desc    Google Authentication (Login/Register) - Auth Code Flow
 * @route   POST /api/v1/users/google-auth
 * @access  Public
 */
export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
    const { code, redirectUri } = req.body;

    if (!code) {
        throw new ApiError(400, "Authorization Code is required");
    }

    try {
        // Exchange code for tokens
        // When using redirect flow, the redirect_uri must match EXACTLY what was used on the frontend
        const { tokens } = await client.getToken({
            code,
            redirect_uri: redirectUri || "postmessage"
        });
        const idToken = tokens.id_token;

        if (!idToken) {
            throw new ApiError(401, "Failed to retrieve ID Token from Google");
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            throw new ApiError(401, "Invalid Google Token Payload");
        }

        const { sub: googleId, email, name, picture: avatar } = payload;

        if (!email) {
            throw new ApiError(400, "Google account must have an email");
        }
        console.log(`🔍 Checking if user exists: ${email}`);

        let lastLoginIP = req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress || "Unknown";
        if (lastLoginIP === "::1") lastLoginIP = "127.0.0.1"; // Normalize localhost
        const deviceInfo = getDeviceInfo(req.headers["user-agent"] || "");
        const lastLoginDate = new Date();

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // User exists, check if they are a Google user or Email user
            if (user.authType === "EMAIL") {
                // If they were an email user, we can link them to Google
                user.authType = "GOOGLE";
                user.googleId = googleId;
                if (!user.isEmailVerified) user.isEmailVerified = true;
            }
            user.lastLoginIP = lastLoginIP;
            user.lastLoginDate = lastLoginDate;
            user.deviceInfo = deviceInfo;
            await user.save({ validateBeforeSave: false });
        } else {
            // New user, create them
            user = await User.create({
                name,
                email,
                googleId,
                authType: "GOOGLE",
                avatar,
                isEmailVerified: true,
                lastLoginIP,
                lastLoginDate,
                deviceInfo
            });
        }

        // Generate Tokens
        const accessToken = (user as any).generateAccessToken();
        const refreshToken = (user as any).generateRefreshToken();

        user.refreshToken = refreshToken;
        console.log(`💾 [PROD-DEBUG] Persisting refreshToken for Google User: ${user.email}`);
        await user.save({ validateBeforeSave: false });
        console.log(`✅ [PROD-DEBUG] User successfully updated in DB: ${user._id}`);
        
        await createTrackingLog("LOGIN", email, "SUCCESS", req, undefined, user);

        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        const accessTokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax' as any,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        };

        const refreshTokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax' as any,
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, accessTokenOptions)
            .cookie("refreshToken", refreshToken, refreshTokenOptions)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedInUser,
                        accessToken,
                        refreshToken,
                    },
                    "Google authentication successful"
                )
            );
    } catch (error: any) {
        let emailToLog = req.body.email || "unknown@google.auth"; // Try to extract if available from req
        await createTrackingLog("LOGIN", emailToLog, "FAILED", req, error?.message || "Google token verification failed");
        throw new ApiError(401, error?.message || "Google token verification failed");
    }
});

/**
 * @desc    Register a new user
 * @route   POST /api/v1/users/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req: Request, res: Response) => {
    // 1. Validate data using Zod
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
        throw new ApiError(400, "Validation Error", validation.error.errors);
    }

    const { name, email, password, avatar, role } = validation.data;

    // 2. Check if user already exists
    console.log(`🔍 [PROD-DEBUG] Checking if user exists: ${email}`);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    // 3. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // 4. Create user (unverified)
    const user = await User.create({
        name,
        email,
        password,
        avatar,
        role,
        emailOtp: otp,
        otpExpiry,
        isEmailVerified: false,
    });

    const createdUser = await User.findById(user._id).select("-password -emailOtp -phoneOtp -otpExpiry");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // 5. Send Verification Email
    const emailSent = await sendVerificationEmail(email, name, otp);

    if (!emailSent) {
        // Optional: We could delete the user or keep them and allow resending OTP
        throw new ApiError(500, "Failed to send verification email. Please try again.");
    }

    // Log Signup Attempt
    await createTrackingLog("SIGNUP", email, "SUCCESS", req, undefined, createdUser);

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                { user: createdUser },
                "Registration successful. Please check your email for the verification code."
            )
        );
});

/**
 * @desc    Verify OTP and complete registration
 * @route   POST /api/v1/users/verify-otp
 * @access  Public
 */
export const verifyOTP = asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if OTP matches and is not expired
    if (user.emailOtp !== otp || (user.otpExpiry && user.otpExpiry < new Date())) {
        throw new ApiError(401, "Invalid or expired OTP");
    }

    // Handle both initial verification and 2FA verification
    let message = "Email verified successfully. Welcome to SafarFlow!";
    if (!user.isEmailVerified) {
        user.isEmailVerified = true;
    } else {
        message = "Two-Factor Authentication successful. Security verified.";
    }
    
    // Clear OTP fields
    user.emailOtp = undefined;
    user.otpExpiry = undefined;

    let lastLoginIP = req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress || "Unknown";
    if (lastLoginIP === "::1") lastLoginIP = "127.0.0.1";
    const deviceInfo = getDeviceInfo(req.headers["user-agent"] || "");
    const lastLoginDate = new Date();

    user.lastLoginIP = lastLoginIP;
    user.lastLoginDate = lastLoginDate;
    user.deviceInfo = deviceInfo;

    // Generate Tokens
    const accessToken = (user as any).generateAccessToken();
    const refreshToken = (user as any).generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    
    await createTrackingLog("LOGIN", user.email, "SUCCESS", req, undefined, user);

    const verifiedUser = await User.findById(user._id).select("-password");

    const accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax' as any,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax' as any,
        maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: verifiedUser,
                    accessToken,
                    refreshToken,
                },
                message
            )
        );
});

/**
 * @desc    Login a user
 * @route   POST /api/v1/users/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    // 1. Validation
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
        throw new ApiError(400, "Validation failed", validation.error.errors);
    }

    const { email, password } = validation.data;

    // 2. Find User
    const user = await User.findOne({ email });
    if (!user) {
        await createTrackingLog("LOGIN", email, "FAILED", req, "User does not exist");
        throw new ApiError(404, "User does not exist");
    }

    // 2.5 Stop Google-Only Accounts from Email Login
    if (user.authType === "GOOGLE" && !user.password) {
        await createTrackingLog("LOGIN", email, "FAILED", req, "Attempted email login on Google account", user);
        throw new ApiError(400, "This account was created via Google. Please use 'Login with Google' instead.");
    }

    // 3. Match Password
    const isPasswordValid = await (user as any).isPasswordCorrect(password);
    if (!isPasswordValid) {
        await createTrackingLog("LOGIN", email, "FAILED", req, "Invalid user credentials", user);
        throw new ApiError(401, "Invalid user credentials");
    }

    // 4. Check if verified
    if (!user.isEmailVerified) {
        await createTrackingLog("LOGIN", email, "BLOCKED", req, "Unverified Email", user);
        throw new ApiError(403, "Please verify your email before logging in.");
    }

    // 5. Intercept for Two-Factor Authentication
    if (user.isTwoFactorEnabled) {
        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
        
        user.emailOtp = otp;
        user.otpExpiry = otpExpiry;
        await user.save({ validateBeforeSave: false });

        // Send OTP email
        const emailSent = await sendVerificationEmail(email, user.name, otp);
        if (!emailSent) {
            throw new ApiError(500, "Failed to send 2FA security code.");
        }

        // Return a special 200 response requiring 2FA without cookies/tokens
        return res.status(200).json(new ApiResponse(200, { requires2FA: true, email: user.email }, "Two-Factor Authentication required. A security code has been sent to your email."));
    }

    // 5. Generate Tokens
    const accessToken = (user as any).generateAccessToken();
    const refreshToken = (user as any).generateRefreshToken();

    let lastLoginIP = req.headers["x-forwarded-for"]?.toString() || req.socket.remoteAddress || "Unknown";
    if (lastLoginIP === "::1") lastLoginIP = "127.0.0.1";
    const deviceInfo = getDeviceInfo(req.headers["user-agent"] || "");
    const lastLoginDate = new Date();

    // 6. Update Refresh Token and Login Info in DB
    user.lastLoginIP = lastLoginIP;
    user.lastLoginDate = lastLoginDate;
    user.deviceInfo = deviceInfo;
    user.refreshToken = refreshToken;
    console.log(`💾 [PROD-DEBUG] Persisting refreshToken for Login User: ${email}`);
    await user.save({ validateBeforeSave: false });
    console.log(`✅ [PROD-DEBUG] User successfully updated in DB: ${user._id}`);
    
    await createTrackingLog("LOGIN", user.email, "SUCCESS", req, undefined, user);

    // 7. Get user without password
    const loggedInUser = await User.findById(user._id).select("-password");

    // 8. Cookies options
    const accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax' as any,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    const refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax' as any,
        maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User logged in successfully"
            )
        );
});

/**
 * @desc    Refresh Access Token
 * @route   POST /api/v1/users/refresh-token
 * @access  Public (Uses Refresh Token from cookie)
 */
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request - No refresh token provided");
    }

    try {
        const decodedToken: any = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET || ""
        );

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token - User not found");
        }

        if (incomingRefreshToken !== user.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const accessTokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax' as any,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        };

        const refreshTokenOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax' as any,
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
        };

        const accessToken = (user as any).generateAccessToken();
        const newRefreshToken = (user as any).generateRefreshToken();

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });
        
        // Log refresh action as a success login extension
        await createTrackingLog("LOGIN", user.email, "SUCCESS", req, "Token Refreshed", user);

        return res
            .status(200)
            .cookie("accessToken", accessToken, accessTokenOptions)
            .cookie("refreshToken", newRefreshToken, refreshTokenOptions)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed successfully"
                )
            );
    } catch (error: any) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});
/**
 * @desc    Get current logged in user
 * @route   GET /api/v1/users/current-user
 * @access  Private (JWT protected)
 */
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    return res
        .status(200)
        .json(new ApiResponse(200, (req as any).user, "Current user fetched successfully"));
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/users/logout
 * @access  Private (JWT protected)
 */
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findByIdAndUpdate(
        (req as any).user._id,
        {
            $unset: {
                refreshToken: 1 // Completely remove the token field from the document on logout
            }
        },
        {
            new: false
        }
    );

    if (user) {
        // Track the user successfully logging out
        await createTrackingLog("LOGOUT", user.email, "SUCCESS", req, undefined, user);
    }

    const options: any = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
        path: "/",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});
/**
 * @desc    Update account details
 * @route   PATCH /api/v1/users/update-account
 * @access  Private (JWT protected)
 */
export const updateAccountDetails = asyncHandler(async (req: Request, res: Response) => {
    const { name, bio, phoneNumber, gender, dob, nationality, currentAddress, avatar, isTwoFactorEnabled, emergencyDocumentHub } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (gender !== undefined) updateData.gender = gender;
    if (dob !== undefined) updateData.dob = dob;
    if (nationality !== undefined) updateData.nationality = nationality;
    if (currentAddress !== undefined) updateData.currentAddress = currentAddress;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (emergencyDocumentHub !== undefined) updateData.emergencyDocumentHub = emergencyDocumentHub;

    if (isTwoFactorEnabled !== undefined) {
        const currentUser = await User.findById((req as any).user._id);
        if (currentUser?.authType === "GOOGLE" && isTwoFactorEnabled === true) {
            throw new ApiError(400, "Two-Factor authentication cannot be enabled for Google accounts.");
        }
        updateData.isTwoFactorEnabled = isTwoFactorEnabled;
    }

    const updatedUser = await User.findByIdAndUpdate(
        (req as any).user._id,
        {
            $set: updateData
        },
        {
            new: true,
            runValidators: true
        }
    ).select("-password -refreshToken");

    // Track the update event and log what specific fields changed
    const userEmail = (req as any).user.email || updatedUser?.email;
    if (Object.keys(updateData).length > 0) {
        await createTrackingLog("UPDATE", userEmail, "SUCCESS", req, undefined, updatedUser, {
            updatedFields: Object.keys(updateData)
        });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Account details updated successfully"));
});

/**
 * @desc    Delete user account
 * @route   DELETE /api/v1/users/delete-account
 * @access  Private (JWT protected)
 */
export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user._id;
    const user = await User.findById(userId);

    if (user) {
        // Log the deletion action to preserve security history
        await createTrackingLog("DELETE", user.email, "SUCCESS", req, "Account Deleted", user);
    }

    // Permanently remove the user from the users collection
    // Note: We deliberately do NOT delete associated LoginLogs to preserve security history
    await User.findByIdAndDelete(userId);

    // Completely clear authentication tokens to destroy the session
    const options: any = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
        path: "/",
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User account has been permanently deleted"));
});
