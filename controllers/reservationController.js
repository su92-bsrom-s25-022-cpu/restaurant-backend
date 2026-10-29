const Reservation = require('../models/Reservation');
const { generateReservationId } = require('../utils/idGenerator');
const mongoose = require('mongoose');

// In-memory fallback
const inMemoryReservations = new Map();

// @desc    Create new reservation
// @route   POST /api/reserve
exports.createReservation = async (req, res, next) => {
    try {
        const { name, email, phone, date, time, guests, seating, notes } = req.body;

        // Validation
        if (!name || !email || !phone || !date || !time || !guests || !seating) {
            return res.status(400).json({
                success: false,
                message: 'All fields (name, email, phone, date, time, guests, seating) are required'
            });
        }

        const validSeatings = ['indoor', 'rooftop', 'vip', 'garden'];
        if (!validSeatings.includes(seating)) {
            return res.status(400).json({
                success: false,
                message: `Invalid seating. Must be: ${validSeatings.join(', ')}`
            });
        }

        const reservationId = generateReservationId();

        const reservationData = {
            reservationId,
            name,
            email,
            phone,
            date,
            time,
            guests: parseInt(guests),
            seating,
            notes: notes || '',
            status: 'confirmed'
        };

        if (mongoose.connection.readyState === 1) {
            const reservation = await Reservation.create(reservationData);
            return res.status(201).json({
                success: true,
                message: 'Reservation confirmed successfully',
                reservationId: reservation.reservationId,
                id: reservation.reservationId,
                data: reservation
            });
        } else {
            inMemoryReservations.set(reservationId, { ...reservationData, createdAt: new Date() });
            return res.status(201).json({
                success: true,
                message: 'Reservation confirmed (in-memory)',
                reservationId,
                id: reservationId,
                data: reservationData
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get reservation by ID
// @route   GET /api/reserve/:id
exports.getReservationById = async (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const reservation = inMemoryReservations.get(req.params.id);
            if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });
            return res.status(200).json({ success: true, data: reservation });
        }

        const reservation = await Reservation.findOne({ reservationId: req.params.id });
        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        res.status(200).json({
            success: true,
            data: reservation
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all reservations (Admin)
// @route   GET /api/reservations
exports.getAllReservations = async (req, res, next) => {
    try {
        const { date, status, limit = 50 } = req.query;

        if (mongoose.connection.readyState !== 1) {
            let reservations = Array.from(inMemoryReservations.values());
            if (date) reservations = reservations.filter(r => r.date === date);
            if (status) reservations = reservations.filter(r => r.status === status);
            return res.status(200).json({
                success: true,
                count: reservations.length,
                data: reservations
            });
        }

        const query = {};
        if (date) query.date = date;
        if (status) query.status = status;

        const reservations = await Reservation.find(query)
            .sort('-createdAt')
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel reservation
// @route   PATCH /api/reserve/:id/cancel
exports.cancelReservation = async (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            const reservation = inMemoryReservations.get(req.params.id);
            if (!reservation) return res.status(404).json({ success: false, message: 'Reservation not found' });
            reservation.status = 'cancelled';
            inMemoryReservations.set(req.params.id, reservation);
            return res.status(200).json({ success: true, data: reservation });
        }

        const reservation = await Reservation.findOneAndUpdate(
            { reservationId: req.params.id },
            { status: 'cancelled' },
            { new: true }
        );

        if (!reservation) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Reservation cancelled',
            data: reservation
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Check table availability
// @route   GET /api/reservations/availability
exports.checkAvailability = async (req, res, next) => {
    try {
        const { date, time, seating } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date is required'
            });
        }

        // Capacity per seating area
        const capacity = { indoor: 80, rooftop: 40, vip: 20, garden: 30 };

        if (mongoose.connection.readyState !== 1) {
            return res.status(200).json({
                success: true,
                available: true,
                capacity
            });
        }

        const query = { date, status: { $ne: 'cancelled' } };
        if (time) query.time = time;
        if (seating) query.seating = seating;

        const reservations = await Reservation.find(query);
        const bookedGuests = reservations.reduce((sum, r) => sum + r.guests, 0);

        res.status(200).json({
            success: true,
            date,
            time,
            seating,
            totalBookedGuests: bookedGuests,
            capacity,
            available: seating ? bookedGuests < capacity[seating] : true
        });
    } catch (error) {
        next(error);
    }
};
