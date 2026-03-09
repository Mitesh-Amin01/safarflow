import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request - No token provided");
        }

        const decodedToken: any = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "");
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken -otp -otpExpiry");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token - User not found");
        }

        (req as any).user = user;
        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
            throw new ApiError(403, "Access token expired");
        }
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});
