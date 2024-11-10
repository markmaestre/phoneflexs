const Order = require('../models/Order');
const Product = require('../models/Product');

// Create Order
exports.createOrder = async (req, res) => {
  const { products } = req.body;
  const userId = req.user._id;
  
  try {
    // Calculate total price and update stock
    let totalPrice = 0;
    const productDetails = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product || product.stocks < item.quantity) {
          throw new Error(`Product ${product.name || 'unknown'} has insufficient stock`);
        }

        // Update stock
        product.stocks -= item.quantity;
        await product.save();

        totalPrice += product.price * item.quantity;
        return { 
          productId: product._id, 
          quantity: item.quantity, 
          price: product.price 
        };
      })
    );

    // Create order
    const order = new Order({
      userId,
      products: productDetails,
      totalPrice,
    });
    await order.save();

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(400).json({ message: 'Error creating order', error: error.message });
  }
};

// Get Orders for a User
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).populate('products.productId', 'name price');
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching orders', error: error.message });
  }
};
