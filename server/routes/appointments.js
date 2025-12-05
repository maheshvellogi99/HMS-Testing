const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const { sendAppointmentConfirmation, sendPrescriptionAndReceipt } = require('../utils/emailService');

const router = express.Router();

// @desc    Get all appointments
// @route   GET /api/v1/appointments
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // Filter based on user role
    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }
    // Admin can see all appointments (no filter)

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email specialization consultationFee')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching appointments'
    });
  }
});

// @desc    Create new appointment
// @route   POST /api/v1/appointments
// @access  Private (Patient)
router.post('/', protect, async (req, res) => {
  try {
    const { doctorId, date, time, reason, patientName, patientEmail, patientDOB } = req.body;

    // Validate required fields
    if (!doctorId || !date || !time || !reason) {
      return res.status(400).json({
        success: false,
        error: 'Please provide doctor, date, time, and reason'
      });
    }

    // Get doctor details from Doctor collection
    const doctor = await Doctor.findOne({ user: doctorId, active: true });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found'
      });
    }

    const consultationFee = doctor.consultationFee || 0;

    // Default: online patient booking with 50% advance
    let billing = {
      consultationFee,
    };
    let patientId = req.user._id;

    if (req.user.role === 'staff') {
      // Staff booking on behalf of offline patient with full payment
      if (!patientName || !patientEmail) {
        return res.status(400).json({
          success: false,
          error: 'Please provide patient name and email for offline booking'
        });
      }

      // Find existing patient by email or create a new patient user
      let patientUser = await User.findOne({ email: patientEmail });

      if (!patientUser) {
        const generatedPassword = Math.random().toString(36).slice(2, 10) + 'A1!';

        patientUser = await User.create({
          name: patientName,
          email: patientEmail,
          password: generatedPassword,
          role: 'patient',
          dateOfBirth: patientDOB ? new Date(patientDOB) : undefined,
        });
      }

      patientId = patientUser._id;

      // Full consultation fee is collected at hospital for staff bookings
      const fee = consultationFee;
      billing = {
        consultationFee: fee,
        isPaid: true,
        paidAmount: fee,
        paidAt: new Date(),
        paymentMethod: 'cash',
      };
    } else {
      const advanceAmount = Math.round(consultationFee * 0.5);

      // Create appointment (includes 50% advance payment recorded as paidAmount)
      billing = {
        consultationFee,
        paidAmount: advanceAmount,
        paidAt: new Date(),
        paymentMethod: 'online'
      };
    }

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      date,
      time,
      reason,
      createdBy: req.user._id,
      billing,
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email specialization consultationFee');

    const fee = populatedAppointment.billing?.consultationFee || 0;
    const advancePaidAmount = populatedAppointment.billing?.paidAmount || 0;
    const remainingAmount = Math.max(fee - advancePaidAmount, 0);

    // Send appointment confirmation email, including payment details
    try {
      await sendAppointmentConfirmation({
        patientEmail: populatedAppointment.patient.email,
        patientName: populatedAppointment.patient.name,
        doctorName: populatedAppointment.doctor.name,
        date: populatedAppointment.date,
        time: populatedAppointment.time,
        reason: populatedAppointment.reason,
        status: populatedAppointment.status,
        consultationFee: fee,
        advancePaidAmount,
        remainingAmount,
      });
      console.log('✅ Appointment confirmation email sent to', populatedAppointment.patient.email);
    } catch (emailError) {
      console.error('⚠️ Failed to send confirmation email:', emailError.message);
      // Don't fail the appointment creation if email fails
    }

    res.status(201).json({
      success: true,
      data: populatedAppointment,
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    
    // Handle duplicate booking
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'This time slot is already booked. Please choose another time.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Server error while creating appointment'
    });
  }
});

// @desc    Get single appointment
// @route   GET /api/v1/appointments/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email specialization consultationFee')
      .populate('prescription.prescribedBy', 'name');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    // Check authorization
    if (
      req.user.role !== 'admin' &&
      appointment.patient._id.toString() !== req.user._id.toString() &&
      appointment.doctor._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this appointment'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching appointment'
    });
  }
});

