module.exports = (allowedRole) => {
  return (req, res, next) => {
    const user = req.currentUser;

    if (!user || !allowedRole.includes(user.role)) {
      return res.status(403).json({ message: "Access denied. Forbidden" });
    }

    next();
  };
};
