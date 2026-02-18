const User = require('../models/User');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

// @desc    Auth with Google
// @route   GET /auth/google
// @access  Public
const googleAuth = (req, res) => {
    // Handled by passport
};

// @desc    Google auth callback
// @route   GET /auth/google/callback
// @access  Public
const googleAuthCallback = async (req, res) => {
    try {
        const user = req.user;
        const accessToken = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token to database
        user.refreshToken = refreshToken;
        await user.save();

        // Redirect to client with tokens (in production, use secure cookies or other method)
        // For simplicity in development, passing tokens in URL - CHANGE THIS FOR PRODUCTION
        res.redirect(`${process.env.CLIENT_URL}/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    } catch (error) {
        console.error(error);
        res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
    }
};

// @desc    Refresh Token
// @route   POST /auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token found' });
    }

    try {
        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        const accessToken = generateToken(user._id);
        res.json({ accessToken });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid refresh token' });
    }
};

// @desc    Register user
// @route   POST /auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: (email === process.env.ADMIN_EMAIL) ? 'admin' : 'user'
        });

        if (user) {
            const accessToken = generateToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            user.refreshToken = refreshToken;
            await user.save();

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                role: user.role,
                token: accessToken,
                refreshToken
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            const accessToken = generateToken(user._id);
            const refreshToken = generateRefreshToken(user._id);

            user.refreshToken = refreshToken;
            await user.save();

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profilePic: user.profilePic,
                role: user.role,
                token: accessToken,
                refreshToken
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user
// @route   GET /auth/me
// @access  Private
const getMe = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json(user);
};

module.exports = {
    googleAuth,
    googleAuthCallback,
    refreshToken,
    getMe,
    registerUser,
    loginUser
};
