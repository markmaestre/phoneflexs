const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

// Add product to cart
router.post('/add-to-cart', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Check if the quantity is available
    if (quantity > product.stocks) return res.status(400).json({ message: 'Not enough stock' });

    // Find the user's cart or create a new one
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    // Check if the product is already in the cart
    const existingProduct = cart.products.find(item => item.product.toString() === productId);
    if (existingProduct) {
      existingProduct.quantity += quantity;  // Increase quantity if product already in cart
    } else {
      cart.products.push({ product: productId, quantity });  // Add new product to cart
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
