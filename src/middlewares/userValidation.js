const { body, header } = require("express-validator");

const validateUpdateUser = [
  header("content-type").exists().withMessage("must provide content-type"),
  body("avatar")
    .optional()
    .isString()
    .withMessage("avatar must be string")
    .bail()
    .notEmpty()
    .withMessage("avatar should not be empty")
    .bail()
    .trim(),
  body("name")
    .optional()
    .isString()
    .withMessage("name must be a string")
    .bail()
    .notEmpty()
    .withMessage("name should not be empty")
    .bail()
    .trim()
    .isLength({ min: 8, max: 24 })
    .withMessage("name must be between 8 to 24 characters"),
  body("email")
    .optional()
    .isString()
    .withMessage("email must be a string")
    .bail()
    .notEmpty()
    .withMessage("email should not be empty")
    .bail()
    .trim()
    .isEmail()
    .withMessage("email should be a valid email")
    .normalizeEmail(),
  body("phone")
    .optional()
    .isString()
    .withMessage("phone must be string")
    .bail()
    .notEmpty()
    .withMessage("phone should not be empty")
    .trim(),
  body("address")
    .optional()
    .isString()
    .withMessage("address must be string")
    .bail()
    .notEmpty()
    .withMessage("address should not be empty")
    .trim(),
  body("gender")
    .optional()
    .isString()
    .withMessage("gender must be string")
    .bail()
    .notEmpty()
    .withMessage("gender should not be empty")
    .trim()
    .equals("male" || "female")
    .withMessage("Gender is either male or female"),
  body("password")
    .optional()
    .isString()
    .withMessage("passsword must be a string")
    .bail()
    .notEmpty()
    .withMessage("password should not be empty")
    .bail()
    .isLength({ min: 8, max: 24 })
    .withMessage("passowrd must be between 8 to 24 characters")
    .bail()
    .isStrongPassword()
    .withMessage(
      "password should contain one lowercase, one uppercase, one digits and one special characters"
    ),
];

module.exports = { validateUpdateUser };
