import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    // References
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

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
      maxlength: 60,
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 160,
    },
    metaKeywords: [
      {
        type: String,
        trim: true,
      },
    ],

    // Pricing
    pricing: {
      originalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      salePrice: {
        type: Number,
        min: 0,
        validate: {
          validator: function (v) {
            return !v || v <= this.pricing.originalPrice;
          },
          message: "Sale price cannot be greater than original price",
        },
      },
      discountPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      currency: {
        type: String,
        default: "INR",
        enum: ["INR", "USD", "EUR"],
      },
      taxRate: {
        type: Number,
        min: 0,
        max: 100,
        default: 18, // 18% GST in India
      },
    },

    // Inventory Management
    inventory: {
      sku: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true,
      },
      stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },
      lowStockThreshold: {
        type: Number,
        default: 10,
        min: 0,
      },
      trackInventory: {
        type: Boolean,
        default: true,
      },
      allowBackorder: {
        type: Boolean,
        default: false,
      },
      weight: {
        value: {
          type: Number,
          min: 0,
        },
        unit: {
          type: String,
          enum: ["kg", "g", "lb", "oz"],
          default: "kg",
        },
      },
      dimensions: {
        length: Number,
        width: Number,
        height: Number,
        unit: {
          type: String,
          enum: ["cm", "inch", "m"],
          default: "cm",
        },
      },
    },

    // Images and Media
    images: [
      {
        url: {
          type: String,
          required: true, // Cloudinary URL
        },
        altText: {
          type: String,
          trim: true,
        },
        isPrimary: {
          type: Boolean,
          default: false,
        },
        order: {
          type: Number,
          default: 0,
        },
      },
    ],
    videos: [
      {
        url: {
          type: String, // Cloudinary or YouTube URL
        },
        title: {
          type: String,
          trim: true,
        },
        thumbnail: {
          type: String, // Cloudinary URL
        },
      },
    ],

    // Product Variants (for size, color, etc.)
    variants: [
      {
        name: {
          type: String,
          required: true,
          trim: true, // e.g., "Size", "Color"
        },
        values: [
          {
            label: {
              type: String,
              required: true,
              trim: true, // e.g., "Large", "Red"
            },
            value: {
              type: String,
              required: true,
              trim: true, // e.g., "L", "#FF0000"
            },
            priceAdjustment: {
              type: Number,
              default: 0, // Additional cost for this variant
            },
            stock: {
              type: Number,
              default: 0,
            },
            sku: {
              type: String,
              trim: true,
            },
          },
        ],
      },
    ],

    // Product Attributes
    attributes: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        value: {
          type: String,
          required: true,
          trim: true,
        },
        isFilterable: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Shipping Information
    shipping: {
      isFreeShipping: {
        type: Boolean,
        default: false,
      },
      shippingCharges: {
        type: Number,
        min: 0,
        default: 0,
      },
      estimatedDelivery: {
        min: {
          type: Number,
          default: 3, // minimum days
        },
        max: {
          type: Number,
          default: 7, // maximum days
        },
      },
      shippingClass: {
        type: String,
        enum: ["standard", "express", "overnight", "bulky"],
        default: "standard",
      },
    },

    // Status and Visibility
    status: {
      type: String,
      enum: ["draft", "active", "inactive", "archived", "out_of_stock"],
      default: "draft",
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isDigital: {
      type: Boolean,
      default: false,
    },

    // SEO and Marketing
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    brand: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    warranty: {
      period: {
        type: Number, // in months
        min: 0,
      },
      description: {
        type: String,
        trim: true,
      },
    },

    // Reviews and Ratings
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
      breakdown: {
        five: { type: Number, default: 0 },
        four: { type: Number, default: 0 },
        three: { type: Number, default: 0 },
        two: { type: Number, default: 0 },
        one: { type: Number, default: 0 },
      },
    },

    // Sales Analytics
    analytics: {
      views: {
        type: Number,
        default: 0,
      },
      totalSales: {
        type: Number,
        default: 0,
      },
      totalRevenue: {
        type: Number,
        default: 0,
      },
      conversionRate: {
        type: Number,
        default: 0,
      },
      lastSaleDate: {
        type: Date,
      },
    },

    // Admin Information
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin who approved the product
    },
    approvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance optimization
productSchema.index({ vendor: 1, status: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ status: 1, isVisible: 1 });
productSchema.index({ isFeatured: 1, status: 1 });
productSchema.index({ "pricing.salePrice": 1 });
productSchema.index({ "ratings.average": -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ brand: 1, status: 1 });
productSchema.index({ tags: 1 });

// Text index for search
productSchema.index({
  name: "text",
  description: "text",
  shortDescription: "text",
  brand: "text",
  tags: "text",
});

// Compound indexes
productSchema.index({ vendor: 1, status: 1, createdAt: -1 });
productSchema.index({ category: 1, "pricing.salePrice": 1 });
productSchema.index({ status: 1, isFeatured: 1, "ratings.average": -1 });

