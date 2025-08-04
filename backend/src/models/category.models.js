import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Hierarchy Support
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    level: {
      type: Number,
      default: 0, // 0 = root category, 1 = sub-category, 2 = sub-sub-category
      min: 0,
      max: 3, // Maximum 4 levels deep
    },
    path: {
      type: String, // For efficient hierarchy queries
    },

    // SEO and URL
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 60, // SEO best practice
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160, // SEO best practice
    },
    metaKeywords: [
      {
        type: String,
        trim: true,
      },
    ],

    // Visual Elements
    image: {
      type: String, // Cloudinary URL
    },
    icon: {
      type: String, // Cloudinary URL or icon class name
    },
    color: {
      type: String, // Hex color code for theme
      validate: {
        validator: function (v) {
          if (!v) return true; // Optional field
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: "Please enter a valid hex color code",
      },
    },

    // Status and Settings
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: true, // Show in navigation/menu
    },

    // Display Settings
    displayOrder: {
      type: Number,
      default: 0,
    },
    showInNavigation: {
      type: Boolean,
      default: true,
    },
    showInFooter: {
      type: Boolean,
      default: false,
    },

    // Statistics
    productCount: {
      type: Number,
      default: 0,
    },
    totalProducts: {
      type: Number,
      default: 0, // Including subcategories
    },

    // Commission Settings (if different from global)
    commissionRate: {
      type: Number,
      min: 0,
      max: 50, // Maximum 50% commission
      default: null, // null means use global commission rate
    },

    // Category Attributes (for filtering)
    attributes: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        type: {
          type: String,
          enum: ["text", "number", "boolean", "select", "multiselect", "range"],
          default: "text",
        },
        options: [
          {
            label: String,
            value: String,
          },
        ],
        isRequired: {
          type: Boolean,
          default: false,
        },
        isFilterable: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Admin Information
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance optimization
categorySchema.index({ parentCategory: 1, isActive: 1 });
categorySchema.index({ level: 1, displayOrder: 1 });
categorySchema.index({ isActive: 1, isFeatured: 1 });
categorySchema.index({ path: 1 });
categorySchema.index({ showInNavigation: 1, displayOrder: 1 });

// Compound indexes
categorySchema.index({ parentCategory: 1, displayOrder: 1 });
categorySchema.index({ isActive: 1, isVisible: 1, displayOrder: 1 });

// Virtual for full category path string
categorySchema.virtual("fullPath").get(function () {
  return this.path ? this.path.replace(/,/g, " > ") : this.name;
});

// Virtual for checking if it's a root category
categorySchema.virtual("isRoot").get(function () {
  return this.level === 0 && !this.parentCategory;
});

// Virtual for URL
categorySchema.virtual("url").get(function () {
  return `/category/${this.slug}`;
});

// Pre-save middleware to generate slug and path
categorySchema.pre("save", async function (next) {
  try {
    // Generate slug from name if not provided or name changed
    if (this.isModified("name") || !this.slug) {
      let baseSlug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      // Ensure slug uniqueness
      let slug = baseSlug;
      let counter = 1;

      while (
        await this.constructor.findOne({
          slug: slug,
          _id: { $ne: this._id },
        })
      ) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      this.slug = slug;
    }

    // Update meta title if not provided
    if (!this.metaTitle) {
      this.metaTitle = this.name;
    }

    // Calculate level and path based on parent
    if (this.parentCategory) {
      const parent = await this.constructor.findById(this.parentCategory);
      if (parent) {
        this.level = parent.level + 1;
        this.path = parent.path
          ? `${parent.path},${this.name}`
          : `${parent.name},${this.name}`;
      }
    } else {
      this.level = 0;
      this.path = this.name;
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Pre-remove middleware to handle cascading deletes
categorySchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    try {
      // Find all subcategories
      const subcategories = await this.constructor.find({
        parentCategory: this._id,
      });

      // Delete all subcategories
      for (const subcategory of subcategories) {
        await subcategory.deleteOne();
      }

      // TODO: Handle products in this category
      // Either move to parent category or mark as uncategorized

      next();
    } catch (error) {
      next(error);
    }
  }
);

// Instance method to get all ancestors
categorySchema.methods.getAncestors = async function () {
  const ancestors = [];
  let current = this;

  while (current.parentCategory) {
    current = await this.constructor.findById(current.parentCategory);
    if (current) {
      ancestors.unshift(current);
    } else {
      break;
    }
  }

  return ancestors;
};

// Instance method to get all descendants
categorySchema.methods.getDescendants = async function () {
  const descendants = [];

  const findChildren = async (categoryId) => {
    const children = await this.constructor.find({
      parentCategory: categoryId,
    });
    for (const child of children) {
      descendants.push(child);
      await findChildren(child._id);
    }
  };

  await findChildren(this._id);
  return descendants;
};

// Instance method to get immediate children
categorySchema.methods.getChildren = function () {
  return this.constructor
    .find({
      parentCategory: this._id,
      isActive: true,
    })
    .sort({ displayOrder: 1, name: 1 });
};

// Instance method to get siblings
categorySchema.methods.getSiblings = function () {
  return this.constructor
    .find({
      parentCategory: this.parentCategory,
      _id: { $ne: this._id },
      isActive: true,
    })
    .sort({ displayOrder: 1, name: 1 });
};

// Static method to get category tree
categorySchema.statics.getCategoryTree = function (parentId = null) {
  return this.find({
    parentCategory: parentId,
    isActive: true,
  }).sort({ displayOrder: 1, name: 1 });
};

// Static method to get featured categories
categorySchema.statics.getFeaturedCategories = function () {
  return this.find({
    isFeatured: true,
    isActive: true,
    isVisible: true,
  }).sort({ displayOrder: 1, name: 1 });
};

// Static method to get navigation categories
categorySchema.statics.getNavigationCategories = function () {
  return this.find({
    showInNavigation: true,
    isActive: true,
    isVisible: true,
  }).sort({ displayOrder: 1, name: 1 });
};

// Static method to build breadcrumb
categorySchema.statics.buildBreadcrumb = async function (categoryId) {
  const category = await this.findById(categoryId);
  if (!category) return [];

  const breadcrumb = [];
  let current = category;

  while (current) {
    breadcrumb.unshift({
      _id: current._id,
      name: current.name,
      slug: current.slug,
      url: current.url,
    });

    if (current.parentCategory) {
      current = await this.findById(current.parentCategory);
    } else {
      break;
    }
  }

  return breadcrumb;
};

export const Category = mongoose.model("Category", categorySchema);