// @desc    Update appointment (status, notes, prescription)
// @route   PUT /api/v1/appointments/:id
// @access  Private (Admin, Doctor, Patient)
router.put('/:id', protect, async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    // Check authorization
    if (
      req.user.role !== 'admin' &&
      appointment.doctor.toString() !== req.user._id.toString() &&
      appointment.patient.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this appointment'
      });
    }

    // Update allowed fields based on role
    const allowedUpdates = {};
    
    if (req.user.role === 'admin' || req.user.role === 'doctor') {
      if (req.body.status) allowedUpdates.status = req.body.status;
      if (req.body.notes) allowedUpdates.notes = req.body.notes;
    }

    if (req.user.role === 'patient') {
      if (req.body.status === 'cancelled') allowedUpdates.status = 'cancelled';
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      allowedUpdates,
      { new: true, runValidators: true }
    )
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email specialization consultationFee');

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating appointment'
    });
  }
});

// @desc    Add prescription to appointment
// @route   PUT /api/v1/appointments/:id/prescription
// @access  Private (Doctor only)
router.put('/:id/prescription', protect, authorize('doctor'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    // Verify doctor is assigned to this appointment
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to prescribe for this appointment'
      });
    }

    const { medicines, diagnosis } = req.body;

    appointment.prescription = {
      medicines: medicines || [],
      diagnosis: diagnosis || '',
      prescribedAt: new Date(),
      prescribedBy: req.user._id
    };

    // Mark as completed when prescription is added
    appointment.status = 'completed';

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email specialization consultationFee')
      .populate('prescription.prescribedBy', 'name');

    // If billing is fully paid, send prescription and receipt email
    if (updatedAppointment.billing && updatedAppointment.billing.isPaid) {
      try {
        await sendPrescriptionAndReceipt({
          patientEmail: updatedAppointment.patient.email,
          patientName: updatedAppointment.patient.name,
          doctorName: updatedAppointment.doctor.name,
          doctorEmail: updatedAppointment.doctor.email,
          date: updatedAppointment.date,
          time: updatedAppointment.time,
          diagnosis: updatedAppointment.prescription.diagnosis,
          medicines: updatedAppointment.prescription.medicines || [],
          consultationFee: updatedAppointment.billing.consultationFee,
          paymentMethod: updatedAppointment.billing.paymentMethod,
          paidAt: updatedAppointment.billing.paidAt || new Date(),
        });
        console.log('✅ Prescription and receipt email sent to', updatedAppointment.patient.email);
      } catch (emailError) {
        console.error('⚠️ Failed to send prescription email:', emailError.message);
        // Don't fail the prescription update if email fails
      }
    }

    res.status(200).json({
      success: true,
      data: updatedAppointment,
    });
  } catch (error) {
    console.error('Error adding prescription:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while adding prescription'
    });
  }
});

// @desc    Mark billing as paid
// @route   PUT /api/v1/appointments/:id/payment
// @access  Private (Patient, Admin)
router.put('/:id/payment', protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    // Check authorization
    if (
      req.user.role !== 'admin' &&
      appointment.patient.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update payment for this appointment'
      });
    }

    const fee = appointment.billing?.consultationFee || 0;

    appointment.billing.isPaid = true;
    appointment.billing.paidAmount = fee;
    appointment.billing.paidAt = new Date();
    appointment.billing.paymentMethod = req.body.paymentMethod || 'cash';

    await appointment.save();

    const updatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name email specialization consultationFee');

    // Send prescription and receipt email if prescription exists
    if (updatedAppointment.prescription && updatedAppointment.prescription.diagnosis) {
      try {
        await sendPrescriptionAndReceipt({
          patientEmail: updatedAppointment.patient.email,
          patientName: updatedAppointment.patient.name,
          doctorName: updatedAppointment.doctor.name,
          doctorEmail: updatedAppointment.doctor.email,
          date: updatedAppointment.date,
          time: updatedAppointment.time,
          diagnosis: updatedAppointment.prescription.diagnosis,
          medicines: updatedAppointment.prescription.medicines || [],
          consultationFee: updatedAppointment.billing.consultationFee,
          paymentMethod: updatedAppointment.billing.paymentMethod,
          paidAt: updatedAppointment.billing.paidAt,
        });
        console.log('✅ Prescription and receipt email sent to', updatedAppointment.patient.email);
      } catch (emailError) {
        console.error('⚠️ Failed to send prescription email:', emailError.message);
        // Don't fail the payment update if email fails
      }
    }

    res.status(200).json({
      success: true,
      data: updatedAppointment,
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating payment'
    });
  }
});

// @desc    Delete appointment
// @route   DELETE /api/v1/appointments/:id
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    await appointment.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting appointment'
    });
  }
});

module.exports = router;
