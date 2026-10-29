const express = require('express');
const router = express.Router();
const {
    createReservation,
    getReservationById,
    getAllReservations,
    cancelReservation,
    checkAvailability
} = require('../controllers/reservationController');

router.post('/reserve', createReservation);
router.get('/reservations', getAllReservations);
router.get('/reservations/availability', checkAvailability);
router.get('/reserve/:id', getReservationById);
router.patch('/reserve/:id/cancel', cancelReservation);

module.exports = router;
