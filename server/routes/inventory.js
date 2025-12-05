const express = require('express');
const {
  getInventory,
  updateInventory,
  getInventoryStats,
  initializeInventory
} = require('../controllers/inventory');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route - anyone can view inventory
router.get('/', getInventory);

// Get inventory statistics
router.get('/stats', getInventoryStats);

// Initialize inventory (Admin only)
router.post('/initialize', protect, authorize('admin'), initializeInventory);

// Update inventory (Inventory Manager & Admin)
router.put('/', protect, authorize('admin', 'inventoryManager'), updateInventory);

module.exports = router;
