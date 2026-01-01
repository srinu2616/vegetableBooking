require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const session = require('express-session');

// Initialize Express App
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));

// Passport Config
require('./config/passport')(passport);

// Routes
const authRoutes = require('./routes/authRoutes');
const vegetableRoutes = require('./routes/vegetableRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Middleware
app.use(helmet());
app.use(cors({
    origin: [process.env.CLIENT_URL || 'http://localhost:5179', 'http://localhost:5179', 'http://localhost:5173'],
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Prevent favicon 404
app.get('/favicon.ico', (req, res) => res.status(204));

// Routes
app.use('/auth', authRoutes);
app.use('/api/vegetables', vegetableRoutes);
app.use('/api/orders', orderRoutes);

// Serve static assets in production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('Vegetable Booking API is running...');
    });
}

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
