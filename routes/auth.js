const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { validateRegister, validateLogin, handleValidationErrors } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// Public routes
router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);

// Protected routes
router.get('/profile', authenticateToken, getProfile);

module.exports = router; 