import { Router } from "express";
import {
  getAvailableRoles,
  getCurrentUserRole,
  requestRoleUpgrade,
  getRoleDashboard,
  checkPermissions,
} from "../controllers/role.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {
  requireActiveUser,
  authorizeCustomer,
  auditAccess,
} from "../middlewares/rbac.middlewares.js";

const router = Router();

/**
 * Role Management Routes
 * Handles role-based operations and information
 */

// Public Routes
router
  .route("/available")
  .get(auditAccess("roles:available"), getAvailableRoles);

// Protected Routes - Require Authentication
router.use(verifyJWT, requireActiveUser);

// Get current user's role information
router.route("/current").get(auditAccess("roles:current"), getCurrentUserRole);

// Get role-based dashboard configuration
router
  .route("/dashboard")
  .get(auditAccess("roles:dashboard"), getRoleDashboard);

// Check user permissions
router
  .route("/permissions")
  .get(auditAccess("roles:permissions"), checkPermissions);

// Request role upgrade (Customer to Vendor)
router
  .route("/upgrade")
  .post(auditAccess("roles:upgrade"), authorizeCustomer, requestRoleUpgrade);

export default router;
