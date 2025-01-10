const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

// Registration endpoint
router.post('/register', registerUser);

// Login endpoint
router.post('/login', loginUser);

module.exports = router;
