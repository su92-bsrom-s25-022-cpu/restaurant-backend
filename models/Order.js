const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    id: String,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, min: 1 },
    image: String,
    customizations: {
        toppings: [String],
        spice: String,
        portion: String,
        notes: String
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    customer: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true },
        email: String
    },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    delivery: { type: Number, default: 2.50 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    promo: {
        code: String,
        discount: Number
    },
    payment: {
        method: {
            type: String,
            enum: ['cod', 'card', 'whatsapp'],
            default: 'cod'
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending'
        }
    },
    status: {
        type: String,
        enum: ['received', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
        default: 'received',
        index: true
    },
    estimatedDelivery: Date,
    notes: String
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
