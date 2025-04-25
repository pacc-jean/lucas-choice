const express = require('express');
const router = express.Router();
const {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCartItems
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');


router.post('/', protect, addToCart);
router.get('/', protect, getCartItems);
router.put('/:id', protect, updateCartItem);
router.delete('/:id', protect, removeFromCart);

module.exports = router;
