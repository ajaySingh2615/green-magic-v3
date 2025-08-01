import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: function () {
        return !this.googleId;
      }, // Required only if not Google user
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: false,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      }, // Required only if not Google user
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, //Allows multiple null values
    },
    refreshToken: {
      type: String,
    },
    // New e-commerce fields
    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    vendorProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      sparse: true, // Allows null values for non-vendor users
    },
    addresses: [
      {
        type: {
          type: String,
          enum: ["home", "office", "other"],
          default: "home",
        },
        fullName: {
          type: String,
          required: true,
          trim: true,
        },
        phone: {
          type: String,
          required: true,
          trim: true,
        },
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
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  // short lived access token
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      fullname: this.fullname,
      role: this.role, // Include role in JWT token
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
  );
};

userSchema.methods.generateRefreshToken = function () {
  // long lived access token
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
  );
};

// Add indexes for better query performance
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export const User = mongoose.model("User", userSchema);
