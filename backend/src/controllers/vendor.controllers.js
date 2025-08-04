import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { Vendor } from "../models/vendor.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

/**
 * Vendor Registration Controller
 * Handles vendor registration with business details
 */

const registerVendor = asyncHandler(async (req, res) => {
  const {
    fullname,
    email,
    username,
    password,
    companyName,
    gstNumber,
    businessAddress,
    contactInfo,
    businessDescription,
  } = req.body;

  // Basic validation
  if (
    [fullname, email, username, password, companyName, gstNumber].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All required fields are mandatory");
  }

  // Validate business address
  if (
    !businessAddress ||
    !businessAddress.street ||
    !businessAddress.city ||
    !businessAddress.state ||
    !businessAddress.zipCode
  ) {
    throw new ApiError(400, "Complete business address is required");
  }

  // Validate contact info
  if (!contactInfo || !contactInfo.phone) {
    throw new ApiError(400, "Business phone number is required");
  }

  // Check if user already exists
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(400, "User already exists");
  }

  // Upload business documents (optional for now)
  // TODO: Add document upload logic for business license, GST certificate, etc.

  try {
    // Create vendor user
    const vendorUser = await User.create({
      fullname,
      email,
      username: username.toLowerCase(),
      password,
      role: "vendor", // Explicitly set as vendor
      addresses: [
        {
          type: "office",
          fullName: fullname,
          phone: contactInfo.phone,
          street: businessAddress.street,
          city: businessAddress.city,
          state: businessAddress.state,
          zipCode: businessAddress.zipCode,
          country: businessAddress.country || "India",
          isDefault: true,
        },
      ],
    });

    // Create Vendor profile with business details
    const vendorProfile = await Vendor.create({
      userId: vendorUser._id,
      companyName,
      gstNumber,
      businessAddress,
      contactInfo,
      businessDescription,
      verificationStatus: "pending",
    });

    // Update user with vendor profile reference
    vendorUser.vendorProfile = vendorProfile._id;
    await vendorUser.save({ validateBeforeSave: false });

    const createdVendor = await User.findById(vendorUser._id).select(
      "-password -refreshToken"
    );

    if (!createdVendor) {
      throw new ApiError(
        500,
        "Failed to create vendor while saving to database"
      );
    }

    return res.status(201).json(
      new ApiResponse(201, "Vendor registration submitted for review", {
        user: createdVendor,
        vendorProfile: {
          companyName: vendorProfile.companyName,
          verificationStatus: vendorProfile.verificationStatus,
          storeUrl: vendorProfile.storeUrl,
        },
        message:
          "Your vendor account has been created and is pending verification. You will be notified once approved.",
      })
    );
  } catch (error) {
    console.log("vendor creation error", error);
    throw new ApiError(500, "Failed to create vendor account");
  }
});

/**
 * Get Vendor Profile
 * Returns vendor profile with business details
 */
const getVendorProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const vendor = await User.findById(userId)
    .select("-password -refreshToken")
    .populate("vendorProfile");

  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  if (vendor.role !== "vendor") {
    throw new ApiError(403, "Access denied. Vendor account required.");
  }

  if (!vendor.vendorProfile) {
    throw new ApiError(
      404,
      "Vendor profile not found. Please complete vendor registration."
    );
  }

  return res.status(200).json(
    new ApiResponse(200, "Vendor profile retrieved successfully", {
      user: vendor,
      vendorProfile: vendor.vendorProfile,
    })
  );
});

/**
 * Update Vendor Profile
 * Updates vendor business information
 */
const updateVendorProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    companyName,
    businessAddress,
    contactInfo,
    businessDescription,
    storeSettings,
    bankDetails,
  } = req.body;

  const vendor = await User.findById(userId);

  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  if (vendor.role !== "vendor") {
    throw new ApiError(403, "Access denied. Vendor account required.");
  }

  // Update Vendor profile
  const updateData = {};
  if (companyName) updateData.companyName = companyName;
  if (businessAddress) updateData.businessAddress = businessAddress;
  if (contactInfo) updateData.contactInfo = contactInfo;
  if (businessDescription) updateData.businessDescription = businessDescription;
  if (storeSettings) updateData.storeSettings = storeSettings;
  if (bankDetails) updateData.bankDetails = bankDetails;
  updateData.updatedBy = userId;

  const updatedVendor = await Vendor.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!updatedVendor) {
    throw new ApiError(404, "Vendor profile not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Vendor profile updated successfully", updatedVendor)
    );
});

