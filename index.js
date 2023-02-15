const express = require("express");
const compression = require("compression");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const fsPromises = require("fs").promises;
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

// compress all responses
app.use(compression());

// static folder
app.use(express.static("./uploads"));

// Connect to MongoDB
connectDB();

// testing
app.post("/", upload.single("picture"), async (req, res) => {
  try {
    await fsPromises.access("./uploads");
  } catch (error) {
    try {
      await fsPromises.mkdir("./uploads");
    } catch (err) {
      res.status(500).json({
        status: "fail",
        data: err,
      });
    }
  }

  const { buffer, originalname, mimetype } = req.file;
  const timestamp = Date.now();

  console.log(mimetype);

  if (
    !(
      mimetype === "image/png" ||
      mimetype === "image/jpg" ||
      mimetype === "image/jpeg"
    )
  ) {
    res.status(400).json({
      status: "fail",
      data: "'Only .png, .jpg and .jpeg format allowed!'",
    });
  }

  const name = originalname
    .substring(0, originalname.lastIndexOf("."))
    .toLowerCase()
    .split(" ")
    .join("-");

  const ref = `${name}-${timestamp}.webp`;

  try {
    await sharp(buffer).webp({ quality: 100 }).toFile(`./uploads/${ref}`);
  } catch (error) {
    res.status(500).json({
      status: "fail",
      data: error,
    });
  }

  const link = `${process.env.ORIGIN}/${ref}`;

  res.status(200).json({ status: "success", link });
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
