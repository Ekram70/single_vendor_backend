const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { logAccessToFile, logToConsole } = require('./middlewares/logger');
const errorHandler = require('./middlewares/ErrorHandler');
const corsOptions = require('./config/corsOptions');

const app = express();
const PORT = process.env.PORT || 3500;
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

app.listen(PORT, () => console.log(`Server is listening at port ${PORT}`));
