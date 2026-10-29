const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    trackOrder
} = require('../controllers/orderController');

router.post('/order', createOrder);
router.get('/orders', getAllOrders);
router.get('/order/:id', getOrderById);
router.get('/order/:id/track', trackOrder);
router.patch('/order/:id/status', updateOrderStatus);

module.exports = router;
