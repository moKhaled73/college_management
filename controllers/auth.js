const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const createToken = require("../utils/createToken");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user && !(await user.comparePassword(password))) {
    res.status(StatusCodes.BAD_REQUEST);
    throw new Error("User does not exist");
  }

  const token = createToken(user._id);
  res.status(StatusCodes.OK).json({ token, user });
};

module.exports = {
  login,
};
