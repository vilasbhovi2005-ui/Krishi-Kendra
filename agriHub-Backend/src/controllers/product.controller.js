const ProductModel = require('../models/product.model');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    
    if (category) {
      query.category = category;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    // Hide out-of-stock products from the public feed
    query.stock = { $gt: 0 };

    const products = await ProductModel.find(query).populate('seller', 'fullName username');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching products', error: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate('seller', 'fullName username');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching product', error: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Seller
const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, image, stock } = req.body;

    const product = new ProductModel({
      title,
      description,
      price,
      category,
      image: image || undefined, // Use default if empty
      stock,
      seller: req.user._id // from auth middleware
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error creating product', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Seller
const updateProduct = async (req, res) => {
  try {
    const { title, description, price, category, image, stock } = req.body;

    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if seller owns the product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this product' });
    }

    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    if (image) product.image = image;
    if (stock !== undefined) product.stock = stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating product', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Seller
const deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if seller owns the product
    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this product' });
    }

    await ProductModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error deleting product', error: error.message });
  }
};

// @desc    Get products by seller
// @route   GET /api/products/seller/myproducts
// @access  Private/Seller
const getMyProducts = async (req, res) => {
    try {
        const products = await ProductModel.find({ seller: req.user._id });
        res.json(products);
    } catch(error) {
        res.status(500).json({ message: 'Server Error fetching my products', error: error.message });
    }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts
};
