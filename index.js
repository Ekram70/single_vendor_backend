const express = require("express");
const compression = require("compression");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary").v2;

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
const uploadRouter = require("./src/routes/uploadRoutes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3500;

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

// Connect to MongoDB
connectDB();

// routing
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/register", registerRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/refresh", refreshRouter);
app.use("/api/v1/logout", logoutRouter);
app.use("/api/v1/upload", uploadRouter);

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
