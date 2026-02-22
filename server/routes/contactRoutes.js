const express = require('express');
const router = express.Router();
const { submitContactForm, getMessages, deleteMessage } = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth');

// Public route to submit contact form
router.post('/', submitContactForm);

// Admin route to get all messages
router.get('/', protect, admin, getMessages);

// Admin route to delete a message
router.delete('/:id', protect, admin, deleteMessage);

module.exports = router;
