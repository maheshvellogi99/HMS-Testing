const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema(
  {
    // Beds Management
    totalBeds: {
      type: Number,
      required: [true, 'Please add total beds count'],
      default: 100
    },
    occupiedBeds: {
      type: Number,
      required: [true, 'Please add occupied beds count'],
      default: 0,
      validate: {
        validator: function(v) {
          return v <= this.totalBeds;
        },
        message: 'Occupied beds cannot exceed total beds'
      }
    },
    availableBeds: {
      type: Number,
      default: function() {
        return this.totalBeds - this.occupiedBeds;
      }
    },

    // ICU Management
    totalICU: {
      type: Number,
      required: [true, 'Please add total ICU count'],
      default: 20
    },
    occupiedICU: {
      type: Number,
      required: [true, 'Please add occupied ICU count'],
      default: 0,
      validate: {
        validator: function(v) {
          return v <= this.totalICU;
        },
        message: 'Occupied ICU cannot exceed total ICU'
      }
    },
    availableICU: {
      type: Number,
      default: function() {
        return this.totalICU - this.occupiedICU;
      }
    },

    // Emergency Wards
    totalEmergencyWards: {
      type: Number,
      required: [true, 'Please add total emergency wards count'],
      default: 15
    },
    occupiedEmergencyWards: {
      type: Number,
      required: [true, 'Please add occupied emergency wards count'],
      default: 0,
      validate: {
        validator: function(v) {
          return v <= this.totalEmergencyWards;
        },
        message: 'Occupied emergency wards cannot exceed total'
      }
    },
    availableEmergencyWards: {
      type: Number,
      default: function() {
        return this.totalEmergencyWards - this.occupiedEmergencyWards;
      }
    },

    // Oxygen Cylinders
    totalOxygenCylinders: {
      type: Number,
      required: [true, 'Please add total oxygen cylinders count'],
      default: 50
    },
    inUseOxygenCylinders: {
      type: Number,
      required: [true, 'Please add oxygen cylinders in use'],
      default: 0,
      validate: {
        validator: function(v) {
          return v <= this.totalOxygenCylinders;
        },
        message: 'Oxygen cylinders in use cannot exceed total'
      }
    },
    availableOxygenCylinders: {
      type: Number,
      default: function() {
        return this.totalOxygenCylinders - this.inUseOxygenCylinders;
      }
    },

    // Metadata
    lastUpdatedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot be more than 500 characters']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Calculate availability before save
InventorySchema.pre('save', function(next) {
  this.availableBeds = this.totalBeds - this.occupiedBeds;
  this.availableICU = this.totalICU - this.occupiedICU;
  this.availableEmergencyWards = this.totalEmergencyWards - this.occupiedEmergencyWards;
  this.availableOxygenCylinders = this.totalOxygenCylinders - this.inUseOxygenCylinders;
  next();
});

// Virtual for bed occupancy percentage
InventorySchema.virtual('bedOccupancyPercentage').get(function() {
  return this.totalBeds > 0 ? ((this.occupiedBeds / this.totalBeds) * 100).toFixed(2) : 0;
});

// Virtual for ICU occupancy percentage
InventorySchema.virtual('icuOccupancyPercentage').get(function() {
  return this.totalICU > 0 ? ((this.occupiedICU / this.totalICU) * 100).toFixed(2) : 0;
});

// Virtual for Emergency Ward occupancy percentage
InventorySchema.virtual('emergencyWardOccupancyPercentage').get(function() {
  return this.totalEmergencyWards > 0 ? ((this.occupiedEmergencyWards / this.totalEmergencyWards) * 100).toFixed(2) : 0;
});

// Virtual for Oxygen Cylinder usage percentage
InventorySchema.virtual('oxygenCylinderUsagePercentage').get(function() {
  return this.totalOxygenCylinders > 0 ? ((this.inUseOxygenCylinders / this.totalOxygenCylinders) * 100).toFixed(2) : 0;
});

module.exports = mongoose.model('Inventory', InventorySchema);
