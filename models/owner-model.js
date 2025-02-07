const { required, types } = require("joi");
const mongoose = require("mongoose");

const ownerSchema = mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  picture: String,
  gstin: String,
  role: { type: String, default: "owner" },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` whenever the product is updated
ownerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("owner", ownerSchema);
