const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path'); // <--- IMPORT PATH MODULE

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads (Images)
app.use('/uploads', express.static('uploads'));

// --- API ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// -------------------------------------------------------------------------
//  SERVE FRONTEND (This makes it run on Port 5000)
// -------------------------------------------------------------------------

// 1. Serve static files from the frontend build folder
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// 2. Catch-All Route: Send index.html for any request that isn't an API
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// -------------------------------------------------------------------------

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 App is running on port ${PORT}`);
  console.log(`🔗 Open http://localhost:${PORT} to view your app`);
});