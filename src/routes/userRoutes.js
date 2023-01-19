const express = require('express');

const router = express.Router();
const { registration } = require('../controllers/UserController');

router.route('/register').post(registration);

module.exports = router;
