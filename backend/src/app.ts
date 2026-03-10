import express, { Application, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { ApiError } from './utils/ApiError.js';
import dotenv from "dotenv";

dotenv.config();
const app: Application = express();

// Middleware
app.use(((helmet as any).default || helmet)());
app.use(cors({
    origin: ["http://localhost:5173", "https://safarflow.online", "https://www.safarflow.online"],
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes Import
import userRouter from "./routes/user.routes.js";

// Routes Declaration
app.use("/api/v1/users", userRouter);

// Health Check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        status: 'UP',
        timestamp: new Date().toISOString(),
        service: 'SafarFlow Backend'
    });
});

// Root Route
app.get('/', (req: Request, res: Response) => {
    const states = ['DISCONNECTED', 'CONNECTED', 'CONNECTING', 'DISCONNECTING'];
    const readyState = mongoose.connection.readyState;
    const dbStatus = states[readyState] || 'UNKNOWN';

    if (readyState !== 1) {
        const hasUri = !!(process.env.MONGO_URI || process.env.MONGODB_URI);
        return res.status(200).send(`SafarFlow API - Elite Travel Concierge Engine Active. [DB: ${dbStatus}] (Config check: URI_${hasUri ? 'FOUND' : 'MISSING'}) ${process.env.MONGO_URI} ${process.env.MONGODB_URI}`);
    }

    res.status(200).send(`SafarFlow API - Elite Travel Concierge Engine Active. [DB: ${dbStatus}]`);
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
            data: err.data,
        });
    }

    // Default error
    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

export default app;
