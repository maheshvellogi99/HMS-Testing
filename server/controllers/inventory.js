const Inventory = require('../models/Inventory');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get current inventory
// @route   GET /api/v1/inventory
// @access  Public (can be viewed by anyone)
exports.getInventory = async (req, res, next) => {
  try {
    let inventory = await Inventory.findOne().populate('lastUpdatedBy', 'name email');
    
    // If no inventory exists, create default one
    if (!inventory) {
      inventory = await Inventory.create({
        totalBeds: 100,
        occupiedBeds: 45,
        totalICU: 20,
        occupiedICU: 12,
        totalEmergencyWards: 15,
        occupiedEmergencyWards: 8,
        totalOxygenCylinders: 50,
        inUseOxygenCylinders: 25
      });
    }

    res.status(200).json({
      success: true,
      data: inventory
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inventory
// @route   PUT /api/v1/inventory
// @access  Private (Inventory Manager & Admin)
exports.updateInventory = async (req, res, next) => {
  try {
    let inventory = await Inventory.findOne();

    // If no inventory exists, create one
    if (!inventory) {
      inventory = new Inventory({
        ...req.body,
        lastUpdatedBy: req.user.id,
      });
    } else {
      // Update existing inventory using document save so validators & pre-save hooks run correctly
      Object.assign(inventory, req.body, {
        lastUpdatedBy: req.user.id,
      });
    }

    await inventory.save();
    await inventory.populate('lastUpdatedBy', 'name email');

    res.status(200).json({
      success: true,
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get inventory statistics
// @route   GET /api/v1/inventory/stats
// @access  Public
exports.getInventoryStats = async (req, res, next) => {
  try {
    const inventory = await Inventory.findOne();

    if (!inventory) {
      return next(new ErrorResponse('Inventory not found', 404));
    }

    const stats = {
      beds: {
        total: inventory.totalBeds,
        occupied: inventory.occupiedBeds,
        available: inventory.availableBeds,
        occupancyPercentage: inventory.bedOccupancyPercentage
      },
      icu: {
        total: inventory.totalICU,
        occupied: inventory.occupiedICU,
        available: inventory.availableICU,
        occupancyPercentage: inventory.icuOccupancyPercentage
      },
      emergencyWards: {
        total: inventory.totalEmergencyWards,
        occupied: inventory.occupiedEmergencyWards,
        available: inventory.availableEmergencyWards,
        occupancyPercentage: inventory.emergencyWardOccupancyPercentage
      },
      oxygenCylinders: {
        total: inventory.totalOxygenCylinders,
        inUse: inventory.inUseOxygenCylinders,
        available: inventory.availableOxygenCylinders,
        usagePercentage: inventory.oxygenCylinderUsagePercentage
      }
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Initialize inventory with default data
// @route   POST /api/v1/inventory/initialize
// @access  Private (Admin only)
exports.initializeInventory = async (req, res, next) => {
  try {
    // Check if inventory already exists
    let inventory = await Inventory.findOne();
    
    if (inventory) {
      return next(new ErrorResponse('Inventory already initialized', 400));
    }

    // Create default inventory
    inventory = await Inventory.create({
      totalBeds: 100,
      occupiedBeds: 45,
      totalICU: 20,
      occupiedICU: 12,
      totalEmergencyWards: 15,
      occupiedEmergencyWards: 8,
      totalOxygenCylinders: 50,
      inUseOxygenCylinders: 25,
      lastUpdatedBy: req.user.id,
      notes: 'Initial inventory setup'
    });

    res.status(201).json({
      success: true,
      data: inventory
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
