const ownerModel = require("../models/owner-model");
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
    return res.status(401).json({
      message: "You need to log in first.",
      redirect: "/login",
    });
  }

  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

    const owner = await ownerModel
      .findOne({ email: decoded.email })
      .select("-password");

    if (!owner) {
      return res.status(403).json({
        message: "You are not authorized to access this route.",
        redirect: "/",
      });
    }

    req.owner = owner;
    next();
  } catch (error) {
    console.error("Owner Middleware Error:", error.message);
    return res.status(500).json({
      message: "Something went wrong.",
      redirect: "/",
    });
  }
};
