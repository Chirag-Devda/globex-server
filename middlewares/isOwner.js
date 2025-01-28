const ownerModel = require("../models/owner-model");
const jwt = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  if (!req.cookies.token) {
    req.flash("error", "you need to login first");
    return res.redirect("/");
  }

  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

    const owner = await ownerModel
      .findOne({ email: decoded.email })
      .select("-password");

    if (!owner) {
      req.flash("error", "You are not authorized to access that route");
      return res.redirect("/");
    }

    req.owner = owner;
    next();
  } catch (error) {
    console.error("Owner Middleware Error:", error.message);
    req.flash("error", "Something went wrong");
    res.status(500).redirect("/");
  }
};
