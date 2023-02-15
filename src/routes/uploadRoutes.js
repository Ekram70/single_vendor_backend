const express = require("express");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../middlewares/verifyRoles");
const verifyJWT = require("../middlewares/verifyJWT");
const { upload } = require("../../config/cloudinaryMulterConfig");
const {
  uploadSingleImageToCloudinary,
} = require("../middlewares/uploadToCloudinary");

const router = express.Router();

router.route("/user").post(
  verifyJWT,
  verifyRoles([ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User]),
  upload.single("avatar"),
  uploadSingleImageToCloudinary("shoppers/user")
);

module.exports = router;
