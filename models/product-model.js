const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: String,
    image: Buffer,
    imageUrl: String,
    price: Number,
    discount: { type: Number, default: 0 },
    description: String,
    category: String, // Changed to a single category field
    stockQuantity: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    reviews: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: Number,
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [String],
    salesTaxRate: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Update `updatedAt` whenever the product is updated
productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("product", productSchema);
