const express = require('express');
const {
  getDoctors,
  getDoctor,
  getDoctorByUserId,
  updateDoctor,
  deleteDoctor,
  searchDoctors,
} = require('../controllers/doctors');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getDoctors);
router.get('/search/:specialization', searchDoctors);
router.get('/:id', getDoctor);
router.get('/user/:userId', getDoctorByUserId);

// Protected routes
router.put('/:id', protect, authorize('doctor', 'admin'), updateDoctor);
router.delete('/:id', protect, authorize('admin'), deleteDoctor);

module.exports = router;
