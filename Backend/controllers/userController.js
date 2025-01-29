const user = require("../models/UserModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
}

// log in
const logInUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const oldUser = await user.login(email, password);

    const token = createToken(oldUser._id);

    res.status(200).json({email, token});

  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

//sign up
const signUpUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const newUser = await user.signup(email, password);

    const token = createToken(newUser._id);

    res.status(200).json({email, token});

  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

module.exports = {
  logInUser,
  signUpUser,
};
