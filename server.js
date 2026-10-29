/**
 * ============================================
 * SAVORIA Restaurant Backend API
 * Developed by: Rehmat Developers
 * Lead Developer: Muhammad Waleed
 * Contact: +92 (328) 4461097
 * ============================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Internal imports
const connectDB = require('./config/database');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const errorHandler = require('./middleware/errorHandler');

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// SECURITY MIDDLEWARE
// ============================================
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// ============================================
// CORS CONFIGURATION
// ============================================
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
    : ['*'];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, curl)
        if (!origin) return callback(null, true);
        
        // Allow all origins in development
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        
        // In production, check against whitelist
        if (allowedOrigins.includes('*') || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked for origin: ${origin}`);
            callback(null, true); // Allow anyway for demo (change in production)
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ============================================
// GENERAL MIDDLEWARE
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ============================================
// RATE LIMITING
// ============================================
const limiter = rateLimit({
    windowMs: (parseInt(process.env.RATE_LIMIT_WINDOW) || 15) * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

app.use('/api/', limiter);

// ============================================
// DATABASE CONNECTION
// ============================================
connectDB();

// ============================================
// ROOT ROUTE / HEALTH CHECK
// ============================================
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: '🔥 Savoria Restaurant API is Live!',
        version: '1.0.0',
        developer: 'Rehmat Developers',
        lead: 'Muhammad Waleed',
        contact: '+92 (328) 4461097',
        location: 'Raja Jang, Kasur, Pakistan',
        documentation: {
            health: 'GET /api/health',
            menu: {
                getAll: 'GET /api/menu',
                getByCategory: 'GET /api/menu?category=starters',
                search: 'GET /api/menu?search=pizza',
                getById: 'GET /api/menu/:id'
            },
            orders: {
                create: 'POST /api/order',
                getById: 'GET /api/order/:id',
                getAll: 'GET /api/orders',
                updateStatus: 'PATCH /api/order/:id/status'
            },
            reservations: {
                create: 'POST /api/reserve',
                getById: 'GET /api/reserve/:id',
                getAll: 'GET /api/reservations'
            }
        },
        timestamp: new Date().toISOString()
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'healthy',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString()
    });
});

// ============================================
// API ROUTES
// ============================================
app.use('/api/menu', menuRoutes);
app.use('/api', orderRoutes);
app.use('/api', reservationRoutes);

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
        availableEndpoints: [
            'GET /',
            'GET /api/health',
            'GET /api/menu',
            'POST /api/order',
            'POST /api/reserve'
        ]
    });
});

// ============================================
// GLOBAL ERROR HANDLER
// ============================================
app.use(errorHandler);

// ============================================
// START SERVER
// ============================================
const server = app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║     🔥 SAVORIA RESTAURANT API                     ║
║                                                   ║
║     Status: ✅ RUNNING                            ║
║     Port:   ${PORT}                                   ║
║     Env:    ${process.env.NODE_ENV || 'development'}                            ║
║                                                   ║
║     Developed by: Rehmat Developers               ║
║     Lead: Muhammad Waleed                         ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    server.close(() => process.exit(1));
});

module.exports = app;
