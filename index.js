const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
require('dotenv').config();

const { logAccessToFile, logToConsole } = require('./src/middlewares/logger');
const errorHandler = require('./src/middlewares/ErrorHandler');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConnect');
const limiter = require('./config/rateLimit');
const userRouter = require('./src/routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3500;

// parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// security middleware
app.use(limiter);
app.use(helmet());
app.use(cors(corsOptions));
app.disable('x-powered-by');
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
// logger
app.use(logAccessToFile);
app.use(logToConsole);

// Connect to MongoDB
connectDB();

// routing
app.use('/api/v1/user', userRouter);

// invalid routes handler
app.all('*', (_, res) => {
    res.status(404).json({ message: 'Not a valid endpoint' });
});

// error handling middleware
app.use(errorHandler);

// start application
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));
});
