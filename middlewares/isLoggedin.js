const jwt = require("jsonwebtoken");
const userModel = require("../models/user-model");

module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
    return res.status(401).json({
      message: "You need to log in first.",
      redirect: "/login",
    });
  }

  try {
    let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
    let user = await userModel
      .findOne({ email: decoded.email })
      .select("-password");

    if (!user) {
      return res.status(403).json({
        message: "User not found or unauthorized.",
        redirect: "/login",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Login Middleware Error:", error.message);
    return res.status(500).json({
      message: "Something went wrong.",
      redirect: "/",
    });
  }
};
