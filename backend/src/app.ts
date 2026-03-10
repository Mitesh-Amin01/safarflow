import express from "express";
import type { Application, Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/ApiError.js";

// Routes Import
import userRouter from "./routes/user.routes.js";

const app: Application = express();

/* ----------------------------- Middleware ----------------------------- */

app.use(((helmet as any).default || helmet)());

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "https://safarflow.online",
            "https://www.safarflow.online",
        ],
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

/* ----------------------------- Routes ----------------------------- */

app.use("/api/v1/users", userRouter);

/* ----------------------------- Health Check ----------------------------- */

app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        status: "UP",
        service: "SafarFlow Backend",
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? "CONNECTED" : "CONNECTING",
    });
});

/* ----------------------------- Root Route ----------------------------- */

app.get("/", (req: Request, res: Response) => {
    const states = ["DISCONNECTED", "CONNECTED", "CONNECTING", "DISCONNECTING"];
    const readyState = mongoose.connection.readyState;

    const dbStatus = states[readyState] || "UNKNOWN";
    const hasUri = !!(process.env.MONGO_URI || process.env.MONGODB_URI);

    res.status(200).json({
        message: "SafarFlow API - Elite Travel Concierge Engine Active",
        database: dbStatus,
        config: hasUri ? "URI_FOUND" : "URI_MISSING",
    });
});

/* ----------------------------- Error Handler ----------------------------- */

app.use(
    (err: unknown, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof ApiError) {
            return res.status(err.statusCode).json({
                success: err.success,
                message: err.message,
                errors: err.errors,
                data: err.data,
            });
        }

        const message =
            err instanceof Error ? err.message : "Internal Server Error";

        return res.status(500).json({
            success: false,
            message,
        });
    }
);

export default app;