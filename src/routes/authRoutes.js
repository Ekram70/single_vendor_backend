const express = require('express');

const router = express.Router();
const { handleRegistration, handleLogin } = require('../controllers/authController');
const validateRequest = require('../middlewares/validateRequest');
const { validateRegister, validateLogin } = require('../middlewares/authValidation');

router.route('/register').post(validateRegister, validateRequest, handleRegistration);

router.route('/login').get(validateLogin, validateRequest, handleLogin);

module.exports = router;
