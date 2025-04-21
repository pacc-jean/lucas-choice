const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/signup
// @access  Public
const registerUser = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    // 1. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with that email' });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create new user
    const user = await User.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    // 4. Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // 5. Send response
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error('Signup Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login a user
// @route   POST /api/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // 1. Find user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // 2. Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // 3. Generate token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      });
  
      // 4. Send response
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
      });
    } catch (error) {
      console.error('Login Error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
module.exports = { registerUser, loginUser };
