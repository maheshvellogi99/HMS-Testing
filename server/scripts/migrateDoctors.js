const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

// Models
const User = require('../models/User');
const Doctor = require('../models/Doctor');

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};

// Migrate doctors from users to doctors collection
const migrateDoctors = async () => {
  try {
    await connectDB();

    // Find all users with role='doctor'
    const doctorUsers = await User.find({ role: 'doctor' });

    console.log(`\nFound ${doctorUsers.length} doctors in users collection`.yellow);

    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const doctorUser of doctorUsers) {
      try {
        // Check if doctor already exists in doctors collection
        const existingDoctor = await Doctor.findOne({ user: doctorUser._id });

        if (existingDoctor) {
          console.log(`⚠️  Doctor ${doctorUser.name} already migrated, skipping...`.yellow);
          skippedCount++;
          continue;
        }

        // Check if user has all required doctor fields
        if (!doctorUser.specialization || !doctorUser.consultationFee) {
          console.log(`⚠️  Doctor ${doctorUser.name} missing required fields, skipping...`.yellow);
          console.log(`   - Specialization: ${doctorUser.specialization || 'MISSING'}`);
          console.log(`   - Consultation Fee: ${doctorUser.consultationFee || 'MISSING'}`);
          skippedCount++;
          continue;
        }

        // Create doctor entry
        await Doctor.create({
          user: doctorUser._id,
          name: doctorUser.name,
          email: doctorUser.email,
          phone: doctorUser.phone || 'Not provided',
          specialization: doctorUser.specialization,
          qualification: doctorUser.qualification || 'MBBS',
          experience: doctorUser.experience || 0,
          consultationFee: doctorUser.consultationFee,
          availableFrom: doctorUser.availableFrom || '09:00',
          availableTo: doctorUser.availableTo || '17:00',
          languages: doctorUser.languages || 'English',
          active: doctorUser.active !== false,
        });

        console.log(`✅ Migrated: ${doctorUser.name}`.green);
        migratedCount++;
      } catch (error) {
        console.log(`❌ Error migrating ${doctorUser.name}: ${error.message}`.red);
        errorCount++;
      }
    }

    console.log(`\n${'='.repeat(50)}`);
    console.log(`Migration Summary:`.cyan.bold);
    console.log(`  ✅ Migrated: ${migratedCount}`.green);
    console.log(`  ⚠️  Skipped: ${skippedCount}`.yellow);
    console.log(`  ❌ Errors: ${errorCount}`.red);
    console.log(`${'='.repeat(50)}\n`);

    // Verify the migration
    const totalDoctors = await Doctor.countDocuments();
    console.log(`Total doctors in doctors collection: ${totalDoctors}`.cyan);

    process.exit(0);
  } catch (error) {
    console.error(`Migration failed: ${error.message}`.red);
    process.exit(1);
  }
};

// Run migration
console.log(`\n${'='.repeat(50)}`);
console.log(`Starting Doctor Migration...`.cyan.bold);
console.log(`${'='.repeat(50)}\n`);

migrateDoctors();
