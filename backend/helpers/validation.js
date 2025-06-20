const { body } = require('express-validator');
const { HealthAuthorityConfig } = require('../models');
const { validationResult } = require('express-validator');

// Login validation
const validationLogin = [
  body('email').isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password cannot be empty'),
];

// Signup validation (missing and needed in UsersController)
const validationUser = [
  body('firstname').notEmpty().withMessage('First name is required'),
  body('lastname').notEmpty().withMessage('Last name is required'),
  body('email')
    .isEmail().withMessage('A valid email is required')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

module.exports = {
  validationLogin,
  validationUser, // ✅ Add this
};
