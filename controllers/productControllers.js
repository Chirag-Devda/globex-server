const productValidationSchema = require("../validation/Product-Validation");
const productModal = require("../models/product-model");
const cloudinary = require("../config/cloudinary");

exports.getAllProducts = async (req, res) => {
  const { category, subCategory, itemType, brand } = req.query;

  const filter = {};

  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;
  if (itemType) filter.itemType = itemType;
  if (brand) filter.brand = brand;

  try {
    const products = await productModal.find(filter);
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch filtered products. Please try again later.",
    });
  }
};

exports.createProduct = async function (req, res) {
  const isActiveBoolean = req.body.isActive === "on";
  // Construct the data to validate
  let dataToValidate = {
    ...req.body,
    isActive: isActiveBoolean,
    images: req.files?.images?.map((file) => file.buffer) || [],
  };

  // Validate the incoming data with Joi
  const { error } = productValidationSchema.validate(dataToValidate);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    const files = req.files;

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Images are required" });
    }

    const imageLinks = []; // Store all the images Url of the product

    // Upload all images to Cloudinary
    for (const file of files) {
      const base64Image = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;

      const result = await cloudinary.uploader.upload(base64Image, {
        folder: "products",
      });

      imageLinks.push(result.secure_url);
    }

    // Destructure fields
    const {
      title,
      description,
      price,
      discountPercentage,
      finalPrice,
      stock,
      sizes,
      colors,
      brand,
      category,
      subCategory,
      itemType,
      tags,
      salesTaxRate,
    } = req.body;

    // Create the product in the database
    let product = await productModal.create({
      title,
      description,
      price,
      discountPercentage,
      finalPrice,
      stock,
      sizes,
      colors,
      brand,
      images: imageLinks,
      category,
      subCategory,
      itemType,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [], // Ensure tags is an array
      salesTaxRate: salesTaxRate || 0,
      isActive: isActiveBoolean, // Ensure isActive is boolean
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: product,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "An error occurred while creating the product.",
    });
  }
};

exports.showUpdateProductForm = async function (req, res) {
  const { productId } = req.params;

  try {
    const product = await productModal.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Convert the image buffer to a base64 string
    const base64Image = product.image.toString("base64");

    res.status(200).json({
      success: true,
      product: {
        ...product.toObject(),
        image: base64Image,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product details" });
  }
};

exports.updateProduct = async function (req, res) {
  const { productId } = req.params;
  const isActiveBoolean = req.body.isActive === "on";
  // Construct the data to validate
  let dataToValidate = {
    ...req.body,
    isActive: isActiveBoolean,
  };

  // Validate the incoming data with Joi
  const { error } = productValidationSchema.validate(dataToValidate);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  try {
    // Destructure fields
    const {
      name,
      price,
      discount,
      description,
      category,
      stockQuantity,
      tags,
      salesTaxRate,
    } = req.body;

    // Prepare updated fields
    const updatedFields = {
      name,
      price,
      discount,
      description,
      category,
      stockQuantity,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [], // Ensure tags is an array
      salesTaxRate: salesTaxRate || 0,
      isActive: isActiveBoolean, // Ensure isActive is boolean
    };

    // Update the product in the database
    const updatedProduct = await productModal.findByIdAndUpdate(
      productId,
      updatedFields,
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? err.message
          : "An error occurred while updating the product.",
    });
  }
};

exports.deleteProduct = async function (req, res) {
  const { productId } = req.params;
  console.log("id", productId);

  try {
    const deleteProduct = await productModal.findByIdAndDelete(productId);
    console.log(deleteProduct);

    if (!deleteProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found or already deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Error occurred during deleting product",
    });
  }
};
