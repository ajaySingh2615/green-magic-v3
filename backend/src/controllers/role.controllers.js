import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { Vendor } from "../models/vendor.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { rbacUtils } from "../middlewares/rbac.middlewares.js";

/**
 * Role Management Controller
 * Handles role-based operations and transitions
 */

/**
 * Get available roles for registration
 * Public endpoint to display role options
 */
const getAvailableRoles = asyncHandler(async (req, res) => {
  const roles = [
    {
      value: "customer",
      label: "Customer",
      description: "Browse and purchase products from vendors",
      permissions: [
        "Browse products",
        "Add items to cart",
        "Place orders",
        "Write reviews",
        "Manage personal profile",
      ],
    },
    {
      value: "vendor",
      label: "Vendor/Seller",
      description: "Sell products and manage your online store",
      permissions: [
        "Create and manage products",
        "Manage inventory",
        "Process orders",
        "View sales analytics",
        "Manage store profile",
      ],
      requirements: [
        "Valid business registration",
        "GST number (for Indian businesses)",
        "Bank account details",
        "Address verification",
      ],
    },
  ];

  return res
    .status(200)
    .json(
      new ApiResponse(200, roles, "Available user roles retrieved successfully")
    );
});

/**
 * Get current user's role information
 * Returns detailed role info for authenticated user
 */
const getCurrentUserRole = asyncHandler(async (req, res) => {
  const user = req.user;

  const roleInfo = {
    currentRole: user.role,
    isActive: user.isActive,
    permissions: getRolePermissions(user.role),
    canUpgrade: canUpgradeRole(user.role),
    registrationDate: user.createdAt,
    lastLogin: user.updatedAt,
  };

  // Add vendor-specific info if applicable
  if (user.role === "vendor" && user.vendorProfile) {
    try {
      const vendorProfile = await Vendor.findById(user.vendorProfile).select(
        "verificationStatus companyName storeSettings"
      );

      roleInfo.vendorInfo = {
        verificationStatus: vendorProfile?.verificationStatus || "pending",
        companyName: vendorProfile?.companyName,
        storeName: vendorProfile?.storeSettings?.storeName,
        storeSlug: vendorProfile?.storeSettings?.storeSlug,
      };
    } catch (error) {
      console.log("Error fetching vendor profile:", error);
    }
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "User role information retrieved successfully",
        roleInfo
      )
    );
});

/**
 * Request role upgrade (Customer to Vendor)
 * Initiates the vendor registration process
 */
const requestRoleUpgrade = asyncHandler(async (req, res) => {
  const user = req.user;

  if (user.role !== "customer") {
    throw new ApiError(400, "Role upgrade only available for customers");
  }

  if (user.vendorProfile) {
    throw new ApiError(400, "Vendor registration already in progress");
  }

  // Check if there's already a pending vendor application
  const existingVendor = await Vendor.findOne({ userId: user._id });
  if (existingVendor) {
    throw new ApiError(400, "Vendor application already exists");
  }

  return res.status(200).json(
    new ApiResponse(200, "Role upgrade available", {
      currentRole: user.role,
      targetRole: "vendor",
      nextSteps: [
        "Complete vendor registration form",
        "Upload required business documents",
        "Provide bank account details",
        "Wait for admin verification",
      ],
      redirectTo: "/api/v1/vendors/register",
    })
  );
});

/**
 * Get role-based dashboard configuration
 * Returns dashboard layout based on user role
 */
