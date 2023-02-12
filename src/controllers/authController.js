const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usersModel = require('../models/usersModel');

const login = async (req, res) => {
    const { email, password, rememberMe } = req.body;
    try {
        const foundUser = await usersModel.findOne({ email }).exec();

        if (!foundUser) {
            return res.sendStatus(401);
        }

        const match = await bcrypt.compare(password, foundUser.password);
        if (match) {
            const roles = Object.values(foundUser.roles);
            const payload = {
                id: foundUser._id,
                name: foundUser.name,
                email: foundUser.email,
                roles
            };
            let accessToken = '';
            let refreshToken = '';
            if (rememberMe) {
                accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '3h'
                });
                refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: '7d'
                });
            } else {
                accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '30m'
                });
                refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: '2d'
                });
            }
            await usersModel.updateOne(
                { _id: foundUser._id },
                {
                    $set: {
                        refreshToken
                    }
                }
            );
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'None',
                secure: true,
                maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 2 * 24 * 60 * 60 * 1000
            });
            res.status(200).json({
                status: 'success',
                accessToken
            });
        } else {
            res.sendStatus(401);
        }
    } catch (error) {
        res.status(500).json({ status: 'fail', data: error.message });
    }
};

module.exports = {
    login
};
