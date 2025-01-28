const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const {
  getCartItems,
  addToCart,
  updateCartQuantity,
  deleteCartItem,
} = require("../controllers/cartControllers");

// Display all the products in cart by calculating the Bill
router.get("/", isLoggedin, getCartItems);

// Add Product to cart and increase quantity if already exist
router.get("/addtocart/:productid", isLoggedin, addToCart);

// Update the Quanitty of the Product in Cart
router.post("/update/:productId", isLoggedin, updateCartQuantity);

// Delete the product from Cart
router.post("/delete/:productId", isLoggedin, deleteCartItem);

module.exports = router;
