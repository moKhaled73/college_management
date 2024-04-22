const User = require("../models/user");
const Subject = require("../models/subject");
const { StatusCodes } = require("http-status-codes");
const QRcode = require("qrcode");

const updateUserName = async (req, res) => {
  const userId = req.user._id;

  const { name } = req.body;
  const user = await User.findById(userId);
  if (!user) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("User not found");
  }
  user.name = name;
  await user.save();
  res.status(StatusCodes.OK).json({ message: "Name updated successfully" });
};

const updateUserPassword = async (req, res) => {
  const userId = req.user._id;
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Please provide old and new password");
  }
  const user = await User.findById(userId);
  if (!user) {
    res.status(StatusCodes.NOT_FOUND);
    throw new Error("User not found");
  }
  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("Old password is incorrect");
  }
  user.password = newPassword;
  await user.save();
  res.status(StatusCodes.OK).json({ message: "Password updated successfully" });
};

module.exports = {
  updateUserName,
  updateUserPassword,
};
