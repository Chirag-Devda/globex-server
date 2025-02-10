const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      message: "Unothorized !",
      redirect: "/user/login",
    });
  }

  try {
    let decoded = jwt.verify(token, process.env.JWT_KEY);
    const { email, id, role } = decoded;

    if (role === "user") {
      req.user = { id, email, role: "user" };
    } else if (role === "owner") {
      req.owner = { id, email, role: "owner" };
    }

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(500).json({
      message: "Something went wrong",
      redirect: "/user/login",
    });
  }
};
