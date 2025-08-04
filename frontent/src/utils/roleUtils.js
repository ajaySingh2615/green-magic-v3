/**
 * Role-Based Utilities for Frontend
 * Provides helper functions for role checking and permissions
 */

// Role Hierarchy Levels
export const ROLE_LEVELS = {
  customer: 1,
  vendor: 2,
  admin: 3,
};

// Available Roles
export const ROLES = {
  CUSTOMER: "customer",
  VENDOR: "vendor",
  ADMIN: "admin",
};

/**
 * Check if user has specific role
 * @param {Object} user - User object
 * @param {string|string[]} roles - Role(s) to check
 * @returns {boolean}
 */
export const userHasRole = (user, roles) => {
  if (!user || !user.role) return false;
  const roleArray = Array.isArray(roles) ? roles : [roles];
  return roleArray.includes(user.role);
};

/**
 * Check if user is active
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const userIsActive = (user) => {
  return user && user.isActive === true;
};

/**
 * Get role hierarchy level
 * @param {string} role - User role
 * @returns {number} - Higher number = more permissions
 */
export const getRoleLevel = (role) => {
  return ROLE_LEVELS[role] || 0;
};

/**
 * Check if user can access role level
 * @param {Object} user - User object
 * @param {string} requiredRole - Required role
 * @returns {boolean}
 */
export const canAccessRole = (user, requiredRole) => {
  if (!user) return false;
  return getRoleLevel(user.role) >= getRoleLevel(requiredRole);
};

/**
 * Check if user is customer
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isCustomer = (user) => {
  return userHasRole(user, ROLES.CUSTOMER);
};

/**
 * Check if user is vendor
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isVendor = (user) => {
  return userHasRole(user, ROLES.VENDOR);
};

/**
 * Check if user is admin
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return userHasRole(user, ROLES.ADMIN);
};

/**
 * Check if user can upgrade role
 * @param {Object} user - User object
 * @returns {boolean}
 */
export const canUpgradeRole = (user) => {
  if (!user) return false;
  // Only customers can upgrade to vendor
  return user.role === ROLES.CUSTOMER;
};

/**
 * Get user display name with role
 * @param {Object} user - User object
 * @returns {string}
 */
export const getUserDisplayName = (user) => {
  if (!user) return "Guest";
  const name = user.fullname || user.username || "User";
  const roleCapitalized = user.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "";
  return roleCapitalized ? `${name} (${roleCapitalized})` : name;
};

/**
 * Get role badge color
 * @param {string} role - User role
 * @returns {string} - CSS classes for role badge
 */
export const getRoleBadgeColor = (role) => {
  const colors = {
    customer: "bg-blue-100 text-blue-800 border-blue-200",
    vendor: "bg-green-100 text-green-800 border-green-200",
    admin: "bg-purple-100 text-purple-800 border-purple-200",
  };
  return colors[role] || "bg-gray-100 text-gray-800 border-gray-200";
};

/**
 * Get role icon
 * @param {string} role - User role
 * @returns {string} - Icon name for the role
 */
export const getRoleIcon = (role) => {
  const icons = {
    customer: "user",
    vendor: "store",
    admin: "shield",
  };
  return icons[role] || "user";
};

/**
 * Get next possible role for upgrade
 * @param {string} currentRole - Current user role
 * @returns {string|null} - Next role or null if no upgrade available
 */
export const getUpgradeRole = (currentRole) => {
  const upgradeMap = {
    customer: ROLES.VENDOR,
    vendor: null, // Cannot upgrade further
    admin: null, // Cannot upgrade further
  };
  return upgradeMap[currentRole] || null;
};

/**
 * Get role-based navigation paths
 * @param {string} role - User role
 * @returns {Object} - Default navigation paths for the role
 */
export const getRoleNavigation = (role) => {
  const navigation = {
    customer: {
      dashboard: "/dashboard",
      products: "/products",
      orders: "/orders",
      wishlist: "/wishlist",
      profile: "/profile",
    },
    vendor: {
      dashboard: "/vendor/dashboard",
      products: "/vendor/products",
      orders: "/vendor/orders",
      analytics: "/vendor/analytics",
      settings: "/vendor/settings",
    },
    admin: {
      dashboard: "/admin/dashboard",
      users: "/admin/users",
      vendors: "/admin/vendors",
      products: "/admin/products",
      categories: "/admin/categories",
      orders: "/admin/orders",
      analytics: "/admin/analytics",
      settings: "/admin/settings",
    },
  };
  return navigation[role] || navigation.customer;
};

/**
 * Get default landing page for role
 * @param {string} role - User role
 * @returns {string} - Default landing page path
 */
export const getRoleLandingPage = (role) => {
  const landingPages = {
    customer: "/products",
    vendor: "/vendor/dashboard",
    admin: "/admin/dashboard",
  };
  return landingPages[role] || "/products";
};

/**
 * Permission checking utilities
 */
export const permissions = {
  // Product permissions
  canViewProducts: (user) => true, // Everyone can view products
  canCreateProducts: (user) => userHasRole(user, [ROLES.VENDOR, ROLES.ADMIN]),
  canEditProducts: (user) => userHasRole(user, [ROLES.VENDOR, ROLES.ADMIN]),
  canDeleteProducts: (user) => userHasRole(user, [ROLES.VENDOR, ROLES.ADMIN]),

  // Order permissions
  canViewOwnOrders: (user) => userIsActive(user),
  canViewAllOrders: (user) => userHasRole(user, ROLES.ADMIN),
  canProcessOrders: (user) => userHasRole(user, [ROLES.VENDOR, ROLES.ADMIN]),

  // User management permissions
  canManageUsers: (user) => userHasRole(user, ROLES.ADMIN),
  canVerifyVendors: (user) => userHasRole(user, ROLES.ADMIN),
  canAccessAdminPanel: (user) => userHasRole(user, ROLES.ADMIN),

  // Vendor permissions
  canAccessVendorPanel: (user) =>
    userHasRole(user, [ROLES.VENDOR, ROLES.ADMIN]),
  canManageStore: (user) => userHasRole(user, [ROLES.VENDOR, ROLES.ADMIN]),
  canViewAnalytics: (user) => userHasRole(user, [ROLES.VENDOR, ROLES.ADMIN]),

  // Category permissions
  canManageCategories: (user) => userHasRole(user, ROLES.ADMIN),

  // Profile permissions
  canEditOwnProfile: (user) => userIsActive(user),
  canEditAnyProfile: (user) => userHasRole(user, ROLES.ADMIN),
};

export default {
  ROLE_LEVELS,
  ROLES,
  userHasRole,
  userIsActive,
  getRoleLevel,
  canAccessRole,
  isCustomer,
  isVendor,
  isAdmin,
  canUpgradeRole,
  getUserDisplayName,
  getRoleBadgeColor,
  getRoleIcon,
  getUpgradeRole,
  getRoleNavigation,
  getRoleLandingPage,
  permissions,
};
