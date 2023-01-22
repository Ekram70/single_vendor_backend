const usersModel = require('../models/usersModel');

const getAllUser = async (req, res) => {
    try {
        const users = await usersModel.find();

        res.status(200).json({ status: 'success', data: users });
    } catch (error) {
        res.status(500).json({ status: 'fail', data: error.message });
    }
};

const getUser = async (req, res) => {
    const { name, id } = req;
    try {
        const foundUser = await usersModel.findOne({ _id: id }).exec();
        if (!foundUser) {
            res.status(400).json({ status: 'fail', data: `User ${name} not found` });
        }

        res.status(200).json({ status: 'success', data: foundUser });
    } catch (error) {
        res.status(500).json({ status: 'fail', data: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id, name, body } = req;
    try {
        const foundUser = await usersModel.findOne({ _id: id }).exec();
        if (!foundUser) {
            res.status(400).json({ status: 'fail', data: `User ${name} not found` });
        }

        await usersModel.updateOne(
            { _id: id },
            {
                $set: body
            }
        );

        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', data: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { id, name } = req;
    try {
        const foundUser = await usersModel.findOne({ _id: id }).exec();
        if (!foundUser) {
            res.status(400).json({ status: 'fail', data: `User ${name} not found` });
        }
        await usersModel.deleteOne({ _id: id });
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ status: 'fail', data: error.message });
    }
};

module.exports = {
    getAllUser,
    getUser,
    updateUser,
    deleteUser
};
