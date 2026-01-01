require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Check for specific admin email from .env
        const adminEmail = process.env.ADMIN_EMAIL; // Fallback for safety
        const admin = await User.findOne({ email: adminEmail });
        if (admin) {
            console.log('FOUND ADMIN:');
            console.log(`- Name: ${admin.name}`);
            console.log(`- Email: ${admin.email}`);
            console.log(`- Role: ${admin.role}`);
        } else {
            console.log(`User ${adminEmail} NOT FOUND as admin`);
        }

        // List all admins
        const allAdmins = await User.find({ role: 'admin' });
        console.log(`\nTotal Admins: ${allAdmins.length}`);
        allAdmins.forEach(u => console.log(`- ${u.email} (${u.name})`));

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkAdmin();