// Virtual for effective price
productSchema.virtual("effectivePrice").get(function () {
  return this.pricing.salePrice || this.pricing.originalPrice;
});

// Virtual for discount amount
productSchema.virtual("discountAmount").get(function () {
  if (
    this.pricing.salePrice &&
    this.pricing.salePrice < this.pricing.originalPrice
  ) {
    return this.pricing.originalPrice - this.pricing.salePrice;
  }
  return 0;
});

// Virtual for primary image
productSchema.virtual("primaryImage").get(function () {
  if (this.images && this.images.length > 0) {
    const primary = this.images.find((img) => img.isPrimary);
    return primary || this.images[0];
  }
  return null;
});

// Virtual for availability status
productSchema.virtual("availabilityStatus").get(function () {
  if (this.status !== "active" || !this.isVisible) return "unavailable";
  if (!this.inventory.trackInventory) return "available";
  if (this.inventory.stock > this.inventory.lowStockThreshold)
    return "available";
  if (this.inventory.stock > 0) return "low_stock";
  if (this.inventory.allowBackorder) return "backorder";
  return "out_of_stock";
});

// Virtual for product URL
productSchema.virtual("url").get(function () {
  return `/product/${this.slug}`;
});

// Pre-save middleware to generate slug and calculate discount
productSchema.pre("save", async function (next) {
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

    // Auto-generate SKU if not provided
    if (!this.inventory.sku && this.isNew) {
      const timestamp = Date.now().toString().slice(-6);
      const randomStr = Math.random()
        .toString(36)
        .substring(2, 5)
        .toUpperCase();
      this.inventory.sku = `PRD-${timestamp}-${randomStr}`;
    }

    // Calculate discount percentage
    if (this.pricing.salePrice && this.pricing.originalPrice) {
      this.pricing.discountPercentage = Math.round(
        ((this.pricing.originalPrice - this.pricing.salePrice) /
          this.pricing.originalPrice) *
          100
      );
    }

    // Set meta title if not provided
    if (!this.metaTitle) {
      this.metaTitle = this.name;
    }

    // Update status based on stock
    if (
      this.inventory.trackInventory &&
      this.inventory.stock === 0 &&
      !this.inventory.allowBackorder
    ) {
      this.status = "out_of_stock";
    }

    // Ensure only one primary image
    if (this.images && this.images.length > 0) {
      let hasPrimary = false;
      this.images.forEach((img, index) => {
        if (img.isPrimary && !hasPrimary) {
          hasPrimary = true;
        } else if (img.isPrimary && hasPrimary) {
          img.isPrimary = false;
        }
      });

      // If no primary image, set first as primary
      if (!hasPrimary) {
        this.images[0].isPrimary = true;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to update stock
productSchema.methods.updateStock = function (
  quantity,
  operation = "subtract"
) {
  if (operation === "subtract") {
    this.inventory.stock = Math.max(0, this.inventory.stock - quantity);
  } else if (operation === "add") {
    this.inventory.stock += quantity;
  }
  return this.save();
};

// Instance method to add review
productSchema.methods.addReview = function (rating) {
  this.ratings.breakdown[`${rating}_star`] =
    (this.ratings.breakdown[`${rating}_star`] || 0) + 1;
  this.ratings.count += 1;

  // Recalculate average
  const total =
    this.ratings.breakdown.five * 5 +
    this.ratings.breakdown.four * 4 +
    this.ratings.breakdown.three * 3 +
    this.ratings.breakdown.two * 2 +
    this.ratings.breakdown.one * 1;

  this.ratings.average = Number((total / this.ratings.count).toFixed(1));
  return this.save();
};

// Instance method to check if product is available
productSchema.methods.isAvailable = function (quantity = 1) {
  if (this.status !== "active" || !this.isVisible) return false;
  if (!this.inventory.trackInventory) return true;
  if (this.inventory.stock >= quantity) return true;
  if (this.inventory.allowBackorder) return true;
  return false;
};

// Static method to find featured products
productSchema.statics.findFeatured = function (limit = 10) {
  return this.find({
    isFeatured: true,
    status: "active",
    isVisible: true,
  })
    .populate("vendor", "companyName storeSettings.storeName")
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to find products by category
productSchema.statics.findByCategory = function (categoryId, options = {}) {
  const query = {
    category: categoryId,
    status: "active",
    isVisible: true,
  };

  return this.find(query)
    .populate("vendor", "companyName storeSettings.storeName")
    .populate("category", "name slug")
    .sort(options.sort || { createdAt: -1 })
    .limit(options.limit || 20)
    .skip(options.skip || 0);
};

// Static method for product search
productSchema.statics.search = function (searchTerm, options = {}) {
  return this.find({
    $text: { $search: searchTerm },
    status: "active",
    isVisible: true,
    ...options.filters,
  })
    .populate("vendor", "companyName storeSettings.storeName")
    .populate("category", "name slug")
    .sort({ score: { $meta: "textScore" } })
    .limit(options.limit || 20);
};

export const Product = mongoose.model("Product", productSchema);
