const express = require('express');
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductBySlug,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Routes
router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.put('/:slug', updateProduct);
router.delete('/:slug', deleteProduct);

module.exports = router;
