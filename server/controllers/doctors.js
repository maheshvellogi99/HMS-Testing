const Doctor = require('../models/Doctor');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all doctors
// @route   GET /api/v1/doctors
// @access  Public
exports.getDoctors = asyncHandler(async (req, res, next) => {
  const doctors = await Doctor.find({ active: true }).populate('user', 'role active');

  res.status(200).json({
    success: true,
    count: doctors.length,
    data: doctors,
  });
});

// @desc    Get single doctor
// @route   GET /api/v1/doctors/:id
// @access  Public
exports.getDoctor = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id).populate('user', 'role active');

  if (!doctor) {
    return next(new ErrorResponse(`Doctor not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: doctor,
  });
});

// @desc    Get doctor by user ID
// @route   GET /api/v1/doctors/user/:userId
// @access  Public
exports.getDoctorByUserId = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findOne({ user: req.params.userId }).populate('user', 'role active');

  if (!doctor) {
    return next(new ErrorResponse(`Doctor not found with user id of ${req.params.userId}`, 404));
  }

  res.status(200).json({
    success: true,
    data: doctor,
  });
});

// @desc    Update doctor
// @route   PUT /api/v1/doctors/:id
// @access  Private (Admin or Doctor themselves)
exports.updateDoctor = asyncHandler(async (req, res, next) => {
  let doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    return next(new ErrorResponse(`Doctor not found with id of ${req.params.id}`, 404));
  }

  // Make sure user is doctor owner or admin
  if (doctor.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User not authorized to update this doctor`, 401));
  }

  // Fields that can be updated
  const allowedUpdates = [
    'specialization',
    'qualification',
    'experience',
    'consultationFee',
    'availableFrom',
    'availableTo',
    'languages',
    'phone',
  ];

  const updates = {};
  Object.keys(req.body).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  doctor = await Doctor.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: doctor,
  });
});

// @desc    Delete doctor
// @route   DELETE /api/v1/doctors/:id
// @access  Private (Admin only)
exports.deleteDoctor = asyncHandler(async (req, res, next) => {
  const doctor = await Doctor.findById(req.params.id);

  if (!doctor) {
    return next(new ErrorResponse(`Doctor not found with id of ${req.params.id}`, 404));
  }

  // Soft delete - set active to false
  doctor.active = false;
  await doctor.save();

  // Also deactivate user account
  await User.findByIdAndUpdate(doctor.user, { active: false });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc    Search doctors by specialization
// @route   GET /api/v1/doctors/search/:specialization
// @access  Public
exports.searchDoctors = asyncHandler(async (req, res, next) => {
  const doctors = await Doctor.find({
    specialization: { $regex: req.params.specialization, $options: 'i' },
    active: true,
  }).populate('user', 'role active');

  res.status(200).json({
    success: true,
    count: doctors.length,
    data: doctors,
  });
});
