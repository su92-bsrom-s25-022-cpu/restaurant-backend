require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const { menuSeedData } = require('../data/menuSeedData');

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing
        await MenuItem.deleteMany({});
        console.log('🗑️  Cleared existing menu items');

        // Insert new
        await MenuItem.insertMany(menuSeedData);
        console.log(`🌱 Seeded ${menuSeedData.length} menu items`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
