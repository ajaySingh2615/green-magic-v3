import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
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

    // TODO: Create Vendor profile with business details
    // This will be implemented when we create the Vendor model
    // const vendorProfile = await Vendor.create({
    //   userId: vendorUser._id,
    //   companyName,
    //   gstNumber,
    //   businessAddress,
    //   contactInfo,
    //   businessDescription,
    //   verificationStatus: 'pending'
    // });

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

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Vendor profile retrieved successfully", vendor)
    );
});

/**
 * Update Vendor Profile
 * Updates vendor business information
 */
const updateVendorProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { companyName, businessAddress, contactInfo, businessDescription } =
    req.body;

  const vendor = await User.findById(userId);

  if (!vendor) {
    throw new ApiError(404, "Vendor not found");
  }

  if (vendor.role !== "vendor") {
    throw new ApiError(403, "Access denied. Vendor account required.");
  }

  // TODO: Update Vendor profile when Vendor model is created
  // const updatedVendor = await Vendor.findOneAndUpdate(
  //   { userId },
  //   {
  //     $set: {
  //       companyName,
  //       businessAddress,
  //       contactInfo,
  //       businessDescription
  //     }
  //   },
  //   { new: true }
  // );

  return res.status(200).json(
    new ApiResponse(200, "Vendor profile updated successfully", {
      message:
        "Profile update functionality will be implemented with Vendor model",
    })
  );
});

export { registerVendor, getVendorProfile, updateVendorProfile };
