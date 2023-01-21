const jwt = require('jsonwebtoken');
const usersModel = require('../models/usersModel');

const handleRefreshToken = async (req, res) => {
    const { cookies } = req;

    if (!cookies?.jwt) {
        return res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;

    try {
        const foundUser = await usersModel.findOne({ refreshToken }).exec();

        if (!foundUser) {
            return res.sendStatus(403);
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err || foundUser.name !== decoded.name || foundUser.email !== decoded.email) {
                res.sendStatus(403);
            }
            const payload = {
                name: foundUser.name,
                email: foundUser.email
            };
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '30m'
            });
            res.json({
                status: 'success',
                accessToken
            });
        });
    } catch (error) {
        res.status(500).json({ status: 'fail', data: error.message });
    }
};
module.exports = {
    handleRefreshToken
};
