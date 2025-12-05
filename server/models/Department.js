const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a department name'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters'],
    },
    headOfDepartment: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Please add a head of department'],
    },
    contactNumber: {
      type: String,
      maxlength: [20, 'Phone number can not be longer than 20 characters'],
    },
    email: {
      type: String,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    location: {
      floor: String,
      wing: String,
      roomNumber: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    workingHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    averageWaitTime: {
      type: Number, // in minutes
      default: 30,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Reverse populate with virtuals
DepartmentSchema.virtual('doctors', {
  ref: 'User',
  localField: '_id',
  foreignField: 'department',
  justOne: false,
});

// Cascade delete doctors when a department is deleted
DepartmentSchema.pre('remove', async function (next) {
  await this.model('User').updateMany(
    { department: this._id },
    { $unset: { department: '' } }
  );
  next();
});

module.exports = mongoose.model('Department', DepartmentSchema);
