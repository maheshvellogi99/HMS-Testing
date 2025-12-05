const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: './.env' });

// Connect to database
mongoose.connect(process.env.MONGO_URI);

const createInventoryManager = async () => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'inmanager@gmail.com' });
    
    if (existingUser) {
      console.log('❌ Inventory Manager already exists!');
      console.log('Email:', existingUser.email);
      console.log('Role:', existingUser.role);
      process.exit(0);
    }

    // Create inventory manager
    const inventoryManager = await User.create({
      name: 'Inventory Manager',
      email: 'inmanager@gmail.com',
      password: 'Mahesh',
      role: 'inventoryManager',
      phoneNumber: '+91 1234567890'
    });

    console.log('✅ Inventory Manager created successfully!');
    console.log('Email:', inventoryManager.email);
    console.log('Password: Mahesh');
    console.log('Role:', inventoryManager.role);
    console.log('\n🎉 You can now login at: http://localhost:5173/inventory-login');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

createInventoryManager();
