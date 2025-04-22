const express = require('express');
const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

// Routes
router.post('/', createCategory);
router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);
router.put('/:slug', updateCategory);
router.delete('/:slug', deleteCategory);

module.exports = router;
