const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Placeholder routes
router.get('/', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get all prescriptions',
  });
});

router.post('/', protect, authorize('doctor'), (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Create prescription',
  });
});

module.exports = router;
