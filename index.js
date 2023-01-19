const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const { logAccessToFile, logToConsole } = require('./src/middlewares/logger');
const errorHandler = require('./src/middlewares/ErrorHandler');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConnect');

const app = express();
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

app.use(logAccessToFile);
app.use(logToConsole);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (_, res) => {
    res.send('Hi');
});

// invalid routes handler
app.all('*', (_, res) => {
    res.status(404).json({ message: 'Not a valid endpoint' });
});

// error handling middleware
app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));
});
