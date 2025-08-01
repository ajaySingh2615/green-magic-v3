import { ApiError } from "../utils/ApiError.js";

/**
 * Role-Based Access Control Middleware
 * Provides authorization functions for different user roles
 */

/**
 * Generic authorization middleware
 * @param {string[]} roles - Array of allowed roles
 * @returns {Function} Express middleware function
 */
export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Authentication required"));
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res
        .status(403)
        .json(new ApiError(403, "Insufficient permissions"));
    }

    next();
  };
};

/**
 * Customer authorization middleware
 * Allows customers, vendors, and admins
 */
export const authorizeCustomer = authorize(["customer", "vendor", "admin"]);

/**
 * Vendor authorization middleware
 * Allows vendors and admins
 */
export const authorizeVendor = authorize(["vendor", "admin"]);

/**
 * Admin authorization middleware
 * Allows only admins
 */
export const authorizeAdmin = authorize(["admin"]);

/**
 * Vendor ownership middleware
 * Ensures vendor can only access their own resources
 * @param {string} resourceField - Field name containing vendor ID in request
 * @returns {Function} Express middleware function
 */
export const authorizeVendorOwn = (resourceField = "vendorId") => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Authentication required"));
    }

    // Admins can access all resources
    if (req.user.role === "admin") {
      return next();
    }

    // Vendors can only access their own resources
    if (req.user.role === "vendor") {
      const resourceVendorId =
        req.params[resourceField] || req.body[resourceField];

      if (
        resourceVendorId &&
        resourceVendorId !== req.user.vendorProfile?.toString()
      ) {
        return res
          .status(403)
          .json(new ApiError(403, "Access denied to this resource"));
      }
    }

    next();
  };
};

/**
 * Check if user has specific role
 * @param {string} role - Role to check
 * @returns {Function} Express middleware function
 */
export const hasRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Authentication required"));
    }

    if (req.user.role !== role) {
      return res.status(403).json(new ApiError(403, `Role '${role}' required`));
    }

    next();
  };
};

/**
 * Check if user is active
 * @returns {Function} Express middleware function
 */
export const requireActiveUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json(new ApiError(401, "Authentication required"));
  }

  if (!req.user.isActive) {
    return res.status(403).json(new ApiError(403, "Account is deactivated"));
  }

  next();
};
