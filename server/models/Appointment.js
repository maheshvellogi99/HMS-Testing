const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please add a patient'],
    },
    doctor: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please add a doctor'],
    },
    department: {
      type: mongoose.Schema.ObjectId,
      ref: 'Department',
    },
    date: {
      type: String,
      required: [true, 'Please add an appointment date'],
    },
    time: {
      type: String,
      required: [true, 'Please add appointment time'],
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    reason: {
      type: String,
      required: [true, 'Please add a reason for the appointment'],
    },
    notes: {
      type: String,
    },
    // Prescription fields
    prescription: {
      medicines: [{
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
        instructions: String
      }],
      diagnosis: String,
      prescribedAt: Date,
      prescribedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    },
    // Billing fields
    billing: {
      consultationFee: {
        type: Number,
        default: 0
      },
      isPaid: {
        type: Boolean,
        default: false
      },
      paidAmount: {
        type: Number,
        default: 0
      },
      paidAt: Date,
      paymentMethod: String
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    // Reminder tracking
    reminders: {
      dayBeforeSent: {
        type: Boolean,
        default: false
      },
      hourBeforeSent: {
        type: Boolean,
        default: false
      },
      dayBeforeSentAt: Date,
      hourBeforeSentAt: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Prevent double booking for doctors
AppointmentSchema.index(
  { doctor: 1, date: 1, time: 1 },
  { unique: true }
);

// Prevent double booking for patients
AppointmentSchema.index(
  { patient: 1, date: 1, time: 1 },
  { unique: true }
);

// Static method to get available time slots
AppointmentSchema.statics.getAvailableSlots = async function (doctorId, date) {
  const appointments = await this.find({
    doctor: doctorId,
    date: date,
    status: { $ne: 'cancelled' },
  });

  const bookedSlots = appointments.map((appt) => appt.time);

  return { bookedSlots };
};

module.exports = mongoose.model('Appointment', AppointmentSchema);
