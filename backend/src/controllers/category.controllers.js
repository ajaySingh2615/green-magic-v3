import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Category } from "../models/category.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Create Category (Admin Only)
 * Creates a new category with hierarchy support
 */
const createCategory = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    parentCategory,
    metaTitle,
    metaDescription,
    metaKeywords,
    image,
    icon,
    color,
    isFeatured,
    isVisible,
    displayOrder,
    showInNavigation,
    showInFooter,
    commissionRate,
    attributes,
  } = req.body;

  // Basic validation
  if (!name?.trim()) {
    throw new ApiError(400, "Category name is required");
  }

  // Check if category with same name exists
  const existingCategory = await Category.findOne({ name: name.trim() });
  if (existingCategory) {
    throw new ApiError(400, "Category with this name already exists");
  }

  // Validate parent category if provided
  if (parentCategory) {
    const parent = await Category.findById(parentCategory);
    if (!parent) {
      throw new ApiError(400, "Parent category not found");
    }
    if (parent.level >= 3) {
      throw new ApiError(400, "Maximum category depth (4 levels) exceeded");
    }
  }

  const categoryData = {
    name: name.trim(),
    description,
    parentCategory,
    metaTitle,
    metaDescription,
    metaKeywords,
    image,
    icon,
    color,
    isFeatured: isFeatured || false,
    isVisible: isVisible !== false, // Default to true
    displayOrder: displayOrder || 0,
    showInNavigation: showInNavigation !== false, // Default to true
    showInFooter: showInFooter || false,
    commissionRate,
    attributes,
    createdBy: req.user._id,
  };

  const category = await Category.create(categoryData);

  return res
    .status(201)
    .json(new ApiResponse(201, "Category created successfully", category));
});

/**
 * Get All Categories (Public/Admin)
 * Returns hierarchical category structure
 */
const getAllCategories = asyncHandler(async (req, res) => {
  const {
    includeInactive = false,
    parentId = null,
    level,
    featured,
    navigation,
  } = req.query;

  const filter = {};

  // Admin can see inactive categories
  if (!includeInactive || req.user?.role !== "admin") {
    filter.isActive = true;
    filter.isVisible = true;
  }

  if (parentId !== null) {
    filter.parentCategory = parentId === "null" ? null : parentId;
  }

  if (level !== undefined) {
    filter.level = parseInt(level);
  }

  if (featured === "true") {
    filter.isFeatured = true;
  }

  if (navigation === "true") {
    filter.showInNavigation = true;
  }

  const categories = await Category.find(filter)
    .sort({ displayOrder: 1, name: 1 })
    .populate("parentCategory", "name slug level");

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Categories retrieved successfully", categories)
    );
});

/**
 * Get Category Tree (Public)
 * Returns complete category hierarchy
 */
const getCategoryTree = asyncHandler(async (req, res) => {
  const buildTree = async (parentId = null, level = 0) => {
    const categories = await Category.find({
      parentCategory: parentId,
      isActive: true,
      isVisible: true,
    }).sort({ displayOrder: 1, name: 1 });

    const tree = [];
    for (const category of categories) {
      const categoryObj = {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        icon: category.icon,
        color: category.color,
        level: category.level,
        productCount: category.productCount,
        isFeatured: category.isFeatured,
        url: category.url,
        children: await buildTree(category._id, level + 1),
      };
      tree.push(categoryObj);
    }
    return tree;
  };

  const categoryTree = await buildTree();

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Category tree retrieved successfully", categoryTree)
    );
});

/**
 * Get Category by ID/Slug (Public)
 * Returns category details with children and ancestors
 */
