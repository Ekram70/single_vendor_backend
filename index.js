const express = require("express");
const cloudinary = require("cloudinary").v2;
const compression = require("compression");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const { Readable } = require("stream");
const sharp = require("sharp");
require("dotenv").config();

const { logAccessToFile, logToConsole } = require("./src/middlewares/logger");
const errorHandler = require("./src/middlewares/errorHandler");
const credentials = require("./src/middlewares/credentials");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConnect");
const limiter = require("./config/rateLimit");
const authRouter = require("./src/routes/authRoutes");
const registerRouter = require("./src/routes/registerRoutes");
const userRouter = require("./src/routes/userRoutes");
const refreshRouter = require("./src/routes/refreshRoutes");
const logoutRouter = require("./src/routes/logoutRoutes");

const app = express();
const PORT = process.env.PORT || 3500;

const storage = multer.memoryStorage();
const upload = multer({ storage });

// parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// security middleware
app.use(limiter);
app.use(helmet());
app.use(credentials);
app.use(cors(corsOptions));
app.disable("x-powered-by");
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// logger
app.use(logAccessToFile);
app.use(logToConsole);

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// compress all responses
app.use(compression());

// static folder
app.use(express.static("./uploads"));

// Connect to MongoDB
connectDB();

// buffer to stream
const bufferToStream = (buffer) => {
  const readable = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readable;
};

// testing
app.post("/", upload.single("picture"), async (req, res) => {
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

  const name = originalname
    .substring(0, originalname.lastIndexOf("."))
    .toLowerCase()
    .split(" ")
    .join("-");

  const timestamp = Date.now();

  const ref = `${name}-${timestamp}`;

  const data = await sharp(req.file.buffer).webp({ quality: 100 }).toBuffer();

  const stream = cloudinary.uploader.upload_stream(
    { folder: "uploads", public_id: ref },
    (error, result) => {
      if (error) return console.error(error);
      return res.json({ URL: result.secure_url });
    }
  );

  bufferToStream(data).pipe(stream);
});

// routing
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/register", registerRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/refresh", refreshRouter);
app.use("/api/v1/logout", logoutRouter);

// invalid routes handler
app.all("*", (_, res) => {
  res.status(404).json({ message: "Not a valid endpoint" });
});

// error handling middleware
app.use(errorHandler);

// start application
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));
});
