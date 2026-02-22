const express = require('express');
const router = express.Router();
const { submitContactForm, getMessages } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

// Public route to submit contact form
router.post('/', submitContactForm);

// Admin route to get all messages
router.get('/', protect, admin, getMessages);

module.exports = router;
