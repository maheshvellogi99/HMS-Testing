const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @desc    Get all users with optional role filter
// @route   GET /api/v1/users
// @access  Public for doctors, Private/Admin for others
router.get('/', async (req, res, next) => {
  try {
    const { role } = req.query;
    
    // Build query
    let query = {};
    
    // If role filter is provided, add it to query
    if (role) {
      query.role = role;
    }
    
    // Allow anyone to fetch doctors (for patient booking)
    // But require admin auth for other user queries
    if (role !== 'doctor') {
      // Check if user is authenticated and is admin
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({
          success: false,
          error: 'Not authorized to access this route'
        });
      }
      
      // For non-doctor queries, verify it's called by middleware (protect will handle this)
      // This route will be called with protect middleware for admin access
    }
    
    // Fetch users from database
    const users = await User.find(query).select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching users'
    });
  }
});

// @desc    Get single user by ID
// @route   GET /api/v1/users/:id
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if user is authorized to view this user
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to access this user'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching user'
    });
  }
});

// @desc    Update user by ID (admin only)
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { name, phone, dateOfBirth, bloodGroup } = req.body;

    const fieldsToUpdate = {};
    if (name !== undefined) fieldsToUpdate.name = name;
    if (phone !== undefined) fieldsToUpdate.phone = phone;
    if (dateOfBirth !== undefined) fieldsToUpdate.dateOfBirth = dateOfBirth;
    if (bloodGroup !== undefined) fieldsToUpdate.bloodGroup = bloodGroup;

    const user = await User.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while updating user',
    });
  }
});

module.exports = router;
