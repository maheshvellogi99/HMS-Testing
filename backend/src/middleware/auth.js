const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('./async');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } 
  // Set token from cookie
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from the token
    req.user = await User.findById(decoded.id).select('-password');
    
    // Update last login time
    if (req.user) {
      await req.user.updateLastLogin();
    }
    
    next();
  } catch (err) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
};

// Check if user is the owner of the resource or an admin
exports.checkOwnership = (model) => {
  return async (req, res, next) => {
    // Get the resource
    const resource = await model.findById(req.params.id);

    // Check if resource exists
    if (!resource) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is resource owner or admin
    if (
      resource.user.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this resource`,
          401
        )
      );
    }

    next();
  };
};

// Check if user is the owner of the resource or has a specific role
exports.checkOwnershipOrRole = (model, ...roles) => {
  return async (req, res, next) => {
    // Get the resource
    const resource = await model.findById(req.params.id);

    // Check if resource exists
    if (!resource) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is resource owner or has the required role
    if (
      resource.user.toString() !== req.user.id &&
      !roles.includes(req.user.role)
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to access this resource`,
          401
        )
      );
    }

    next();
  };
};

// Check if user is the owner of the resource or has a specific relationship
// For example, a doctor can access their own patients' records
exports.checkRelationship = (model, relationshipField) => {
  return async (req, res, next) => {
    // Get the resource
    const resource = await model.findById(req.params.id);

    // Check if resource exists
    if (!resource) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      );
    }

    // Check if the user is the owner of the resource
    if (resource.user.toString() === req.user.id) {
      return next();
    }

    // Check if the user has the required relationship
    if (
      relationshipField &&
      resource[relationshipField] &&
      resource[relationshipField].toString() === req.user.id
    ) {
      return next();
    }

    // If user is an admin, allow access
    if (req.user.role === 'admin') {
      return next();
    }

    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access this resource`,
        401
      )
    );
  };
};