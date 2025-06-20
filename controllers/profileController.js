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
            return res.status(400).json({ success: false, error: 'Файл не загружен' });
        }
        const avatarPath = `/static/avatars/${req.file.filename}`;
        await User.findByIdAndUpdate(req.userId, { avatar: avatarPath });
        res.json({ success: true, avatar: avatarPath });
    } catch (err) {
        console.error('Ошибка загрузки аватара:', err);
        res.status(400).json({ success: false, error: err.message || 'Ошибка загрузки аватара' });
    }
};
