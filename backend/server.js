require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const brandRoutes = require('./routes/brandRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cart');  // Import cart routes

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection failed:", err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', brandRoutes);
app.use('/api', productRoutes);
app.use('/api/cart', cartRoutes);  // Add cart route

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
