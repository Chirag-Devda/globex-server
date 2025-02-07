const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullname: String,
  email: String,
  password: String,
  contact: Number,
  picture: String,
  role: { type: String, default: "user" },
  cart: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      }, // Reference to the Product model
      quantity: { type: Number, default: 1 }, // Quantity of the product in the cart
    },
  ],
  orders: {
    type: Array,
    default: [],
  },
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
userSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("User", userSchema);
