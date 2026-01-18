const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- MIDDLEWARE ---

// 1. Enable CORS (Allows Frontend to talk to Backend)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5001', 'http://127.0.0.1:3000'],
  credentials: true
}));

// 2. Accept JSON data in requests
app.use(express.json()); 

// --- ROUTES ---
app.use('/api/auth', authRoutes);      // Matches your AuthContext Login/Register
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);

// --- STATIC FILE SERVING (Images) ---
const backendUploads = path.join(__dirname, 'uploads');
const rootUploads = path.join(__dirname, '../uploads');

if (fs.existsSync(backendUploads)) {
    app.use('/uploads', express.static(backendUploads));
} else if (fs.existsSync(rootUploads)) {
    app.use('/uploads', express.static(rootUploads));
}

// --- ERROR HANDLING MIDDLEWARE (Add this!) ---

// 1. Handle "Not Found" Routes
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// 2. Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));