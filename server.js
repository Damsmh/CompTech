const express = require('express');
const hbs = require('hbs');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const profileRoutes = require('./routes/profileRoutes');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();
const app = express();

connectDB();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));
hbs.registerHelper('multiply', function(a, b) { return Number(a) * Number(b); });
hbs.registerHelper('plus', function(a, b) { return Number(a) = Number(a) + Number(b); });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public/static', express.static(path.join(__dirname, 'public/static')));
app.use('/public', express.static(path.join(__dirname, 'public/static')));

app.get('/', authMiddleware, (req, res) => {
  res.render('home', { layout: 'layouts/main' });
});
app.use('/products', productRoutes);
app.use('/', authRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/profile', profileRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});