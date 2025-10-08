const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register); // Only for initial setup/admin
router.post('/login', login);

module.exports = router;