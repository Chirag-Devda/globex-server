const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

exports.getCartItems = async function (req, res) {
  try {
    const user = await userModel
      .findOne({ email: req.user.email })
      .populate("cart.product");

    let totalBill = 0;

    const cartItems = user.cart.map((item) => {
      // Convert the image buffer to a Base64 string
      if (item.product.image) {
        item.product.image = `data:image/jpeg;base64,${item.product.image.toString(
          "base64"
        )}`;
      }

      // Add to total bill
      totalBill += item.product.price * item.quantity;

      return item; // Return the modified item
    });

    res.status(200).json({
      success: true,
      data: {
        cartItems,
        totalBill,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart items",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.addToCart = async function (req, res) {
  try {
    const productId = req.params.productid;
    const quantity = req.body.quantity || 1; // Get quantity from request body (default to 1)

    // Find the product by ID
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the user by email
    const user = await userModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the product is already in the user's cart
    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (cartItem) {
      // If the product is already in the cart, update the quantity
      cartItem.quantity += quantity;
    } else {
      // If the product is not in the cart, add it to the cart
      user.cart.push({ product: productId, quantity });
    }

    // Save the updated user document
    await user.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: user.cart.map((item) => ({
        productID: item.product,
        quantity: item.quantity,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

exports.updateCartQuantity = async function (req, res) {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    // Covert Quantity into integer and valid it
    const updatedQuantity = parseInt(quantity);
    if (isNaN(updatedQuantity)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quantity",
      });
    }

    // Find User
    const user = await userModel.findOne({ email: req.user.email });

    // Find the specific cart item
    const cartItem = user.cart.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found in cart !" });
    }

    if (cartItem) {
      if (updatedQuantity <= 0) {
        // Remove the item if quantity is 0 or less
        user.cart = user.cart.filter(
          (item) => item.product.toString() !== productId
        );
      } else {
        cartItem.quantity = updatedQuantity;
      }
      await user.save();
    }

    // Return the updated cart
    res.status(200).json({
      success: true,
      message: "cart updated successfully",
      cart: user.cart.map((item) => ({
        productId: item.product,
        quantity: item.quantity,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error updating cart",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

exports.deleteCartItem = async function (req, res) {
  try {
    const { productId } = req.params;

    // Find the user and update their cart
    const user = await userModel.findOne({ email: req.user.email });
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: "Item removed from cart successfully",
      cart: user.cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to remove item from cart",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
