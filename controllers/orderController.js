const Order = require('../models/Order');
const User = require('../models/User');

exports.getAllOrders = async (req, res) => {

    const user = await User.findById(req.userId);
    const orders = await Order.find({user: user._id}).populate('products.product');

    res.render('orders', { orders: orders, layout: 'layouts/main' });

};

exports.addOrder = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('cart.product');
        if (!user.cart.length) {
            return res.status(400).json({ success: false, error: 'Корзина пуста' });
        }

        let total = 0;
        const products = user.cart.map(item => {
            total += item.product.price * item.quantity;
            return {
                product: item.product._id,
                quantity: Number(item.quantity),
                price: Number(item.product.price)
            };
        });

        if (Number(user.balance) < Number(total)) {
            var totalsum = user.cart.reduce((sum, item) => {
                return sum + (item.product.price * item.quantity);
              }, 0);
            return res.render('cart', { products: user.cart, error: `Недостаточно средств на балансе`, totalsum, layout: 'layouts/main' });
        }

        for (const item of user.cart) {
            item.product.stock -= item.quantity;
            if (item.product.stock < 0) {
              var totalsum = user.cart.reduce((sum, item) => {
                  return sum + (item.product.price * item.quantity);
                }, 0);
              return res.render('cart', { products: user.cart, error: `Недостаточно товара ${item.product.name} на складе`, totalsum, layout: 'layouts/main' });
            }
            await item.product.save();
        }

        const order = new Order({
            user: req.userId,
            products,
            total
        });

        user.balance -= total;
        user.cart = [];
        await order.save();
        await user.save();

        res.redirect('/order');
    } catch (err) {
        var totalsum = user.cart.reduce((sum, item) => {
          return sum + (item.product.price * item.quantity);
        }, 0);
        return res.render('cart', { products: user.cart, error: `Ошибка при создании заказа`, totalsum, layout: 'layouts/main' });
    }
};