const getCategoryDetails = asyncHandler(async (req, res) => {
  const { identifier } = req.params;

  // Try to find by ID first, then by slug
  let category = await Category.findById(identifier);
  if (!category) {
    category = await Category.findOne({ slug: identifier });
  }

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // For non-admin users, check visibility
  if (
    req.user?.role !== "admin" &&
    (!category.isActive || !category.isVisible)
  ) {
    throw new ApiError(404, "Category not found");
  }

  // Get ancestors (breadcrumb)
  const ancestors = await category.getAncestors();

  // Get immediate children
  const children = await category.getChildren();

  // Build breadcrumb
  const breadcrumb = await Category.buildBreadcrumb(category._id);

  const categoryDetails = {
    ...category.toObject(),
    ancestors,
    children,
    breadcrumb,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Category details retrieved successfully",
        categoryDetails
      )
    );
});

/**
 * Update Category (Admin Only)
 * Updates category information
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const updateData = { ...req.body };

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Check if name is being changed and if it conflicts
  if (updateData.name && updateData.name !== category.name) {
    const existingCategory = await Category.findOne({
      name: updateData.name.trim(),
      _id: { $ne: categoryId },
    });
    if (existingCategory) {
      throw new ApiError(400, "Category with this name already exists");
    }
  }

  // Validate parent category change
  if (
    updateData.parentCategory &&
    updateData.parentCategory !== category.parentCategory?.toString()
  ) {
    const parent = await Category.findById(updateData.parentCategory);
    if (!parent) {
      throw new ApiError(400, "Parent category not found");
    }

    // Check for circular reference
    const ancestors = await parent.getAncestors();
    if (ancestors.some((ancestor) => ancestor._id.toString() === categoryId)) {
      throw new ApiError(
        400,
        "Cannot set parent category - would create circular reference"
      );
    }
  }

  updateData.updatedBy = req.user._id;

  const updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Category updated successfully", updatedCategory)
    );
});

/**
 * Delete Category (Admin Only)
 * Deletes category and handles children
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { handleChildren = "move" } = req.body; // 'move' or 'delete'

  const category = await Category.findById(categoryId);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Check if category has children
  const children = await Category.find({ parentCategory: categoryId });

  if (children.length > 0) {
    if (handleChildren === "move") {
      // Move children to parent category
      await Category.updateMany(
        { parentCategory: categoryId },
        { $set: { parentCategory: category.parentCategory } }
      );
    } else if (handleChildren === "delete") {
      // Delete all children recursively
      for (const child of children) {
        await child.deleteOne();
      }
    }
  }

  await category.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, "Category deleted successfully", {
      deletedCategory: category.name,
      childrenHandled: children.length,
    })
  );
});

/**
 * Get Featured Categories (Public)
 * Returns featured categories for homepage
 */
const getFeaturedCategories = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const featuredCategories = await Category.getFeaturedCategories().limit(
    parseInt(limit)
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Featured categories retrieved successfully",
        featuredCategories
      )
    );
});

/**
 * Get Navigation Categories (Public)
 * Returns categories for navigation menu
 */
const getNavigationCategories = asyncHandler(async (req, res) => {
  const navigationCategories = await Category.getNavigationCategories();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Navigation categories retrieved successfully",
        navigationCategories
      )
    );
});

/**
 * Search Categories (Public)
 * Search categories by name or description
 */
const searchCategories = asyncHandler(async (req, res) => {
  const { q, limit = 20 } = req.query;

  if (!q?.trim()) {
    throw new ApiError(400, "Search query is required");
  }

  const searchRegex = new RegExp(q.trim(), "i");

  const categories = await Category.find({
    $or: [{ name: searchRegex }, { description: searchRegex }],
    isActive: true,
    isVisible: true,
  })
    .limit(parseInt(limit))
    .sort({ name: 1 })
    .select("name slug description image level productCount url");

  return res
    .status(200)
    .json(new ApiResponse(200, "Categories search completed", categories));
});

export {
  createCategory,
  getAllCategories,
  getCategoryTree,
  getCategoryDetails,
  updateCategory,
  deleteCategory,
  getFeaturedCategories,
  getNavigationCategories,
  searchCategories,
};
