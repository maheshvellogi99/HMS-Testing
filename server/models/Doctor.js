const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
    },
    phone: {
      type: String,
      required: [true, 'Please add a phone number'],
    },
    specialization: {
      type: String,
      required: [true, 'Please add specialization'],
    },
    qualification: {
      type: String,
      required: [true, 'Please add qualification'],
    },
    experience: {
      type: Number,
      required: [true, 'Please add years of experience'],
    },
    consultationFee: {
      type: Number,
      required: [true, 'Please add consultation fee'],
      min: [0, 'Consultation fee cannot be negative'],
    },
    availableFrom: {
      type: String,
      required: [true, 'Please add available from time'],
    },
    availableTo: {
      type: String,
      required: [true, 'Please add available to time'],
    },
    languages: {
      type: String,
      default: 'English',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    totalAppointments: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create index for efficient querying
DoctorSchema.index({ specialization: 1 });
DoctorSchema.index({ rating: -1 });
DoctorSchema.index({ consultationFee: 1 });

// Virtual for appointments
DoctorSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: 'user',
  foreignField: 'doctor',
  justOne: false,
});

module.exports = mongoose.model('Doctor', DoctorSchema);
