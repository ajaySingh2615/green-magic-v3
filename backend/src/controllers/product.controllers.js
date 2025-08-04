import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.models.js";
import { Vendor } from "../models/vendor.models.js";
import { Category } from "../models/category.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Create Product (Vendor Only)
 * Creates a new product with variants and images
 */
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    shortDescription,
    category,
    subcategories,
    pricing,
    inventory,
    variants,
    attributes,
    shipping,
    tags,
    brand,
    model,
    warranty,
    metaTitle,
    metaDescription,
    metaKeywords,
  } = req.body;

  // Get vendor profile
  const vendor = await Vendor.findOne({ userId: req.user._id });
  if (!vendor) {
    throw new ApiError(
      404,
      "Vendor profile not found. Please complete vendor registration."
    );
  }

  if (vendor.verificationStatus !== "approved") {
    throw new ApiError(
      403,
      "Vendor account must be verified to create products"
    );
  }

  // Basic validation
  if (!name?.trim() || !description?.trim() || !category) {
    throw new ApiError(400, "Name, description, and category are required");
  }

  if (!pricing?.originalPrice || pricing.originalPrice <= 0) {
    throw new ApiError(400, "Valid original price is required");
  }

  // Validate category exists
  const categoryDoc = await Category.findById(category);
  if (!categoryDoc || !categoryDoc.isActive) {
    throw new ApiError(400, "Invalid or inactive category");
  }

  // Validate subcategories if provided
  if (subcategories && subcategories.length > 0) {
    const subcategoryDocs = await Category.find({
      _id: { $in: subcategories },
      isActive: true,
    });
    if (subcategoryDocs.length !== subcategories.length) {
      throw new ApiError(400, "One or more subcategories are invalid");
    }
  }

  const productData = {
    name: name.trim(),
    description: description.trim(),
    shortDescription: shortDescription?.trim(),
    vendor: vendor._id,
    category,
    subcategories,
    pricing,
    inventory,
    variants,
    attributes,
    shipping,
    tags: tags?.map((tag) => tag.toLowerCase().trim()),
    brand: brand?.trim(),
    model: model?.trim(),
    warranty,
    metaTitle: metaTitle || name.trim(),
    metaDescription,
    metaKeywords,
    status: "draft", // Default to draft
    createdBy: req.user._id,
  };

  const product = await Product.create(productData);

  // Update vendor product count
  await Vendor.findByIdAndUpdate(vendor._id, {
    $inc: { totalProducts: 1 },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Product created successfully", product));
});

/**
 * Get Vendor Products (Vendor Only)
 * Returns products belonging to the vendor
 */
const getVendorProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    category,
    search,
    sortBy = "createdAt",
    order = "desc",
  } = req.query;

  const vendor = await Vendor.findOne({ userId: req.user._id });
  if (!vendor) {
    throw new ApiError(404, "Vendor profile not found");
  }

  const filter = { vendor: vendor._id };

  if (status) filter.status = status;
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  const sortOrder = order === "desc" ? -1 : 1;
  const sort = { [sortBy]: sortOrder };

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
    populate: [
      { path: "category", select: "name slug" },
      { path: "subcategories", select: "name slug" },
    ],
  };

  const products = await Product.paginate(filter, options);

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Vendor products retrieved successfully", products)
    );
});

/**
 * Get Product by ID/Slug (Public)
 * Returns product details with vendor information
 */
const getProductDetails = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  // Try to find by ID first, then by slug
  let product = await Product.findById(identifier);
  if (!product) {
    product = await Product.findOne({ slug: identifier });
  }

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // For non-vendor/admin users, only show active and visible products
  if (
    req.user?.role !== "admin" &&
    (!req.user ||
      req.user.role !== "vendor" ||
      product.vendor.toString() !== req.user.vendorProfile?.toString())
  ) {
    if (product.status !== "active" || !product.isVisible) {
      throw new ApiError(404, "Product not found");
    }
  }

  // Populate related data
  await product.populate([
    {
      path: "vendor",
      select:
        "companyName storeSettings rating totalProducts verificationStatus",
    },
    {
      path: "category",
      select: "name slug path",
    },
    {
      path: "subcategories",
      select: "name slug",
    },
  ]);

  // Update view count
  if (
    req.user?.role !== "vendor" ||
    product.vendor._id.toString() !== req.user.vendorProfile?.toString()
  ) {
    await Product.findByIdAndUpdate(product._id, {
      $inc: { "analytics.views": 1 },
    });
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Product details retrieved successfully", product)
    );
});

/**
 * Update Product (Vendor Only)
 * Updates product information
 */
const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const updateData = { ...req.body };

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check vendor ownership
  const vendor = await Vendor.findOne({ userId: req.user._id });
  if (!vendor || product.vendor.toString() !== vendor._id.toString()) {
    throw new ApiError(
      403,
      "Access denied. You can only update your own products."
    );
  }

  // Validate category if being updated
  if (updateData.category) {
    const categoryDoc = await Category.findById(updateData.category);
    if (!categoryDoc || !categoryDoc.isActive) {
      throw new ApiError(400, "Invalid or inactive category");
    }
  }

  updateData.updatedBy = req.user._id;

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Product updated successfully", updatedProduct));
});

