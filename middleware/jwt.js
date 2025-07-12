const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  if (!token) return res.redirect('/user/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   // console.log('token decoded..',decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    res.clearCookie('token');
    res.redirect('/user/login');
  }
};

const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).send('Access denied: Admins only');
  }
  next();
};

const generateToken = (user) => {
  return jwt.sign({user}, process.env.JWT_SECRET, { expiresIn: '1d' });
};

module.exports = { jwtAuthMiddleware, generateToken, adminOnly };
