const express = require('express');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Placeholder routes
router.get('/', protect, authorize('admin', 'staff'), (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Get all billing records',
  });
});

router.post('/', protect, authorize('admin', 'staff'), (req, res) => {
  res.status(201).json({
    success: true,
    message: 'Create billing record',
  });
});

module.exports = router;
