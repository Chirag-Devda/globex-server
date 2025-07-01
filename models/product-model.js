const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: String, // "Cotton Round Neck T-Shirt"
    description: String,
    price: Number, //999
    discountPercentage: Number, //20
    finalPrice: Number, // price - discount
    stock: Number, // 10 , 20 etc
    sizes: [String], // ["S", "M", "L", "XL"]
    colors: [String], // ["Red", "Blue", "Black"]
    images: [String], // array of image URLs
    brand: String, // "Roadster", "Nike"
    category: String, // "Men", "Women", "Kids"
    subCategory: String, // "Topwear", "Bottomwear", "Footwear"
    itemType: String, // "T-Shirt", "Shirt", "Jeans", etc.
    tags: [String],
    salesTaxRate: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
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
