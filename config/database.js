const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.warn('⚠️  MONGODB_URI not set. Running in no-database mode (in-memory fallback).');
            return;
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        // Seed menu if empty
        const MenuItem = require('../models/MenuItem');
        const { menuSeedData } = require('../data/menuSeedData');
        const count = await MenuItem.countDocuments();
        if (count === 0) {
            await MenuItem.insertMany(menuSeedData);
            console.log(`🌱 Seeded ${menuSeedData.length} menu items`);
        }

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected');
        });

    } catch (error) {
        console.error('❌ MongoDB connection failed:', error.message);
        console.warn('⚠️  Running without database. Using in-memory storage.');
    }
};

module.exports = connectDB;
