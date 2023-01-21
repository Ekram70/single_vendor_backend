const express = require('express');

const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const { handleGetAllUser } = require('../controllers/userController');

router.route('/all').get(verifyJWT, handleGetAllUser);

module.exports = router;
