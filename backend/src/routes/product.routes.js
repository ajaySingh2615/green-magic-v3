import { Router } from "express";
import {
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
} from "../controllers/product.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  authorizeVendor,
  requireActiveUser,
} from "../middlewares/rbac.middlewares.js";

const router = Router();

// Public routes
router.route("/search").get(searchProducts);
router.route("/featured").get(getFeaturedProducts);
router.route("/category/:categoryId").get(getProductsByCategory);
router.route("/:identifier").get(getProductDetails);

// Protected vendor routes
router.use(verifyJWT, requireActiveUser); // Apply to all routes below

// Vendor product management
router.route("/vendor/create").post(
  authorizeVendor,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 3 },
  ]),
  createProduct
);

router.route("/vendor/products").get(authorizeVendor, getVendorProducts);

router.route("/vendor/:productId").put(
  authorizeVendor,
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 3 },
  ]),
  updateProduct
);

router.route("/vendor/:productId").delete(authorizeVendor, deleteProduct);
router
  .route("/vendor/:productId/status")
  .put(authorizeVendor, updateProductStatus);
router
  .route("/vendor/:productId/inventory")
  .put(authorizeVendor, updateProductInventory);

export default router;
