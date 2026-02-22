const Contact = require('../models/Contact');

// @desc    Submit contact form
// @route   POST /api/contacts
// @access  Public
exports.submitContactForm = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Please fill all required fields' });
        }

        const contact = await Contact.create({
            name,
            email,
            subject,
            message
        });

        res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully!',
            data: contact
        });
    } catch (error) {
        console.error('Contact Form Submission Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error, please try again later.'
        });
    }
};

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Private/Admin
exports.getMessages = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });
    } catch (error) {
        console.error('Get Messages Error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
    // @desc    Delete a message
    // @route   DELETE /api/contacts/:id
    // @access  Private/Admin
    exports.deleteMessage = async (req, res) => {
        try {
            const message = await Contact.findById(req.params.id);

            if (!message) {
                return res.status(404).json({ message: 'Message not found' });
            }

            await Contact.findByIdAndDelete(req.params.id);

            res.status(200).json({
                success: true,
                message: 'Message removed'
            });
        } catch (error) {
            console.error('Delete Message Error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    };
