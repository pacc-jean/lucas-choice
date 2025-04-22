const Category = require('../models/Category');

// @desc    Create a new category
// @route   POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:slug
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:slug
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