/**
 * Delete Product (Vendor Only)
 * Deletes a product
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check vendor ownership
  const vendor = await Vendor.findOne({ userId: req.user._id });
  if (!vendor || product.vendor.toString() !== vendor._id.toString()) {
    throw new ApiError(
      403,
      "Access denied. You can only delete your own products."
    );
  }

  await Product.findByIdAndDelete(productId);

  // Update vendor product count
  await Vendor.findByIdAndUpdate(vendor._id, {
    $inc: { totalProducts: -1 },
  });

  return res.status(200).json(
    new ApiResponse(200, "Product deleted successfully", {
      deletedProduct: product.name,
    })
  );
});

/**
 * Update Product Status (Vendor Only)
 * Updates product status (draft, active, inactive, archived)
 */
const updateProductStatus = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { status } = req.body;

  if (!["draft", "active", "inactive", "archived"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check vendor ownership
  const vendor = await Vendor.findOne({ userId: req.user._id });
  if (!vendor || product.vendor.toString() !== vendor._id.toString()) {
    throw new ApiError(
      403,
      "Access denied. You can only update your own products."
    );
  }

  product.status = status;
  await product.save();

  return res.status(200).json(
    new ApiResponse(200, "Product status updated successfully", {
      productId: product._id,
      name: product.name,
      status: product.status,
    })
  );
});

/**
 * Update Product Inventory (Vendor Only)
 * Updates product stock and inventory settings
 */
const updateProductInventory = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { stock, operation = "set" } = req.body;

  if (stock < 0) {
    throw new ApiError(400, "Stock cannot be negative");
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check vendor ownership
  const vendor = await Vendor.findOne({ userId: req.user._id });
  if (!vendor || product.vendor.toString() !== vendor._id.toString()) {
    throw new ApiError(
      403,
      "Access denied. You can only update your own products."
    );
  }

  if (operation === "set") {
    product.inventory.stock = stock;
  } else if (operation === "add") {
    product.inventory.stock += stock;
  } else if (operation === "subtract") {
    product.inventory.stock = Math.max(0, product.inventory.stock - stock);
  }

  await product.save();

  return res.status(200).json(
    new ApiResponse(200, "Product inventory updated successfully", {
      productId: product._id,
      name: product.name,
      stock: product.inventory.stock,
      availabilityStatus: product.availabilityStatus,
    })
  );
});

/**
 * Search Products (Public)
 * Search products with filters
 */
const searchProducts = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    brand,
    tags,
    inStock = true,
    page = 1,
    limit = 20,
    sortBy = "relevance",
  } = req.query;

  const filter = {
    status: "active",
    isVisible: true,
  };

  // Text search
  if (q?.trim()) {
    filter.$text = { $search: q.trim() };
  }

  // Category filter
  if (category) {
    filter.category = category;
  }

  // Price range filter
  if (minPrice || maxPrice) {
    filter["pricing.salePrice"] = {};
    if (minPrice) filter["pricing.salePrice"].$gte = parseFloat(minPrice);
    if (maxPrice) filter["pricing.salePrice"].$lte = parseFloat(maxPrice);
  }

  // Brand filter
  if (brand) {
    filter.brand = { $regex: brand, $options: "i" };
  }

  // Tags filter
  if (tags) {
    const tagArray = tags.split(",").map((tag) => tag.trim());
    filter.tags = { $in: tagArray };
  }

  // Stock filter
  if (inStock === "true") {
    filter.$or = [
      { "inventory.trackInventory": false },
      { "inventory.stock": { $gt: 0 } },
      { "inventory.allowBackorder": true },
    ];
  }

  let sort = {};
  switch (sortBy) {
    case "price_low":
      sort = { "pricing.salePrice": 1 };
      break;
    case "price_high":
      sort = { "pricing.salePrice": -1 };
      break;
    case "newest":
      sort = { createdAt: -1 };
      break;
    case "rating":
      sort = { "ratings.average": -1 };
      break;
    case "relevance":
    default:
      if (q?.trim()) {
        sort = { score: { $meta: "textScore" } };
      } else {
        sort = { createdAt: -1 };
      }
      break;
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort,
    populate: [
      { path: "vendor", select: "companyName storeSettings rating" },
      { path: "category", select: "name slug" },
    ],
  };

  const products = await Product.paginate(filter, options);

  return res
    .status(200)
    .json(new ApiResponse(200, "Products search completed", products));
});

/**
 * Get Featured Products (Public)
 * Returns featured products for homepage
 */
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const { limit = 10, category } = req.query;

  const filter = {
    isFeatured: true,
    status: "active",
    isVisible: true,
  };

  if (category) {
    filter.category = category;
  }

  const featuredProducts = await Product.find(filter)
    .populate("vendor", "companyName storeSettings")
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Featured products retrieved successfully",
        featuredProducts
      )
    );
});

/**
 * Get Products by Category (Public)
 * Returns products in a specific category
 */
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { page = 1, limit = 20, sortBy = "newest" } = req.query;

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sortBy === "newest" ? { createdAt: -1 } : { "ratings.average": -1 },
    populate: [{ path: "vendor", select: "companyName storeSettings rating" }],
  };

  const products = await Product.findByCategory(categoryId, options);

  return res.status(200).json(
    new ApiResponse(200, "Category products retrieved successfully", {
      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
      },
      products,
    })
  );
});

export {
  createProduct,
  getVendorProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  updateProductInventory,
  searchProducts,
  getFeaturedProducts,
  getProductsByCategory,
};
