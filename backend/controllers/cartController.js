const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add product to cart
exports.addToCart = async (req, res) => {
  const userId = req.user._id;  // assuming you are using JWT auth and the user info is added in the `req.user` object
  const { productId, quantity } = req.body;

  try {
    // Check if the cart already exists for the user
    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // Check if the product already exists in the cart
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex > -1) {
        // Update the quantity if the product exists
        cart.products[productIndex].quantity += quantity;
      } else {
        // Add new product if not in the cart
        cart.products.push({ product: productId, quantity });
      }
    } else {
      // Create a new cart if it doesn't exist
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity }],
      });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('products.product');
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Update product quantity in cart
exports.updateCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
      res.json(cart);
    } else {
      return res.status(404).json({ msg: 'Product not in cart' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Remove product from cart
exports.removeProductFromCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  try {
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
