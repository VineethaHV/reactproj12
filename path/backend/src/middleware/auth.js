const jwt = require('jsonwebtoken');
const pool = require('../db');

exports.protect = async (req, res, next) => {
  let token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRes = await pool.query('SELECT id, username, role, name FROM users WHERE id=$1', [decoded.id]);
    if (!userRes.rows.length) return res.status(401).json({ message: 'User not found' });
    req.user = userRes.rows[0];
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'User role not authorized' });
  }
  next();
};