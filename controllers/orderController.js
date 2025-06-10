const Order = require('../models/Order');
const User = require('../models/User');

exports.getAllOrders = async (req, res) => {

    const user = await User.findById(req.userId);
    const orders = await Order.find({user: user._id}).populate('products.product');

    res.render('orders', { orders: orders, layout: 'layouts/main' });

};

exports.addOrder = async (req, res) => {
    const user = await User.findById(req.userId).populate('cart.product');
    if (!user.cart.length) {
      return res.status(400).send('Cart is empty');
    }
    let total = 0;
    const products = user.cart.map(item => {
      total += item.product.price * item.quantity;
      return { product: item.product, quantity: Number(item.quantity), price: Number(item.product.price) };
    });
    const order = new Order({
      user: req.userId,
      products,
      total,
    });
    await order.save();
    user.cart = []; 
    await user.save();
    res.redirect('/order');
};
