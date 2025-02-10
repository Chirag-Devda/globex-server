const express = require("express");
const isAuth = require("../middlewares/isAuth");
const userModel = require("../models/user-model");
const ownerModel = require("../models/owner-model");
const router = express.Router();

router.get("/me", isAuth, async (req, res) => {
  try {
    if (req.user) {
      const user = await userModel
        .findOne({ email: req.user.email })
        .select("-password");

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({
        id: user.id,
        email: user.email,
        role: user.role,
      });
    }

    if (req.owner) {
      const owner = await ownerModel
        .findOne({ email: req.owner.email })
        .select("-password");

      if (!owner) {
        return res.status(404).json({ message: "Owner not found" });
      }

      return res.json({
        id: owner.id,
        email: owner.email,
        role: owner.role,
      });
    }

    return res
      .status(400)
      .json({ message: "No user or owner found in the session" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
