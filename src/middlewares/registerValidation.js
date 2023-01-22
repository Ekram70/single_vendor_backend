const { body, header } = require('express-validator');

const validateRegister = [
    header('content-type')
        .exists()
        .withMessage('must provide content-type')
        .equals('application/json')
        .withMessage('invalid content-type'),
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
        .isLength({ min: 3 })
        .withMessage('name must be at least 3 characters long'),
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
        .isStrongPassword()
        .withMessage(
            'password must be 8 characters long and should contain one lowercase, one uppercase, one digits and one special characters'
        )
];

module.exports = { validateRegister };
