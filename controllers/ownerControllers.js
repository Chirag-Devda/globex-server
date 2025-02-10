const ownerModel = require("../models/owner-model");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcrypt");
const productModel = require("../models/product-model");

exports.createOwner = async function (req, res) {
  try {
    let { fullname, email, password } = req.body;

    console.log(req.body);

    // Check if any owner already exists
    let owners = await ownerModel.find();

    if (owners.length > 0) {
      return res
        .status(403) // Use 403 (Forbidden) for permission issues
        .send("You don't have permission to create a new owner.");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new owner
    let newOwner = await ownerModel.create({
      email,
      password: hashedPassword,
      fullname,
    });

    // Generate token
    let token = generateToken(newOwner, "owner");
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure cookie in production
    });

    return res.status(201).json({
      success: true,
      message: "Registered successfully. Token set in cookies.",
      data: {
        owner: {
          email: newOwner.email,
          fullname: newOwner.fullname,
          role: newOwner.role,
        },
      },
    });
  } catch (error) {
    console.error("Error during registration owner:", error);

    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again.",
    });
  }
};

exports.loginOwner = async function (req, res) {
  // user form data
  const { email, password } = req.body;

  try {
    // Check if the owner exists in the ownerModel
    let owner = await ownerModel.findOne({ email });

    // if owner not exist
    if (!owner) {
      return res.status(400).json({
        success: false,
        message: "Email or Password Incorrect",
      });
    }

    // Compare password using bcrypt
    const isMatch = await bcrypt.compare(password, owner.password);

    // if password matches
    if (isMatch) {
      // Generate a token for the owner
      const token = generateToken(owner, "owner");

      // Set the token as a cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Set secure flag for production
      });

      return res.status(200).json({
        success: true,
        message: "Owner login successful",
        data: {
          owner: {
            email: owner.email,
            fullname: owner.fullname,
            role: owner.role,
          },
        },
      });
    } // if password not matches
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password.",
      });
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again.",
    });
  }
};

exports.ownerDashboard = async function (req, res) {
  try {
    let products = await productModel.find();

    // Convert image buffers to base64 strings
    const updatedProducts = products.map((product) => {
      if (product.image) {
        return {
          ...product._doc,
          image: Buffer.from(product.image, "binary").toString("base64"), // Convert image to base64
        };
      }
      return product;
    });

    res.status(200).json({
      success: true,
      data: updatedProducts, // Return the updated products
    });
  } catch (error) {
    console.error("/dashboard", error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching products.",
    });
  }
};
