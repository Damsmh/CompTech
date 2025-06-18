const User = require('../models/User');

exports.profile = async (req, res) => {
  try {
    var user = await User.findById(req.userId);
    res.render('profile', { user: user, layout: 'layouts/main' });
  } catch (err) {
    res.status(404).render('profile', { error: 'User not found!' });
  }
};

exports.avatar = async (req, res) => {
  try {
      if (!req.file) {
          return res.status(400).json({ error: 'Файл не загружен' });
      }
      const avatarPath = `/public/avatars/${req.file.filename}`;
      var user = await User.findByIdAndUpdate(req.userId, { avatar: avatarPath });
      res.render('profile', { user: user, layout: 'layouts/main' });
  } catch (err) {
      res.status(400).json({ error: err.message });
  }
};
