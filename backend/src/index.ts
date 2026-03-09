import app from './app.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/safarflow';

const startServer = async () => {
    try {
        // Database Connection
        console.log('⏳ Connecting to MongoDB...');

        mongoose.connection.on('connected', () => console.log('✅ Mongoose connected to DB'));
        mongoose.connection.on('error', (err) => console.error('❌ Mongoose connection error:', err));
        mongoose.connection.on('disconnected', () => console.log('⚠️ Mongoose disconnected'));

        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        } as any);

        console.log(`✅ MongoDB Connected Successfully (State: ${mongoose.connection.readyState})`);

        app.listen(PORT, () => {
            console.log(`🚀 Elite Engine Active on port ${PORT}`);
            console.log(`🌐 Health check available at http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('❌ Server start failed:', error);
        process.exit(1);
    }
};

startServer();
