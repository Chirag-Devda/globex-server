const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");
const {
  createOwner,
  loginOwner,
  ownerDashboard,
} = require("../controllers/ownerControllers");

if (process.env.NODE_ENV === "development") {
  router.post("/register", createOwner);
}

router.post("/login", loginOwner);

router.get("/dashboard", isAuth, ownerDashboard);

module.exports = router;
