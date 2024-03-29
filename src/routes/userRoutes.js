const express = require("express");

const router = express.Router();
const verifyJWT = require("../middlewares/verifyJWT");
const {
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { validateUpdateUser } = require("../middlewares/userValidation");
const ROLES_LIST = require("../../config/roles_list");
const verifyRoles = require("../middlewares/verifyRoles");
const shouldFileUpload = require("../middlewares/shouldFileUpload");
const {
  uploadSingleImageToCloudinary,
} = require("../middlewares/uploadToCloudinary");

router
  .route("/")
  .get(
    verifyJWT,
    verifyRoles([ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User]),
    getUser
  )
  .patch(
    verifyJWT,
    verifyRoles([ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User]),
    shouldFileUpload("avatar"),
    uploadSingleImageToCloudinary("shoppers/user"),
    validateUpdateUser,
    updateUser
  )
  .delete(
    verifyJWT,
    verifyRoles([ROLES_LIST.Admin, ROLES_LIST.Editor, ROLES_LIST.User]),
    deleteUser
  );

router
  .route("/all")
  .get(
    verifyJWT,
    verifyRoles([ROLES_LIST.Admin, ROLES_LIST.Editor]),
    getAllUser
  );

module.exports = router;
