const mongoose = require('mongoose');

const connectDB = async () => {
    mongoose.set('strictQuery', false);
    try {
        await mongoose.connect(process.env.DB_URI);
    } catch (error) {
        console.log(error);
    }
};

module.exports = connectDB;
