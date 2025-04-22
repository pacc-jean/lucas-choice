const Product = require('../models/Product');
const slugify = require('slugify');

// @desc    Create a new product
// @route   POST /api/products
// @access  Admin (for now, no restriction)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, images, sizes, colors, stock, trending } = req.body;
    const slug = slugify(name, { lower: true });

    const product = await Product.create({
      name,
      slug,
      description,
      price,
      category,
      images,
      sizes,
      colors,
      stock,
      trending,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error('Product creation failed:', err.message);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// @desc    Get all products
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { category, trending, newest } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (trending === 'true') filter.trending = true;

    let query = Product.find(filter).populate('category');

    if (newest === 'true') {
      query = query.sort({ createdAt: -1 });
    }

    const products = await query;
    res.json(products);
  } catch (err) {
    console.error('Failed to fetch products:', err.message);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// @desc    Get product by slug
// @route   GET /api/products/:slug
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error('Failed to fetch product:', err.message);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:slug
exports.updateProduct = async (req, res) => {
  try {
    const updatedData = { ...req.body };

    if (updatedData.name) {
      updatedData.slug = slugify(updatedData.name, { lower: true });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      updatedData,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error('Product update failed:', err.message);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:slug
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Product deletion failed:', err.message);
    res.status(500).json({ message: 'Error deleting product' });
  }
};
