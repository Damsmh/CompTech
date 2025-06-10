const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    res.status(400).render('register', { error: 'Username already exists or invalid data' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).render('login', { error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/products');
  } catch (err) {
    res.status(500).render('login', { error: 'Server error' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
};