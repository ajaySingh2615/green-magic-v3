import mongoose, { Schema } from "mongoose";

const vendorSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Business Information
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    businessDescription: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    businessType: {
      type: String,
      enum: [
        "individual",
        "proprietorship",
        "partnership",
        "private_limited",
        "public_limited",
        "llp",
      ],
      default: "individual",
    },

    // Legal Information
    gstNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      validate: {
        validator: function (v) {
          // Basic GST number validation (15 characters)
          return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
            v
          );
        },
        message: "Please enter a valid GST number",
      },
    },
    panNumber: {
      type: String,
      trim: true,
      uppercase: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // Optional field
          return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
        },
        message: "Please enter a valid PAN number",
      },
    },

    // Business Address
    businessAddress: {
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },
      zipCode: {
        type: String,
        required: true,
        trim: true,
      },
      country: {
        type: String,
        default: "India",
        trim: true,
      },
    },

    // Contact Information
    contactInfo: {
      phone: {
        type: String,
        required: true,
        trim: true,
        validate: {
          validator: function (v) {
            return /^[6-9]\d{9}$/.test(v); // Indian mobile number validation
          },
          message: "Please enter a valid phone number",
        },
      },
      alternatePhone: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            if (!v) return true; // Optional field
            return /^[6-9]\d{9}$/.test(v);
          },
          message: "Please enter a valid alternate phone number",
        },
      },
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        validate: {
          validator: function (v) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
          },
          message: "Please enter a valid email address",
        },
      },
      website: {
        type: String,
        trim: true,
        validate: {
          validator: function (v) {
            if (!v) return true; // Optional field
            return /^https?:\/\/.+\..+/.test(v);
          },
          message: "Please enter a valid website URL",
        },
      },
    },

    // Bank Details (for payments)
    bankDetails: {
      bankName: {
        type: String,
        trim: true,
      },
      accountNumber: {
        type: String,
        trim: true,
      },
      ifscCode: {
        type: String,
        trim: true,
        uppercase: true,
        validate: {
          validator: function (v) {
            if (!v) return true; // Optional field
            return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v);
          },
          message: "Please enter a valid IFSC code",
        },
      },
      accountHolderName: {
        type: String,
        trim: true,
      },
    },

    // Verification Status
    verificationStatus: {
      type: String,
      enum: ["pending", "in_review", "approved", "rejected", "suspended"],
      default: "pending",
    },
    verificationDate: {
      type: Date,
    },
    verificationNotes: {
      type: String,
      trim: true,
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin who verified
    },

    // Business Documents (Cloudinary URLs)
    documents: {
      businessLicense: {
        type: String, // Cloudinary URL
      },
      gstCertificate: {
        type: String, // Cloudinary URL
      },
      addressProof: {
        type: String, // Cloudinary URL
      },
      panCard: {
        type: String, // Cloudinary URL
      },
      bankStatement: {
        type: String, // Cloudinary URL
      },
    },

    // Business Metrics
    totalProducts: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    rating: {
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
    },

    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Store Settings
    storeSettings: {
      storeName: {
        type: String,
        trim: true,
      },
      storeDescription: {
        type: String,
        trim: true,
        maxlength: 500,
      },
      storeLogo: {
        type: String, // Cloudinary URL
      },
      storeBanner: {
        type: String, // Cloudinary URL
      },
      storeSlug: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        sparse: true, // Allows null values
      },
    },

    // Shipping Information
    shippingInfo: {
      freeShippingThreshold: {
        type: Number,
        default: 500, // Free shipping above ₹500
      },
      shippingCharges: {
        type: Number,
        default: 50, // ₹50 shipping
      },
      codAvailable: {
        type: Boolean,
        default: true,
      },
      returnPolicy: {
        type: String,
        trim: true,
        default: "7 days return policy",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance optimization
vendorSchema.index({ userId: 1 });
vendorSchema.index({ verificationStatus: 1, isActive: 1 });
vendorSchema.index({ gstNumber: 1 });
vendorSchema.index({ "storeSettings.storeSlug": 1 });
vendorSchema.index({ "contactInfo.email": 1 });
vendorSchema.index({ createdAt: -1 });

// Compound indexes
vendorSchema.index({ verificationStatus: 1, createdAt: -1 });
vendorSchema.index({ isActive: 1, isFeatured: 1 });

// Virtual for store URL
vendorSchema.virtual("storeUrl").get(function () {
  if (this.storeSettings.storeSlug) {
    return `/store/${this.storeSettings.storeSlug}`;
  }
  return `/store/${this._id}`;
});

// Method to update business metrics
vendorSchema.methods.updateMetrics = function (orderData) {
  if (orderData.type === "new_order") {
    this.totalOrders += 1;
    this.totalRevenue += orderData.amount;
  }
  return this.save();
};

// Method to calculate commission
vendorSchema.methods.calculateCommission = function (orderAmount) {
  // 5% platform commission
  const commissionRate = 0.05;
  return orderAmount * commissionRate;
};

// Static method to find verified vendors
vendorSchema.statics.findVerified = function () {
  return this.find({
    verificationStatus: "approved",
    isActive: true,
  }).populate("userId", "fullname email username");
};

// Pre-save middleware to generate store slug
vendorSchema.pre("save", function (next) {
  if (
    this.isModified("storeSettings.storeName") &&
    this.storeSettings.storeName
  ) {
    // Generate slug from store name
    this.storeSettings.storeSlug = this.storeSettings.storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
  next();
});

export const Vendor = mongoose.model("Vendor", vendorSchema);
