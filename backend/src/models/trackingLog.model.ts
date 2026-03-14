import mongoose, { Schema } from "mongoose";

const trackingLogSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        email: {
            type: String,
            required: true,
            trim: true,
            index: true, // For fast querying by email
        },
        action: {
            type: String,
            enum: ["LOGIN", "LOGOUT", "SIGNUP", "UPDATE", "DELETE"],
            required: true,
            default: "LOGIN",
        },
        status: {
            type: String,
            enum: ["SUCCESS", "FAILED", "BLOCKED"],
            required: true,
        },
        metadata: {
            // For UPDATE events, what changed? (e.g. { modifiedFields: ["name", "bio"] })
            type: Schema.Types.Mixed,
        },
        ipAddress: {
            type: String,
        },
        location: {
            city: String,
            country: String,
            lat: Number,
            lng: Number,
        },
        deviceDetails: {
            browser: String,
            os: String,
            deviceType: String,
        },
        failureReason: {
            type: String,
        },
        sessionId: {
            type: String,
        },
    },
    { timestamps: true }
);

export const TrackingLog = mongoose.model("TrackingLog", trackingLogSchema);
