const User = require('../models/User');

exports.profile = async (req, res) => {
  try {
    var user = await User.findById(req.userId);
    res.render('profile', { user: user, layout: 'layouts/main' });
  } catch (err) {
    res.status(404).render('profile', { error: 'User not found!' });
  }
};
