const User = require('../models/User')
const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('cart.product');
    var totalsum = user.cart.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);

    res.render('cart', { products: user.cart, totalsum, layout: 'layouts/main' });
  } catch (err) {
    res.status(500).send('Server Error', err);
  }
};

exports.updateProductQuantity = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).send('User not found');
    const productIndex = user.cart.findIndex(
      (item) => item.product.toString() === req.params.id
    );
    if (productIndex === -1) return res.status(404).send('Product not found in cart');
    user.cart[productIndex].quantity = parseInt(req.body.quantity) || 1;
    await user.save();
    const updatedUser = await User.findById(req.userId).populate('cart.product');
    var totalsum = user.cart.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    res.render('cart', { products: updatedUser.cart, totalsum, layout: 'layouts/main' });
  } catch (err) {
      res.status(500).send('Error updating product quantity', err);
    }
  };

exports.addProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    const user = await User.findById(req.userId);
    if (!product || !user) return res.status(404).send('not found');
    user.cart.push({
      product: product._id,
      quantity: parseInt(req.body.quantity) || 1,
    });
    await user.save();
    var totalsum = user.cart.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    res.render('product', { product, totalsum, layout: 'layouts/main' });
  } catch (err) {
    res.status(500).send('error adding product to cart', err);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.userId,
      { $pull: { cart: { product: req.params.id } } }
    );
    const user = await User.findById(req.userId).populate('cart.product');
    var totalsum = user.cart.reduce((sum, item) => {
      return sum + (item.product.price * item.quantity);
    }, 0);
    res.render('cart', { products: user.cart, totalsum, layout: 'layouts/main' });
  } catch (err) {
    res.status(500).send('Error deleting product');
  }
};