/**
 * Get All Vendors (Admin Only)
 * Returns paginated list of all vendors with filtering options
 */
const getAllVendors = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    verificationStatus,
    search,
  } = req.query;

  const filter = {};
  if (status) filter.isActive = status === "active";
  if (verificationStatus) filter.verificationStatus = verificationStatus;
  if (search) {
    filter.$or = [
      { companyName: { $regex: search, $options: "i" } },
      { "contactInfo.email": { $regex: search, $options: "i" } },
      { "storeSettings.storeName": { $regex: search, $options: "i" } },
    ];
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    populate: {
      path: "userId",
      select: "fullname email username isActive",
    },
  };

  const vendors = await Vendor.paginate(filter, options);

  return res
    .status(200)
    .json(new ApiResponse(200, "Vendors retrieved successfully", vendors));
});

/**
 * Get Vendor by ID (Admin/Public)
 * Returns specific vendor details
 */
const getVendorById = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;

  const vendor = await Vendor.findById(vendorId).populate(
    "userId",
    "fullname email username isActive"
  );

  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  // If user is not admin, return only public information
  if (req.user?.role !== "admin") {
    const publicVendor = {
      _id: vendor._id,
      companyName: vendor.companyName,
      businessDescription: vendor.businessDescription,
      storeSettings: vendor.storeSettings,
      rating: vendor.rating,
      totalProducts: vendor.totalProducts,
      verificationStatus: vendor.verificationStatus,
      createdAt: vendor.createdAt,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Vendor details retrieved successfully",
          publicVendor
        )
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Vendor details retrieved successfully", vendor)
    );
});

/**
 * Update Vendor Verification Status (Admin Only)
 * Approve, reject, or suspend vendors
 */
const updateVendorVerification = asyncHandler(async (req, res) => {
  const { vendorId } = req.params;
  const { verificationStatus, verificationNotes } = req.body;

  if (
    !["approved", "rejected", "suspended", "in_review"].includes(
      verificationStatus
    )
  ) {
    throw new ApiError(400, "Invalid verification status");
  }

  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  vendor.verificationStatus = verificationStatus;
  vendor.verificationDate = new Date();
  vendor.verificationNotes = verificationNotes || "";
  vendor.verifiedBy = req.user._id;

  await vendor.save();

  return res.status(200).json(
    new ApiResponse(200, "Vendor verification status updated successfully", {
      vendorId: vendor._id,
      companyName: vendor.companyName,
      verificationStatus: vendor.verificationStatus,
      verificationDate: vendor.verificationDate,
    })
  );
});

/**
 * Get Vendor Dashboard Stats (Vendor Only)
 * Returns vendor-specific analytics and metrics
 */
const getVendorDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const vendor = await Vendor.findOne({ userId });
  if (!vendor) {
    throw new ApiError(404, "Vendor profile not found");
  }

  // Get additional stats (these would come from other models in full implementation)
  const dashboardStats = {
    vendorInfo: {
      companyName: vendor.companyName,
      verificationStatus: vendor.verificationStatus,
      storeUrl: vendor.storeUrl,
      memberSince: vendor.createdAt,
    },
    metrics: {
      totalProducts: vendor.totalProducts,
      totalOrders: vendor.totalOrders,
      totalRevenue: vendor.totalRevenue,
      averageRating: vendor.rating.average,
      totalReviews: vendor.rating.count,
    },
    storeSettings: vendor.storeSettings,
    verificationStatus: vendor.verificationStatus,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Vendor dashboard retrieved successfully",
        dashboardStats
      )
    );
});

export {
  registerVendor,
  getVendorProfile,
  updateVendorProfile,
  getAllVendors,
  getVendorById,
  updateVendorVerification,
  getVendorDashboard,
};
