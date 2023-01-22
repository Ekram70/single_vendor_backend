const usersModel = require('../models/usersModel');

const logout = async (req, res) => {
    const { cookies } = req;

    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }
    const refreshToken = cookies.jwt;

    try {
        const foundUser = await usersModel.findOne({ refreshToken }).exec();

        if (!foundUser) {
            res.clearCookie('jwt', {
                httpOnly: true,
                sameSite: 'None',
                secure: true
            });
            return res.sendStatus(204);
        }

        await usersModel.updateOne(
            { _id: foundUser._id },
            {
                $set: {
                    refreshToken: ''
                }
            }
        );

        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true
        });
        return res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ status: 'fail', data: error.message });
    }
};
module.exports = {
    logout
};
