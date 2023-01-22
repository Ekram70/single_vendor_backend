const { body, header } = require('express-validator');

const validateLogin = [
    header('content-type')
        .exists()
        .withMessage('must provide content-type')
        .equals('application/json')
        .withMessage('invalid content-type'),
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
        .trim(),
    body('password')
        .exists()
        .withMessage('password is required')
        .bail()
        .isString()
        .withMessage('passsword must be a string')
        .bail()
        .notEmpty()
        .withMessage('password should not be empty')
];

module.exports = { validateLogin };
