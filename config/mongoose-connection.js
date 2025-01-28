const mongoose = require("mongoose");
const config = require("config");

const dbgr = require("debug")("development:mongoose");

const dbURI = `${config.get("MONGODB_URI")}/Backend-Project-1-ecommerce`;

mongoose
  .connect(dbURI)
  .then(() => dbgr("Connected to database"))
  .catch((err) => dbgr("Database connection error:", err));

module.exports = mongoose.connection;
