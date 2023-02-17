const usersModel = require("../models/usersModel");

const getAllUser = async (req, res) => {
  try {
    const users = await usersModel.find();

    if (!users) {
      return res.status(204).json({
        status: "success",
        data: "No Users Found",
      });
    }

    res.status(200).json({ status: "success", data: users });
  } catch (error) {
    res.status(500).json({ status: "fail", data: error.message });
  }
};

const getUser = async (req, res) => {
  const { name, id } = req;
  try {
    const foundUser = await usersModel
      .findOne({ _id: id })
      .select({
        password: 0,
        refreshToken: 0,
        updatedAt: 0,
        createdAt: 0,
        roles: 0,
        _id: 0,
      })
      .exec();

    if (!foundUser) {
      res
        .status(204)
        .json({ status: "fail", userData: `User ${name} not found` });
    }

    res.status(200).json({ status: "success", userData: foundUser });
  } catch (error) {
    res.status(500).json({ status: "fail", userData: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id, name, body } = req;
  console.log(body);
  try {
    const foundUser = await usersModel.findOne({ _id: id }).exec();
    if (!foundUser) {
      res.status(204).json({ status: "fail", data: `User ${name} not found` });
    }

    await usersModel.updateOne(
      { _id: id },
      {
        $set: body,
      }
    );

    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "fail", data: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id, name } = req;
  try {
    const foundUser = await usersModel.findOne({ _id: id }).exec();
    if (!foundUser) {
      res
        .status(204)
        .json({ status: "success", data: `User ${name} not found` });
    }
    await usersModel.deleteOne({ _id: id });
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(500).json({ status: "fail", data: error.message });
  }
};

module.exports = {
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
};
