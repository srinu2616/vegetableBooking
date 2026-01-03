const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function (passport) {
    const serverUrl = (process.env.SERVER_URL).replace(/\/$/, '');
    const callbackURL = `${serverUrl}/auth/google/callback`;
    console.log("Passport Callback URL Configuration:", callbackURL);

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: callbackURL,
        proxy: true // Trust proxy for Vercel
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    return done(null, user);
                } else {
                    // Check if user exists with same email (if they signed up differently, though we only use Google here for now)
                    user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        // Link Google ID to existing user
                        user.googleId = profile.id;
                        user.profilePic = profile.photos[0].value;
                        await user.save();
                        return done(null, user);
                    } else {
                        // Create new user
                        const newUser = {
                            googleId: profile.id,
                            name: profile.displayName,
                            email: profile.emails[0].value,
                            profilePic: profile.photos[0].value
                        };
                        user = await User.create(newUser);
                        return done(null, user);
                    }
                }
            } catch (err) {
                console.error(err);
                return done(err, null);
            }
        }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });
};
