const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Placeholder routes
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get all departments',
  });
});

router.post('/', protect, authorize('admin'), (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Create department',
  });
});

module.exports = router;
