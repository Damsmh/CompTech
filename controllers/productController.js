const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', { products, layout: 'layouts/main' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('product', { product, layout: 'layouts/main' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      manufacturer: req.body.manufacturer,
      price: req.body.price,
      stock: req.body.stock,
    });
    await product.save();
    res.redirect('/products');
  } catch (err) {
    res.status(400).send('Error creating product');
  }
};