const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`\nMongoDB Connected: ${conn.connection.host}\n`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Check doctors
const checkDoctors = async () => {
  try {
    await connectDB();

    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const Doctor = mongoose.model('Doctor', new mongoose.Schema({}, { strict: false }));

    // Check users collection for doctors
    const doctorUsers = await User.find({ role: 'doctor' });
    console.log(`Found ${doctorUsers.length} doctor(s) in users collection:\n`);
    
    doctorUsers.forEach((doc, index) => {
      console.log(`Doctor ${index + 1}:`);
      console.log(`  Name: ${doc.name}`);
      console.log(`  Email: ${doc.email}`);
      console.log(`  Phone: ${doc.phone || 'N/A'}`);
      console.log(`  Specialization: ${doc.specialization || 'MISSING ❌'}`);
      console.log(`  Qualification: ${doc.qualification || 'MISSING ❌'}`);
      console.log(`  Experience: ${doc.experience !== undefined ? doc.experience : 'MISSING ❌'}`);
      console.log(`  Consultation Fee: ${doc.consultationFee !== undefined ? '₹' + doc.consultationFee : 'MISSING ❌'}`);
      console.log(`  Available From: ${doc.availableFrom || 'MISSING ❌'}`);
      console.log(`  Available To: ${doc.availableTo || 'MISSING ❌'}`);
      console.log(`  Languages: ${doc.languages || 'MISSING ❌'}`);
      console.log(`  User ID: ${doc._id}`);
      console.log('');
    });

    // Check doctors collection
    const doctors = await Doctor.find({});
    console.log(`Found ${doctors.length} doctor(s) in doctors collection:\n`);
    
    doctors.forEach((doc, index) => {
      console.log(`Doctor ${index + 1}:`);
      console.log(`  Name: ${doc.name}`);
      console.log(`  Email: ${doc.email}`);
      console.log(`  Specialization: ${doc.specialization}`);
      console.log(`  Consultation Fee: ₹${doc.consultationFee}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

checkDoctors();
