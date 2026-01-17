const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs'); // Import file system module

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);

// ----------------------------------------------------
// UNIVERSAL IMAGE FIX
// ----------------------------------------------------
// Check if uploads folder is in backend or root, and serve the correct one
const backendUploads = path.join(__dirname, 'uploads');
const rootUploads = path.join(__dirname, '../uploads');

if (fs.existsSync(backendUploads)) {
    console.log(`✅ Serving images from backend folder: ${backendUploads}`);
    app.use('/uploads', express.static(backendUploads));
} else if (fs.existsSync(rootUploads)) {
    console.log(`✅ Serving images from root folder: ${rootUploads}`);
    app.use('/uploads', express.static(rootUploads));
} else {
    console.log('⚠️ Warning: Uploads folder not found in backend or root!');
}

// ----------------------------------------------------
// FRONTEND SERVING
// ----------------------------------------------------
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));