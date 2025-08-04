import { Router } from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryTree,
  getCategoryDetails,
  updateCategory,
  deleteCategory,
  getFeaturedCategories,
  getNavigationCategories,
  searchCategories,
} from "../controllers/category.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  authorizeAdmin,
  requireActiveUser,
} from "../middlewares/rbac.middlewares.js";

const router = Router();

// Public routes
router.route("/").get(getAllCategories);
router.route("/tree").get(getCategoryTree);
router.route("/featured").get(getFeaturedCategories);
router.route("/navigation").get(getNavigationCategories);
router.route("/search").get(searchCategories);
router.route("/:identifier").get(getCategoryDetails);

// Protected admin routes
router.use(verifyJWT, requireActiveUser, authorizeAdmin); // Apply to all routes below

router.route("/admin/create").post(
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  createCategory
);

router.route("/admin/:categoryId").put(
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  updateCategory
);

router.route("/admin/:categoryId").delete(deleteCategory);

export default router;
