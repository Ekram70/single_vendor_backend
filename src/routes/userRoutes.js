const express = require('express');

const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const { getAllUser, getUser, updateUser, deleteUser } = require('../controllers/userController');
const { validateUpdateUser } = require('../middlewares/userValidation');

router
    .route('/')
    .get(verifyJWT, getUser)
    .patch(verifyJWT, validateUpdateUser, updateUser)
    .delete(verifyJWT, deleteUser);

router.route('/all').get(verifyJWT, getAllUser);

module.exports = router;
