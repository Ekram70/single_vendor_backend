const jwt = require('jsonwebtoken');
const UsersModel = require('../models/UsersModel');

const registration = (req, res) => {
    const reqBody = req.body;

    UsersModel.create(reqBody, (err) => {
        if (err) {
            res.status(200).json({ status: 'fail', data: err });
        } else {
            const { fullname, email } = reqBody;
            const payload = {
                exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
                data: email
            };
            const token = jwt.sign(payload, process.env.SECRET_KEY);
            res.status(200).json({
                status: 'success',
                token,
                data: {
                    fullname,
                    email
                }
            });
        }
    });
};

module.exports = {
    registration
};