const getRoleDashboard = asyncHandler(async (req, res) => {
  const user = req.user;

  let dashboardConfig = {
    role: user.role,
    navigation: [],
    widgets: [],
    quickActions: [],
  };

  switch (user.role) {
    case "customer":
      dashboardConfig = {
        ...dashboardConfig,
        navigation: [
          { label: "Browse Products", path: "/products", icon: "shopping" },
          { label: "My Orders", path: "/orders", icon: "package" },
          { label: "Wishlist", path: "/wishlist", icon: "heart" },
          { label: "Addresses", path: "/addresses", icon: "location" },
          { label: "Profile", path: "/profile", icon: "user" },
        ],
        widgets: [
          { type: "recent-orders", title: "Recent Orders" },
          { type: "wishlist-items", title: "Wishlist Items" },
          { type: "recommendations", title: "Recommended for You" },
        ],
        quickActions: [
          { label: "Browse Products", action: "browse", icon: "search" },
          { label: "Track Order", action: "track", icon: "package" },
          { label: "Become a Vendor", action: "upgrade", icon: "store" },
        ],
      };
      break;

    case "vendor":
      dashboardConfig = {
        ...dashboardConfig,
        navigation: [
          { label: "Dashboard", path: "/vendor/dashboard", icon: "dashboard" },
          { label: "Products", path: "/vendor/products", icon: "package" },
          { label: "Orders", path: "/vendor/orders", icon: "receipt" },
          { label: "Analytics", path: "/vendor/analytics", icon: "chart" },
          {
            label: "Store Settings",
            path: "/vendor/settings",
            icon: "settings",
          },
        ],
        widgets: [
          { type: "sales-overview", title: "Sales Overview" },
          { type: "recent-orders", title: "Recent Orders" },
          { type: "product-performance", title: "Top Products" },
          { type: "store-analytics", title: "Store Analytics" },
        ],
        quickActions: [
          { label: "Add Product", action: "add-product", icon: "plus" },
          { label: "View Orders", action: "orders", icon: "receipt" },
          { label: "Store Analytics", action: "analytics", icon: "chart" },
        ],
      };
      break;

    case "admin":
      dashboardConfig = {
        ...dashboardConfig,
        navigation: [
          { label: "Dashboard", path: "/admin/dashboard", icon: "dashboard" },
          { label: "Users", path: "/admin/users", icon: "users" },
          { label: "Vendors", path: "/admin/vendors", icon: "store" },
          { label: "Products", path: "/admin/products", icon: "package" },
          { label: "Categories", path: "/admin/categories", icon: "folder" },
          { label: "Orders", path: "/admin/orders", icon: "receipt" },
          { label: "Analytics", path: "/admin/analytics", icon: "chart" },
          { label: "Settings", path: "/admin/settings", icon: "settings" },
        ],
        widgets: [
          { type: "platform-overview", title: "Platform Overview" },
          { type: "pending-verifications", title: "Pending Verifications" },
          { type: "recent-activities", title: "Recent Activities" },
          { type: "system-health", title: "System Health" },
        ],
        quickActions: [
          { label: "Verify Vendors", action: "verify-vendors", icon: "check" },
          { label: "Moderate Products", action: "moderate", icon: "shield" },
          { label: "System Reports", action: "reports", icon: "document" },
        ],
      };
      break;

    default:
      throw new ApiError(400, "Invalid user role");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Dashboard configuration retrieved successfully",
        dashboardConfig
      )
    );
});

/**
 * Check role permissions
 * Utility endpoint to check if user has specific permissions
 */
const checkPermissions = asyncHandler(async (req, res) => {
  const { action, resource } = req.query;
  const user = req.user;

  if (!action) {
    throw new ApiError(400, "Action parameter is required");
  }

  const hasPermission = checkUserPermission(user, action, resource);

  return res.status(200).json(
    new ApiResponse(200, "Permission check completed", {
      user: {
        id: user._id,
        role: user.role,
        isActive: user.isActive,
      },
      permission: {
        action,
        resource,
        granted: hasPermission,
      },
    })
  );
});

// Helper Functions

/**
 * Get permissions for a specific role
 * @param {string} role - User role
 * @returns {string[]} - Array of permissions
 */
function getRolePermissions(role) {
  const permissions = {
    customer: [
      "products:read",
      "cart:manage",
      "orders:create",
      "orders:read:own",
      "reviews:create",
      "profile:manage:own",
    ],
    vendor: [
      "products:create",
      "products:manage:own",
      "orders:read:own",
      "analytics:read:own",
      "store:manage:own",
      "inventory:manage:own",
    ],
    admin: [
      "users:manage",
      "vendors:manage",
      "products:manage:all",
      "categories:manage",
      "orders:manage:all",
      "analytics:read:all",
      "system:manage",
    ],
  };

  return permissions[role] || [];
}

/**
 * Check if role can be upgraded
 * @param {string} currentRole - Current user role
 * @returns {boolean}
 */
function canUpgradeRole(currentRole) {
  const upgradeMap = {
    customer: true, // Can upgrade to vendor
    vendor: false, // Cannot upgrade further
    admin: false, // Cannot upgrade further
  };

  return upgradeMap[currentRole] || false;
}

/**
 * Check if user has specific permission
 * @param {Object} user - User object
 * @param {string} action - Action to check
 * @param {string} resource - Resource to check
 * @returns {boolean}
 */
function checkUserPermission(user, action, resource) {
  if (!user || !user.isActive) return false;

  const userPermissions = getRolePermissions(user.role);

  // Check for exact permission match
  const exactPermission = resource ? `${resource}:${action}` : action;
  if (userPermissions.includes(exactPermission)) return true;

  // Check for wildcard permissions
  const wildcardPermission = resource ? `${resource}:*` : `${action}:*`;
  if (userPermissions.includes(wildcardPermission)) return true;

  // Admin can do everything
  if (user.role === "admin") return true;

  return false;
}

export {
  getAvailableRoles,
  getCurrentUserRole,
  requestRoleUpgrade,
  getRoleDashboard,
  checkPermissions,
};
