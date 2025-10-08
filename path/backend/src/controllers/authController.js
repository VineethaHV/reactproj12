const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { username, password, role, name } = req.body;
    if (!username || !password || !name) {
      return res.status(400).json({ message: 'All fields required' });
    }
    const user = await User.create({ username, password, role, name });
    res.status(201).json({ message: 'User registered', user: { id: user._id, username: user.username, role: user.role, name: user.name } });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role, name: user.name }
    });
  } catch (err) {
    next(err);
  }
};