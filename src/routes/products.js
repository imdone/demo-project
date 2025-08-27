const express = require('express');
const Joi = require('joi');
const Product = require('../models/Product');

const router = express.Router();

// Validation schemas
const productSchema = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().min(10).required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().valid('electronics', 'clothing', 'books', 'home', 'sports', 'toys').required(),
  brand: Joi.string().optional(),
  sku: Joi.string().required(),
  stock: Joi.number().min(0).required(),
  weight: Joi.number().min(0).optional(),
  dimensions: Joi.object({
    length: Joi.number().min(0),
    width: Joi.number().min(0),
    height: Joi.number().min(0)
  }).optional(),
  tags: Joi.array().items(Joi.string()).optional()
});

// Get all products with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-__v'),
      Product.countDocuments(filter)
    ]);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-__v');
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.isActive) {
      return res.status(404).json({ error: 'Product not available' });
    }

    res.json({ product });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create new product (admin only - simplified for demo)
router.post('/', async (req, res) => {
  try {
    // Validate input
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details.map(d => d.message) 
      });
    }

    // Check if SKU already exists
    const existingProduct = await Product.findOne({ sku: value.sku });
    if (existingProduct) {
      return res.status(400).json({ error: 'Product with this SKU already exists' });
    }

    // Create product
    const product = new Product(value);
    await product.save();

    res.status(201).json({
      message: 'Product created successfully',
      product
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only - simplified for demo)
router.put('/:id', async (req, res) => {
  try {
    // Validate input (partial update)
    const updateSchema = productSchema.fork(
      ['name', 'description', 'price', 'category', 'sku', 'stock'],
      (schema) => schema.optional()
    );
    
    const { error, value } = updateSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.details.map(d => d.message) 
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({
      message: 'Product updated successfully',
      product
    });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only - simplified for demo)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
