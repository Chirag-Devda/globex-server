const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/isAuth");
const {
  getCartItems,
  addToCart,
  updateCartQuantity,
  deleteCartItem,
} = require("../controllers/cartControllers");

// Display all the products in cart by calculating the Bill
router.get("/", isAuth, getCartItems);

// Add Product to cart and increase quantity if already exist
router.get("/addtocart/:productid", isAuth, addToCart);

// Update the Quanitty of the Product in Cart
router.post("/update/:productId", isAuth, updateCartQuantity);

// Delete the product from Cart
router.post("/delete/:productId", isAuth, deleteCartItem);

module.exports = router;
