const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");
const productModel = require("../models/product-model");

router.get("/", isAuth, async (req, res) => {
  try {
    let products = await productModel.find();

    // Convert image buffers to base64 strings
    products.forEach((product) => {
      if (product.image) {
        product.image = Buffer.from(product.image, "binary").toString("base64");
      }
    });

    res.status(200).json({
      success: true,
      products: products,
      message: "Products fetched successfully", // Send success message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching products", // Send error message
    });
  }
});

module.exports = router;
