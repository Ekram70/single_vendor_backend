const usersModel = require('../models/usersModel');

const handleGetAllUser = async (req, res) => {
    try {
        const users = await usersModel.find();

        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        res.status(500).json({ status: 'fail', data: error.message });
    }
};

module.exports = {
    handleGetAllUser
};
