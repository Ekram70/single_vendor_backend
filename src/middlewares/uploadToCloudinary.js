const cloudinary = require("cloudinary").v2;
const sharp = require("sharp");
const bufferToStream = require("../lib/bufferToStream");
const renameFile = require("../lib/renameFile");

const uploadSingleImageToCloudinary = (dir) => {
  return async (req, res, next) => {
    if (!req.file) next();

    const { originalname, mimetype } = req.file;

    if (
      !(
        mimetype === "image/png" ||
        mimetype === "image/jpg" ||
        mimetype === "image/jpeg"
      )
    ) {
      return res.status(400).json({
        status: "fail",
        data: "'Only .png, .jpg and .jpeg format allowed!'",
      });
    }

    const fileName = renameFile(originalname);

    try {
      const data = await sharp(req.file.buffer)
        .webp({ quality: 100 })
        .toBuffer();

      const stream = cloudinary.uploader.upload_stream(
        { folder: dir, public_id: fileName },
        (error, result) => {
          if (error) {
            res.status(500).json({ status: "fail", data: error.message });
          }

          req.body.avatar = result.secure_url;
          next();
        }
      );

      bufferToStream(data).pipe(stream);
    } catch (error) {
      console.log(error);
      res.status(500).json({ status: "fail", data: error.message });
    }
  };
};

module.exports = {
  uploadSingleImageToCloudinary,
};
