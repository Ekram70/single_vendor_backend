const express = require('express');

const router = express.Router();
const { registration } = require('../controllers/UserController');
const validateRequest = require('../middlewares/validateRequest');
const validationRegister = require('../middlewares/validationRegister');

router.route('/register').post(validationRegister, validateRequest, registration);

module.exports = router;
