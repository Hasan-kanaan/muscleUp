const jwt = require("jsonwebtoken");
const user = require("../models/UserModel");
const requireAuth = async (req, res, next) => {
  // verify authorization
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await user.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not Authorized" });
  }
};

module.exports = requireAuth;