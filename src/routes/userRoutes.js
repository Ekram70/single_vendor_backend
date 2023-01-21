const express = require('express');

const router = express.Router();
const { handleRegistration, handleLogin } = require('../controllers/userController');
const validateRequest = require('../middlewares/validateRequest');
const validationRegister = require('../middlewares/validationRegister');
const validationLogin = require('../middlewares/validationLogin');

router.route('/register').post(validationRegister, validateRequest, handleRegistration);

router.route('/login').get(validationLogin, validateRequest, handleLogin);

module.exports = router;
