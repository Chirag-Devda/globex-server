const express = require("express");
const isAuth = require("../middlewares/isAuth");
const userModel = require("../models/user-model");
const ownerModel = require("../models/owner-model");
const router = express.Router();

router.get("/me", isAuth, async (req, res) => {
  try {
    const { email, role } = req.currentUser;

    let model;
    if (role === "user") model = userModel;
    else if (role === "owner") model = ownerModel;
    else return res.status(403).json({ message: "Invalid role." });

    const user = await model.findOne({ email }).select("-password");

    return res.json({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
