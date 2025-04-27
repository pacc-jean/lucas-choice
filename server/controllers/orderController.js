const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Create a new order from cart items
// @route   POST /api/orders/from-cart
// @access  Private
exports.createOrderFromCart = async (req, res) => {
  const userId = req.user._id;

  try {
    // Fetch all cart items for the user
    const cartItems = await Cart.find({ user: userId }).populate('product');

    if (!cartItems.length) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // Prepare order items array
    const orderItems = cartItems.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      total: item.product.price * item.quantity,
    }));

    // Calculate total amount
    const totalAmount = orderItems.reduce((acc, item) => acc + item.total, 0);

    // Create the order
    const order = new Order({
      user: userId,
      items: orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      totalAmount,
    });

    await order.save();

    // Remove items from cart
    await Cart.deleteMany({ user: userId });

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order from cart:', error.message);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// @desc    Create a new order directly (without using the cart)
// @route   POST /api/orders/quick
// @access  Private
exports.createOrderQuick = async (req, res) => {
  const { productId, quantity, shippingAddress, paymentMethod } = req.body;
  const userId = req.user._id;

  try {
    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate total
    const total = product.price * quantity;

    // Create order
    const order = new Order({
      user: userId,
      items: [
        {
          product: productId,
          quantity,
          total,
        },
      ],
      shippingAddress,
      paymentMethod,
      totalAmount: total,
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating quick order:', error.message);
    res.status(500).json({ message: 'Failed to create order' });
  }
};

// @desc    Get all orders (for admin or the logged-in user)
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  const userId = req.user._id;

  try {
    const orders = await Order.find({ user: userId });

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ message: 'Failed to get orders' });
  }
};

// @desc    Get a single order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  const userId = req.user._id;
  const orderId = req.params.id;

  try {
    const order = await Order.findOne({ _id: orderId, user: userId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error.message);
    res.status(500).json({ message: 'Failed to get order' });
  }
};

// @desc    Update an existing order (e.g., status updates)
// @route   PUT /api/orders/:id
// @access  Admin or owner
exports.updateOrder = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status if provided
    if (orderStatus) {
      order.orderStatus = orderStatus;
    }

    // Update payment status if provided
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;

      // If marked as paid and no paidAt date yet, set it
      if (paymentStatus === 'paid' && !order.paidAt) {
        order.paidAt = new Date();
      }
    }

    await order.save();
    res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order:', error.message);
    res.status(500).json({ message: 'Failed to update order' });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Admin or owner
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow deletion if order is in "Pending" status
    if (order.orderStatus !== 'Pending') {
      return res.status(400).json({ message: 'Cannot delete order in this status' });
    }

    // Use deleteOne() instead of remove()
    await Order.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Order deleted' });
  } catch (error) {
    console.error('Error deleting order:', error.message);
    res.status(500).json({ message: 'Failed to delete order' });
  }
};
