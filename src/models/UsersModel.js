const mongoose = require('mongoose');

const DataSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'name is required'],
            trim: true,
            minLength: [3, 'name must be at least 5 characters'],
            match: [/^[a-zA-Z\s]*$/g, 'only letters and spacess allowed']
        },
        email: {
            type: String,
            required: [true, 'email is required'],
            unique: [true, 'this email is already assossiated with another account'],
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'not a valid email address']
        },
        password: {
            type: String,
            required: [true, 'password is required'],
            minLength: [8, 'password should be at least 8 characters'],
            match: [
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$/,
                'not a valid password'
            ]
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const UsersModel = mongoose.model('users', DataSchema);

module.exports = UsersModel;
