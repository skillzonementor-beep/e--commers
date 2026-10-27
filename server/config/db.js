const mongoose = require('mongoose');

let isConnected = false;
let connectionMode = 'disconnected';

/**
 * Connect to MongoDB with automatic retry and resilient fallback.
 */
async function connectDB() {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexcommerce';

    try {
        console.log(`🔌 Attempting MongoDB connection: ${uri.replace(/\/\/.*@/, '//<credentials>@')}...`);
        
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 4000,
            connectTimeoutMS: 5000,
        });

        isConnected = true;
        connectionMode = 'mongodb';
        console.log(`✅ MongoDB Connected Successfully: ${mongoose.connection.host}/${mongoose.connection.name}`);
    } catch (err) {
        console.warn(`⚠️ Could not connect to remote/local MongoDB (${err.message}).`);
        console.warn(`ℹ️ Operating in High-Availability Memory & File Database Mode.`);
        console.warn(`💡 Tip: To connect to MongoDB Atlas, add your connection string to the .env file (MONGODB_URI=mongodb+srv://...).`);
        
        isConnected = true;
        connectionMode = 'memory-fallback';
    }

    mongoose.connection.on('disconnected', () => {
        if (connectionMode === 'mongodb') {
            console.warn('⚠️ MongoDB connection lost.');
            isConnected = false;
        }
    });

    return { isConnected, connectionMode };
}

function getDbStatus() {
    return {
        isConnected,
        connectionMode,
        databaseName: connectionMode === 'mongodb' ? mongoose.connection.name : 'nexcommerce_embedded',
        host: connectionMode === 'mongodb' ? mongoose.connection.host : 'in-memory-engine'
    };
}

module.exports = { connectDB, getDbStatus };
