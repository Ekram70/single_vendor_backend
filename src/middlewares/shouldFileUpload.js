const { upload } = require("../../config/cloudinaryMulterConfig");

const shouldFileUpload = (field) => {
  return (req, res, next) => {
    if (typeof req.body.avatatar === "string") {
      next();
    } else {
      return upload.single(field);
    }
  };
};

module.exports = shouldFileUpload;
