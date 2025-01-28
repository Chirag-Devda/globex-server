const express = require("express");
const { message } = require("../validation/User-Validation");
const router = express.Router();

router.get("/", (req, res) => {
  if (!req.cookies.token) {
    return res.json({
      message: "No token found. Please log in.",
      redirect: "/login", // Inform the frontend where to redirect if needed
    });
  }

  return res.json({
    message: "Token found. Redirecting to shop",
    redirect: "/shop",
  });
});

module.exports = router;
