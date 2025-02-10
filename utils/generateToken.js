const jwt = require("jsonwebtoken");

const generateToken = function (user, role) {
  return jwt.sign(
    { email: user.email, id: user._id, role: role },
    process.env.JWT_KEY
  );
};

module.exports = generateToken;
