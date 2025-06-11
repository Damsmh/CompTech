const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.locals.isAuthenticated = false;
    res.locals.userId = null;
    return res.redirect('/login');
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    res.locals.isAuthenticated = true;
    res.locals.userId = req.userId;
    next();
  } catch (err) {
    res.locals.isAuthenticated = false;
    res.locals.userId = null;
    res.redirect('/login');
  }
};

module.exports = authMiddleware;