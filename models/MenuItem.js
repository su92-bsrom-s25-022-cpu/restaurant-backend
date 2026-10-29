const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: true,
        enum: ['starters', 'main', 'desserts', 'beverages', 'special'],
        index: true
    },
    image: {
        type: String,
        required: true
    },
    veg: {
        type: Boolean,
        default: false
    },
    spicy: {
        type: Number,
        default: 0,
        min: 0,
        max: 3
    },
    rating: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5
    },
    available: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String
    }]
}, {
    timestamps: true
});

// Text index for search
menuItemSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('MenuItem', menuItemSchema);
