import app from "../src/app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "";

// Cache connection
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export default async function handler(req: any, res: any) {
    if (!cached.conn) {
        if (!cached.promise) {
            console.log("⏳ Connecting to MongoDB (Serverless)...");
            cached.promise = mongoose.connect(MONGO_URI, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
                family: 4,
            } as any).then((m) => {
                console.log("✅ MongoDB Connected (Serverless)");
                return m;
            });
        }
        cached.conn = await cached.promise;
    }

    return app(req, res);
}
