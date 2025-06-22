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

exports.email = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, error: 'Email не указан' });
        }
        const updatedUser = await User.findByIdAndUpdate(req.userId, { email }, { new: true });
        updatedUser.save();
        res.json({ success: true, email: updatedUser.email });
    } catch (err) {
        console.error('Ошибка обновления email:', err);
        res.status(400).json({ success: false, error: err.message || 'Ошибка обновления email' });
    }
};
