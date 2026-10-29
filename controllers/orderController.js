const Order = require('../models/Order');
const { generateOrderId } = require('../utils/idGenerator');
const mongoose = require('mongoose');

// In-memory fallback orders
const inMemoryOrders = new Map();

// @desc    Create new order
// @route   POST /api/order
exports.createOrder = async (req, res, next) => {
    try {
        const {
            customer,
            items,
            subtotal,
            delivery,
            tax,
            discount,
            total,
            promo,
            payment
        } = req.body;

        // Validation
        if (!customer || !customer.name || !customer.phone || !customer.address) {
            return res.status(400).json({
                success: false,
                message: 'Customer details (name, phone, address) are required'
            });
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Order must contain at least one item'
            });
        }

        const orderId = generateOrderId();
        const estimatedDelivery = new Date(Date.now() + 45 * 60 * 1000); // 45 min

        const orderData = {
            orderId,
            customer,
            items,
            subtotal: parseFloat(subtotal) || 0,
            delivery: parseFloat(delivery) || 2.50,
            tax: parseFloat(tax) || 0,
            discount: parseFloat(discount) || 0,
            total: parseFloat(total) || 0,
            promo: promo ? { code: promo, discount: parseFloat(discount) || 0 } : undefined,
            payment: {
                method: payment || 'cod',
                status: 'pending'
            },
            status: 'received',
            estimatedDelivery
        };

        // Try DB, fallback to memory
        if (mongoose.connection.readyState === 1) {
            const order = await Order.create(orderData);
            return res.status(201).json({
                success: true,
                message: 'Order placed successfully',
                orderId: order.orderId,
                id: order.orderId,
                estimatedDelivery: order.estimatedDelivery,
                data: order
            });
        } else {
            inMemoryOrders.set(orderId, { ...orderData, createdAt: new Date() });
            return res.status(201).json({
                success: true,
                message: 'Order placed successfully (in-memory)',
                orderId,
                id: orderId,
                estimatedDelivery,
                data: orderData
            });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/order/:id
exports.getOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (mongoose.connection.readyState !== 1) {
            const order = inMemoryOrders.get(id);
            if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
            return res.status(200).json({ success: true, data: order });
        }

        const order = await Order.findOne({ orderId: id });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
exports.getAllOrders = async (req, res, next) => {
    try {
        const { status, limit = 50, page = 1 } = req.query;

        if (mongoose.connection.readyState !== 1) {
            let orders = Array.from(inMemoryOrders.values());
            if (status) orders = orders.filter(o => o.status === status);
            return res.status(200).json({
                success: true,
                count: orders.length,
                data: orders
            });
        }

        const query = status ? { status } : {};
        const orders = await Order.find(query)
            .sort('-createdAt')
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status
// @route   PATCH /api/order/:id/status
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['received', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
            });
        }

        if (mongoose.connection.readyState !== 1) {
            const order = inMemoryOrders.get(req.params.id);
            if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
            order.status = status;
            inMemoryOrders.set(req.params.id, order);
            return res.status(200).json({ success: true, data: order });
        }

        const order = await Order.findOneAndUpdate(
            { orderId: req.params.id },
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated',
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get order tracking info
// @route   GET /api/order/:id/track
exports.trackOrder = async (req, res, next) => {
    try {
        let order;
        
        if (mongoose.connection.readyState !== 1) {
            order = inMemoryOrders.get(req.params.id);
        } else {
            order = await Order.findOne({ orderId: req.params.id });
        }

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Simulate progress based on time
        const elapsed = (Date.now() - new Date(order.createdAt).getTime()) / 60000;
        let currentStep = 1;
        if (elapsed > 2) currentStep = 2;
        if (elapsed > 10) currentStep = 3;
        if (elapsed > 30) currentStep = 4;

        const steps = [
            { step: 1, name: 'Order Received', completed: currentStep >= 1 },
            { step: 2, name: 'Preparing', completed: currentStep >= 2 },
            { step: 3, name: 'Out for Delivery', completed: currentStep >= 3 },
            { step: 4, name: 'Delivered', completed: currentStep >= 4 }
        ];

        res.status(200).json({
            success: true,
            orderId: order.orderId,
            status: order.status,
            currentStep,
            steps,
            estimatedDelivery: order.estimatedDelivery,
            order
        });
    } catch (error) {
        next(error);
    }
};
