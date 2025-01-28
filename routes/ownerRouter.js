const express = require("express");
const router = express.Router();
const isOwner = require("../middlewares/isOwner");
const {
  createOwner,
  showLoginForm,
  loginOwner,
  ownerDashboard,
} = require("../controllers/ownerControllers");

if (process.env.NODE_ENV === "development") {
  router.post("/register", createOwner);
}

router.post("/login", loginOwner);

router.get("/dashboard", isOwner, ownerDashboard);

module.exports = router;
