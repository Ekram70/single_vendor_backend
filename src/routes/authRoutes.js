const express = require('express');

const router = express.Router();
const { login } = require('../controllers/authController');
const validateRequest = require('../middlewares/validateRequest');
const { validateLogin } = require('../middlewares/authValidation');

router.route('/').get(validateLogin, validateRequest, login);

module.exports = router;
