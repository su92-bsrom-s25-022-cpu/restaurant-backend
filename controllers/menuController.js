const MenuItem = require('../models/MenuItem');
const { menuSeedData } = require('../data/menuSeedData');
const mongoose = require('mongoose');

// Fallback in-memory menu for when DB is unavailable
const getFallbackMenu = () => menuSeedData;

// @desc    Get all menu items
// @route   GET /api/menu
exports.getAllMenuItems = async (req, res, next) => {
    try {
        const { category, search, veg, limit = 100, sort = '-rating' } = req.query;

        // Check if DB is connected
        if (mongoose.connection.readyState !== 1) {
            let items = getFallbackMenu();
            if (category && category !== 'all') items = items.filter(i => i.category === category);
            if (search) {
                const q = search.toLowerCase();
                items = items.filter(i => 
                    i.name.toLowerCase().includes(q) || 
                    i.description.toLowerCase().includes(q)
                );
            }
            if (veg === 'true') items = items.filter(i => i.veg === true);
            
            return res.status(200).json({
                success: true,
                count: items.length,
                source: 'in-memory',
                data: items
            });
        }

        // Build query
        const query = { available: true };
        if (category && category !== 'all') query.category = category;
        if (veg === 'true') query.veg = true;

        let menuQuery = MenuItem.find(query);

        if (search) {
            menuQuery = MenuItem.find({
                ...query,
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } },
                    { tags: { $in: [new RegExp(search, 'i')] } }
                ]
            });
        }

        const items = await menuQuery.sort(sort).limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: items.length,
            source: 'database',
            data: items
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single menu item
// @route   GET /api/menu/:id
exports.getMenuItemById = async (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const item = getFallbackMenu().find(i => i.id === req.params.id);
            if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });
            return res.status(200).json({ success: true, data: item });
        }

        const item = await MenuItem.findOne({ id: req.params.id });
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        res.status(200).json({
            success: true,
            data: item
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new menu item (Admin)
// @route   POST /api/menu
exports.createMenuItem = async (req, res, next) => {
    try {
        const item = await MenuItem.create(req.body);
        res.status(201).json({
            success: true,
            message: 'Menu item created successfully',
            data: item
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update menu item (Admin)
// @route   PUT /api/menu/:id
exports.updateMenuItem = async (req, res, next) => {
    try {
        const item = await MenuItem.findOneAndUpdate(
            { id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!item) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Menu item updated',
            data: item
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete menu item (Admin)
// @route   DELETE /api/menu/:id
exports.deleteMenuItem = async (req, res, next) => {
    try {
        const item = await MenuItem.findOneAndDelete({ id: req.params.id });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Menu item not found' });
        }
        res.status(200).json({
            success: true,
            message: 'Menu item deleted'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get menu categories with counts
// @route   GET /api/menu/categories
exports.getCategories = async (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const items = getFallbackMenu();
            const categories = ['starters', 'main', 'desserts', 'beverages', 'special'].map(cat => ({
                name: cat,
                count: items.filter(i => i.category === cat).length
            }));
            return res.status(200).json({ success: true, data: categories });
        }

        const categories = await MenuItem.aggregate([
            { $match: { available: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $project: { _id: 0, name: '$_id', count: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        next(error);
    }
};
