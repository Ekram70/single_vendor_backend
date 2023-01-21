const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usersModel = require('../models/usersModel');

const handleRegistration = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const duplicate = await usersModel.findOne({ email }).exec();

        if (duplicate) {
            return res.sendStatus(409);
        }
        const hashedPass = await bcrypt.hash(password, 7);
        const newUser = { name, email, password: hashedPass };
        await usersModel.create(newUser);
        const payload = {
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
            data: email
        };
        const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
        res.status(201).json({ status: 'success', token, data: `New user ${name} created` });
    } catch (error) {
        res.status(500).json({ status: 'fail', data: error.message });
    }
};

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await usersModel.findOne({ email }).exec();

        if (!foundUser) {
            return res.sendStatus(401);
        }

        const match = await bcrypt.compare(password, foundUser.password);
        if (match) {
            const payload = {
                name: foundUser.name,
                email: foundUser.email
            };
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '30m'
            });
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '2d'
            });
            await usersModel.updateOne(
                { email: foundUser.email },
                {
                    $set: {
                        refreshToken
                    }
                }
            );
            res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 2 * 24 * 60 * 60 * 1000 });
            res.json({
                status: 'success',
                accessToken,
                data: `User ${foundUser.name} is logged in!`
            });
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        res.status(500).json({ status: 'fail', data: error.message });
    }
};

module.exports = {
    handleRegistration,
    handleLogin
};