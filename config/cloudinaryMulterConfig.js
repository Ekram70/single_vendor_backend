const multer = require("multer");

// multer storage setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = {
  upload,
};
