const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user._id;

  try {
    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the item is already in the cart
    let cartItem = await Cart.findOne({ user: userId, product: productId });

    if (cartItem) {
      // Update quantity if the item already exists in the cart
      cartItem.quantity += quantity;
      await cartItem.save();
      return res.status(200).json(cartItem);
    } else {
      // Create a new cart item if not found
      cartItem = new Cart({
        user: userId,
        product: productId,
        quantity,
      });
      await cartItem.save();
      return res.status(201).json(cartItem);
    }
  } catch (error) {
    console.error('Error adding to cart:', error.message);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:id
// @access  Private
exports.updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  const userId = req.user._id;
  const cartItemId = req.params.id;

  try {
    // Find the cart item
    const cartItem = await Cart.findOne({ _id: cartItemId, user: userId });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Update quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    res.status(200).json(cartItem);
  } catch (error) {
    console.error('Error updating cart item:', error.message);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
exports.removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const cartItemId = req.params.id;

  try {
    // Find and remove the cart item
    const cartItem = await Cart.findOneAndDelete({ _id: cartItemId, user: userId });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error.message);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
};

// @desc    Get all items in the cart
// @route   GET /api/cart
// @access  Private
exports.getCartItems = async (req, res) => {
  const userId = req.user._id;

  try {
    // Fetch all cart items for the user
    const cartItems = await Cart.find({ user: userId }).populate('product');

    if (!cartItems.length) {
      return res.status(404).json({ message: 'Your cart is empty' });
    }

    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error.message);
    res.status(500).json({ message: 'Failed to get cart items' });
  }
};
