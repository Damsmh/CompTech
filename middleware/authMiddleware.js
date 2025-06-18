const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.userId = null;
    res.locals.isAuthenticated = false;
    return res.redirect('/login');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    res.locals.isAuthenticated = true;
    next();
  } catch (err) {
    req.userId = null;
    res.locals.isAuthenticated = false;
    res.redirect('/login');
  }
};

module.exports = authMiddleware;