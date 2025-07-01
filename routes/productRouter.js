const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const isAuth = require("../middlewares/isAuth");
const {
  createProduct,
  deleteProduct,
  showUpdateProductForm,
  updateProduct,
} = require("../controllers/productControllers");
const hasRole = require("../middlewares/hasRole");

// create product
router.post(
  "/create",
  isAuth,
  hasRole("owner"),
  upload.array("images"),
  createProduct // Handle image upload
);

// Update product get
router.get("/edit/:productId", isAuth, hasRole("owner"), showUpdateProductForm);

// Update Product post
router.post(
  "/update/:productId",
  isAuth,
  hasRole("owner"),
  upload.single("image"),
  updateProduct
);

// Delete Product
router.post("/delete/:productId", isAuth, hasRole("owner"), deleteProduct);

module.exports = router;
