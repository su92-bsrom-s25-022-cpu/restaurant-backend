const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    reservationId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
    },
    phone: {
        type: String,
        required: [true, 'Phone is required'],
        trim: true
    },
    date: {
        type: String,
        required: [true, 'Date is required']
    },
    time: {
        type: String,
        required: [true, 'Time is required']
    },
    guests: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    seating: {
        type: String,
        required: true,
        enum: ['indoor', 'rooftop', 'vip', 'garden']
    },
    notes: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'confirmed'
    }
}, {
    timestamps: true
});

reservationSchema.index({ date: 1, time: 1 });

module.exports = mongoose.model('Reservation', reservationSchema);
