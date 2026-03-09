import { Request, Response } from "express";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { registerSchema, loginSchema } from "../validators/user.validator.js";

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
    console.log(`🔍 Checking if user exists: ${email}`);
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    // 3. Create user
    const user = await User.create({
        name,
        email,
        password,
        avatar,
        role,
    });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // 4. Generate Tokens
    const accessToken = (createdUser as any).generateAccessToken();
    const refreshToken = (createdUser as any).generateRefreshToken();

    // 5. Store Refresh Token in DB
    createdUser.refreshToken = refreshToken;
    await createdUser.save({ validateBeforeSave: false });

    // 6. Options for cookies
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    // 6. Send response with tokens in cookies
    return res
        .status(201)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                201,
                {
                    user: createdUser,
                    accessToken,
                    refreshToken,
                },
                "User registered successfully"
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

    // 4. Generate Tokens
    const accessToken = (user as any).generateAccessToken();
    const refreshToken = (user as any).generateRefreshToken();

    // 5. Update Refresh Token in DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // 6. Get user without password
    const loggedInUser = await User.findById(user._id).select("-password");

    // 7. Cookies options
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
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
