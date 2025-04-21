const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, (req, res) => {
  res.json(req.user);
});

router.put('/account', protect, updateUser);
router.delete('/account', protect, deleteUser);

module.exports = router;
