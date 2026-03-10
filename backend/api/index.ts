import app from "../src/app.js";
import mongoose from "mongoose";

const MONGO_URI: string =
    process.env.MONGO_URI || process.env.MONGODB_URI || "";

/* -------------------- Mongo Cache Type -------------------- */

interface Cached {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = global as typeof global & {
    mongoose?: Cached;
};

let cached: Cached = globalWithMongoose.mongoose || {
    conn: null,
    promise: null,
};

globalWithMongoose.mongoose = cached;

/* -------------------- Handler -------------------- */

export default async function handler(req: any, res: any) {
    try {
        if (!MONGO_URI) {
            console.error(
                "❌ CRITICAL: MONGO_URI or MONGODB_URI is not defined in environment variables."
            );

            return res.status(500).json({
                error: "Database configuration missing",
                details:
                    "Please ensure MONGO_URI or MONGODB_URI is set in Vercel environment variables.",
            });
        }

        /* -------------------- Mongo Connection -------------------- */

        if (!cached.conn) {
            if (!cached.promise) {
                console.log("⏳ Connecting to MongoDB (Serverless)...");

                cached.promise = mongoose
                    .connect(MONGO_URI, {
                        serverSelectionTimeoutMS: 5000,
                        connectTimeoutMS: 10000,
                        socketTimeoutMS: 45000,
                        family: 4,
                    })
                    .then((mongooseInstance) => {
                        console.log("✅ MongoDB Connected (Serverless)");
                        return mongooseInstance;
                    })
                    .catch((error) => {
                        console.error(
                            "❌ MongoDB Connection Error (Serverless):",
                            error.message
                        );
                        cached.promise = null;
                        throw error;
                    });
            }

            cached.conn = await cached.promise;
        }

        /* -------------------- Run Express -------------------- */

        return app(req, res);
    } catch (error: any) {
        console.error("❌ Handler Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
}