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

        // Determine destination URL
        // Primary domain: vegetableshub.me
        // Fallback: process.env.CLIENT_URL (usually Vercel)
        let clientUrl = process.env.CLIENT_URL;

        // If we want to be dynamic based on the request origin or session, we could logic it here.
        // For now, ensuring vegetableshub.me is prioritized if it's the intended domain.
        if (req.headers.referer && req.headers.referer.includes('vegetableshub.me')) {
            clientUrl = 'https://vegetableshub.me';
        }

        res.redirect(`${clientUrl}/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}`);
    } catch (error) {
        console.error(error);
        const clientUrl = process.env.CLIENT_URL || 'https://vegetableshub.me';
        res.redirect(`${clientUrl}/login?error=auth_failed`);
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
            // Extra check to ensure admin role for the configured admin email
            if (user.email === (process.env.ADMIN_EMAIL || '').trim() && user.role !== 'admin') {
                user.role = 'admin';
                await user.save();
            }

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
