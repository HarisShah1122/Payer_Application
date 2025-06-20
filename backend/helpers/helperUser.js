const { body } = require("express-validator");

const helperUser = [
  body("firstname")
    .notEmpty()
    .withMessage("First name is required")
    .trim(),
  body("lastname")
    .notEmpty()
    .withMessage("Last name is required")
    .trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

module.exports = helperUser;