import { Router } from "express";
import {
  registerVendor,
  getVendorProfile,
  updateVendorProfile,
  getAllVendors,
  getVendorById,
  updateVendorVerification,
  getVendorDashboard,
} from "../controllers/vendor.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  authorizeVendor,
  authorizeAdmin,
  requireActiveUser,
} from "../middlewares/rbac.middlewares.js";

const router = Router();

// Public routes
router.route("/register").post(
  upload.fields([
    { name: "businessLicense", maxCount: 1 },
    { name: "gstCertificate", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
    { name: "bankStatement", maxCount: 1 },
  ]),
  registerVendor
);

// Public vendor information (for customers)
router.route("/:vendorId/public").get(getVendorById);

// Protected vendor routes
router.use(verifyJWT, requireActiveUser); // Apply to all routes below

// Vendor-specific routes
router.route("/profile").get(authorizeVendor, getVendorProfile);
router.route("/profile").put(authorizeVendor, updateVendorProfile);
router.route("/dashboard").get(authorizeVendor, getVendorDashboard);

// Admin-only routes
router.route("/").get(authorizeAdmin, getAllVendors);
router.route("/:vendorId").get(authorizeAdmin, getVendorById);
router
  .route("/:vendorId/verification")
  .put(authorizeAdmin, updateVendorVerification);

export default router;
