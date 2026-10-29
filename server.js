const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (Cross-Origin requests allow karne ke liye)
app.use(cors());
app.use(express.json());

// Sample Menu Data
const menuData = [
  { id: 1, name: "Gourmet Beef Burger", category: "Main", price: 12.99, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "Margherita Pizza", category: "Main", price: 14.50, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=80" },
  { id: 3, name: "Creamy Alfredo Pasta", category: "Main", price: 11.00, image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281216?auto=format&fit=crop&w=500&q=80" },
  { id: 4, name: "Chocolate Lava Cake", category: "Dessert", price: 6.50, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80" }
];

// In-Memory Database (Demo ke liye)
let orders = [];
let reservations = [];

// 1. Health Check Endpoint
app.get('/', (req, res) => {
  res.send('Savoria Restaurant API is Running!');
});

// 2. Get Menu Items API
app.get('/api/menu', (req, res) => {
  res.json({ success: true, data: menuData });
});

// 3. Place Food Order API
app.post('/api/order', (req, res) => {
  const { customerName, phone, address, items, totalAmount } = req.body;
  
  if (!customerName || !phone || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Missing required order details" });
  }

  const newOrder = {
    id: orders.length + 1,
    customerName,
    phone,
    address,
    items,
    totalAmount,
    status: "Pending",
    createdAt: new Date()
  };

  orders.push(newOrder);
  console.log("New Order Received:", newOrder);

  res.status(201).json({
    success: true,
    message: "Order placed successfully!",
    orderId: newOrder.id
  });
});

// 4. Book Table Reservation API
app.post('/api/reserve', (req, res) => {
  const { name, phone, date, time, guests } = req.body;

  if (!name || !phone || !date || !time || !guests) {
    return res.status(400).json({ success: false, message: "Please fill all reservation fields" });
  }

  const newReservation = {
    id: reservations.length + 1,
    name,
    phone,
    date,
    time,
    guests,
    createdAt: new Date()
  };

  reservations.push(newReservation);
  console.log("New Reservation Received:", newReservation);

  res.status(201).json({
    success: true,
    message: "Table reserved successfully!",
    reservationId: newReservation.id
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
