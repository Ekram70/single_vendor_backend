const mongoose = require('mongoose');

const DataSchema = mongoose.Schema(
    {
        fullname: {
            type: String,
            required: [true, 'full name is required'],
            trim: true,
            minLength: [5, 'full name must be at least 5 characters'],
            match: [/^[a-zA-Z\s]*$/g, 'only letters and spacess allowed']
        },
        email: {
            type: String,
            required: [true, 'email is required'],
            unique: [true, 'this email is already assossiated with another account'],
            trim: true,
            match: [
                /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                'not a valid email address'
            ]
        },
        password: {
            type: String,
            required: [true, 'password is required'],
            maxLength: [16, 'password can have maximum 16 characters'],
            match: [
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
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
