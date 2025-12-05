const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const User = require('./models/User');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'chikitsamitra@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!'.yellow);
      console.log(`Email: ${existingAdmin.email}`.cyan);
      console.log(`Role: ${existingAdmin.role}`.cyan);
      process.exit(0);
    }

    // Create default admin user
    const admin = await User.create({
      name: 'Chikitsamitra Admin',
      email: 'chikitsamitra@gmail.com',
      password: 'Mahesh',
      phone: '9999999999',
      role: 'admin'
    });

    console.log('✅ Default admin user created successfully!'.green.bold);
    console.log('');
    console.log('Admin Credentials:'.cyan.bold);
    console.log(`Email: ${admin.email}`.cyan);
    console.log(`Password: Mahesh`.cyan);
    console.log(`Role: ${admin.role}`.cyan);
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password in production!'.yellow.bold);
    
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};

seedAdmin();
