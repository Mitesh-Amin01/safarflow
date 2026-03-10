import app from "../src/app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || "";

// Cache connection
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function handler(req: any, res: any) {
    if (!MONGO_URI) {
        console.error("❌ CRITICAL: MONGO_URI or MONGODB_URI is not defined in environment variables.");
        return res.status(500).json({
            error: "Database configuration missing",
            details: "Please ensure MONGO_URI or MONGODB_URI is set in Vercel environment variables."
        });
    }

    if (!cached.conn) {
        if (!cached.promise) {
            console.log("⏳ Connecting to MongoDB (Serverless)...");
            cached.promise = mongoose.connect(MONGO_URI, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                family: 4,
                connectTimeoutMS: 10000,
            } as any).then((m) => {
                console.log("✅ MongoDB Connected (Serverless)");
                return m;
            }).catch((err) => {
                console.error("❌ MongoDB Connection Error (Serverless):", err.message);
                cached.promise = null; // Reset promise on failure
                throw err;
            });
        }

        try {
            cached.conn = await cached.promise;
        } catch (error: any) {
            return res.status(500).json({
                error: "Database connection failed",
                message: error.message
            });
        }
    }

    return app(req, res);
}
