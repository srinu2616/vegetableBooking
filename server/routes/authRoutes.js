const express = require('express');
const passport = require('passport');
const router = express.Router();
const { googleAuthCallback, refreshToken, getMe, registerUser, loginUser } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), googleAuthCallback);

// Other Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);

module.exports = router;
