const userModel = require("../models/user-model");
const userValidationSchema = require("../validation/User-Validation");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcrypt");

exports.createUser = async function (req, res) {
  // Validate the user input based on the uservalidationSchema
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    let { fullname, email, password } = req.body;

    // Check if a user with the same email already exists
    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    let newUser = await userModel.create({
      email,
      password: hashedPassword,
      fullname,
    });

    await newUser.save();

    // Generate token
    let token = generateToken(newUser);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    }); // Secure the cookie

    return res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: {
        user: {
          email: newUser.email,
          fullname: newUser.fullname,
          role: newUser.role,
        },
      },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    // Send error response
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred. Please try again.",
    });
  }
};

exports.loginUser = async function (req, res) {
  let { email, password } = req.body;

  try {
    let user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare password and handle the result explicitly
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = generateToken(user);
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      return res.status(200).json({
        success: true,
        message: "Login successful.",
        data: {
          user: {
            email: user.email,
            fullname: user.fullname,
            role: user.role,
          },
        },
      });
    } else {
      return res.status(401).json({
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

exports.logoutUser = async function (req, res) {
  // Clear the token cookie explicitly
  res.cookie("token", " ", {
    httpOnly: true, // Ensures cookie cannot be accessed via client-side scripts
    secure: process.env.NODE_ENV === "production", // Cookie only sent over HTTPS in production
    expires: new Date(0), // Immediately expires the cookie
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};
