const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars (same pattern as seedAdmin.js)
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

const createStaffUser = async () => {
  try {
    const email = 'staff@chikitsamitra.com';

    // Check if staff user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log('❌ Staff user already exists!');
      console.log('Email:', existingUser.email);
      console.log('Role:', existingUser.role);
      process.exit(0);
    }

    // Create default staff user
    const staffUser = await User.create({
      name: 'Front Desk Staff',
      email,
      password: 'Mahesh',
      role: 'staff',
      phone: '+91 9876543210',
    });

    console.log('✅ Default staff user created successfully!');
    console.log('Email:', staffUser.email);
    console.log('Password: Mahesh');
    console.log('Role:', staffUser.role);
    console.log('\n🎉 Staff can now login via the Staff Login (Doctor/Admin/Staff) page.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating staff user:', error.message);
    process.exit(1);
  }
};

createStaffUser();
