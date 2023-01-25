const { body, header } = require('express-validator');

const validateRegister = [
    header('Content-Type')
        .exists()
        .withMessage('must provide Content-Type')
        .equals('application/json')
        .withMessage('invalid Content-Type'),
    body('name')
        .exists()
        .withMessage('name is required')
        .bail()
        .isString()
        .withMessage('name must be a string')
        .bail()
        .notEmpty()
        .withMessage('name should not be empty')
        .bail()
        .trim()
        .isLength({ min: 8, max: 24 })
        .withMessage('name must be between 8 to 24 characters'),
    body('email')
        .exists()
        .withMessage('email is required')
        .bail()
        .isString()
        .withMessage('email must be a string')
        .bail()
        .notEmpty()
        .withMessage('email should not be empty')
        .bail()
        .trim()
        .isEmail()
        .withMessage('email should be a valid email')
        .normalizeEmail(),
    body('password')
        .exists()
        .withMessage('password is required')
        .bail()
        .isString()
        .withMessage('passsword must be a string')
        .bail()
        .notEmpty()
        .withMessage('password should not be empty')
        .bail()
        .isLength({ min: 8, max: 24 })
        .withMessage('passowrd must be between 8 to 24 characters')
        .bail()
        .isStrongPassword()
        .withMessage(
            'password should contain one lowercase, one uppercase, one digits and one special characters'
        )
];

module.exports = { validateRegister };
