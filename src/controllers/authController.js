const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usersModel = require('../models/usersModel');

const login = async (req, res) => {
    const { email, password } = req.body;
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

            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '30m'
            });
            const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '2d'
            });
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
                maxAge: 2 * 24 * 60 * 60 * 1000
            });
            res.status(200).json({
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
    login
};
