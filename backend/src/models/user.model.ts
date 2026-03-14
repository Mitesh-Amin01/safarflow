import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        // --- BASIC IDENTITY ---
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        phoneNumber: {
            type: String,
            unique: true,
            sparse: true, // Allows multiple nulls for users who haven't added a number yet
        },
        password: {
            type: String,
            required: function(this: any) {
                return this.authType === "EMAIL";
            },
        },

        // --- DUAL VERIFICATION SYSTEM (MISSING PIECE) ---
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isPhoneVerified: {
            type: Boolean,
            default: false,
        },
        isTwoFactorEnabled: {
            type: Boolean,
            default: false,
        },
        emailOtp: { type: String },
        phoneOtp: { type: String },
        otpExpiry: { type: Date },

        // --- PROFILE & DEMOGRAPHICS ---
        avatar: { type: String, default: "" },
        gender: { type: String, enum: ["Male", "Female", "Other", "Secret"] },
        dob: { type: Date },
        nationality: { type: String },
        bio: { type: String, maxLength: 300 },
        currentAddress: {
            street: String,
            city: String,
            state: String,
            country: String,
        },
        emergencyDocumentHub: { type: String, maxLength: 100 },

        // --- SUBSCRIPTION & ECONOMY ---
        isPremium: { type: Boolean, default: false },
        planType: { type: String, enum: ["FREE", "PRO", "ENTERPRISE"], default: "FREE" },
        stripeCustomerId: { type: String },
        subscriptionExpiresAt: { type: Date },

        // --- ADMIN & FORENSICS ---
        role: {
            type: String,
            enum: ["USER", "ADMIN", "MODERATOR"],
            default: "USER",
        },
        accountStatus: {
            type: String,
            enum: ["ACTIVE", "SUSPENDED", "BANNED"],
            default: "ACTIVE",
        },
        lastLoginIP: { type: String },
        lastLoginDate: { type: Date },
        deviceInfo: {
            browser: String,
            os: String,
            deviceType: String, // Mobile/Desktop
        },
        accountCreatedDate: { type: Date, default: Date.now }, // Explicit field to track account age easily
        
        // --- AUTH TOKENS ---
        authType: { type: String, enum: ["EMAIL", "GOOGLE"], default: "EMAIL" },
        googleId: { type: String, unique: true, sparse: true },
        refreshToken: { type: String },
    },
    { timestamps: true }
);

// --- METHODS & MIDDLEWARE ---

// Auto-hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Compare Password
userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

// Access Token
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { 
            _id: this._id, 
            email: this.email, 
            name: this.name,
            role: this.role, 
            isPremium: this.isPremium 
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any }
    );
};

// Refresh Token
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any,
        }
    );
};

export const User = mongoose.model("User", userSchema);
