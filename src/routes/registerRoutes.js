const express = require("express");

const router = express.Router();
const { registration } = require("../controllers/registerController");
const validateRequest = require("../middlewares/validateRequest");
const { validateRegister } = require("../middlewares/registerValidation");

router.route("/").post(validateRegister, validateRequest, registration);

module.exports = router;
