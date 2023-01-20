const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const UsersModel = require('../models/UsersModel');

const registration = async (req, res) => {
    const reqBody = req.body;
    const { name, email, password } = reqBody;

    const duplicate = await UsersModel.findOne({ email }).exec();

    if (duplicate) {
        return res.sendStatus(409);
    }

    try {
        const hashedPass = await bcrypt.hash(password, 7);
        const newUser = { name, email, password: hashedPass };
        await UsersModel.create(newUser);
        const payload = {
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
            data: email
        };
        const token = jwt.sign(payload, process.env.SECRET_KEY);
        res.status(201).json({ status: 'success', token, data: `New user ${name} created` });
    } catch (error) {
        res.status(500).json({ status: 'fail', data: error.message });
    }
};

module.exports = {
    registration
};
