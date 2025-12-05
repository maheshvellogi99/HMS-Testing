const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    },
    height: {
      type: Number, // in cm
    },
    weight: {
      type: Number, // in kg
    },
    allergies: [
      {
        name: String,
        severity: {
          type: String,
          enum: ['mild', 'moderate', 'severe'],
        },
        notes: String,
      },
    ],
    medicalHistory: [
      {
        condition: String,
        diagnosisDate: Date,
        status: {
          type: String,
          enum: ['active', 'inactive', 'resolved'],
          default: 'active',
        },
        notes: String,
      },
    ],
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        startDate: Date,
        endDate: Date,
        prescribedBy: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        },
      },
    ],
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
      email: String,
      address: String,
    },
    insurance: {
      provider: String,
      policyNumber: String,
      groupNumber: String,
      validUntil: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Reverse populate with virtuals
PatientSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'patient',
  justOne: false,
});

// Cascade delete appointments when a patient is deleted
PatientSchema.pre('remove', async function (next) {
  await this.model('Appointment').deleteMany({ patient: this._id });
  next();
});

module.exports = mongoose.model('Patient', PatientSchema);
