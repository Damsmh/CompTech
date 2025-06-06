const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', { products });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('product', { product });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      stock: req.body.stock,
    });
    await product.save();
    res.redirect('/products');
  } catch (err) {
    res.status(400).send('Error creating product');
  }
};