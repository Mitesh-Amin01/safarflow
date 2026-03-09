import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { registerSchema, loginSchema } from "../validators/user.validator.js";
import { sendVerificationEmail } from "../utils/email.service.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

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

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // User exists, check if they are a Google user or Email user
            if (user.authType === "EMAIL") {
                // If they were an email user, we can link them to Google
                user.authType = "GOOGLE";
                user.googleId = googleId;
                if (!user.isVerified) user.isVerified = true;
                await user.save({ validateBeforeSave: false });
            }
        } else {
            // New user, create them
            user = await User.create({
                name,
                email,
                googleId,
                authType: "GOOGLE",
                avatar,
                isVerified: true,
            });
        }

        // Generate Tokens
        const accessToken = (user as any).generateAccessToken();
        const refreshToken = (user as any).generateRefreshToken();

        user.refreshToken = refreshToken;
        console.log(`💾 [PROD-DEBUG] Persisting refreshToken for Google User: ${user.email}`);
        await user.save({ validateBeforeSave: false });
        console.log(`✅ [PROD-DEBUG] User successfully updated in DB: ${user._id}`);

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
        otp,
        otpExpiry,
        isVerified: false,
    });

    const createdUser = await User.findById(user._id).select("-password -otp -otpExpiry");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // 5. Send Verification Email
    const emailSent = await sendVerificationEmail(email, name, otp);

    if (!emailSent) {
        // Optional: We could delete the user or keep them and allow resending OTP
        throw new ApiError(500, "Failed to send verification email. Please try again.");
    }

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

    if (user.isVerified) {
        throw new ApiError(400, "User is already verified");
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp || (user.otpExpiry && user.otpExpiry < new Date())) {
        throw new ApiError(401, "Invalid or expired OTP");
    }

    // Mark as verified and clear OTP fields
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    // Generate Tokens
    const accessToken = (user as any).generateAccessToken();
    const refreshToken = (user as any).generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

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
                "Email verified successfully. Welcome to SafarFlow!"
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
        throw new ApiError(404, "User does not exist");
    }

    // 3. Match Password
    const isPasswordValid = await (user as any).isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // 4. Check if verified
    if (!user.isVerified) {
        throw new ApiError(403, "Please verify your email before logging in.");
    }

    // 5. Generate Tokens
    const accessToken = (user as any).generateAccessToken();
    const refreshToken = (user as any).generateRefreshToken();

    // 6. Update Refresh Token in DB
    user.refreshToken = refreshToken;
    console.log(`💾 [PROD-DEBUG] Persisting refreshToken for Login User: ${email}`);
    await user.save({ validateBeforeSave: false });
    console.log(`✅ [PROD-DEBUG] User successfully updated in DB: ${user._id}`);

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
    await User.findByIdAndUpdate(
        (req as any).user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    );

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
    const { name } = req.body;

    if (!name) {
        throw new ApiError(400, "Name is required");
    }

    const updatedUser = await User.findByIdAndUpdate(
        (req as any).user._id,
        {
            $set: {
                name: name
            }
        },
        {
            new: true
        }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(new ApiResponse(200, updatedUser, "Account details updated successfully"));
});
