import { ApiError } from "../utils/ApiError.js";

/**
 * Enhanced Role-Based Access Control Middleware
 * Provides comprehensive authorization functions for different user roles
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

/**
 * Enhanced Features: Conditional Authorization
 * Allows different roles based on conditions
 */

/**
 * Allow vendors to access their own resources or admins to access any
 * @param {string} resourceField - Field containing resource owner ID
 * @returns {Function} Express middleware function
 */
export const authorizeOwnerOrAdmin = (resourceField = "userId") => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Authentication required"));
    }

    // Admin can access everything
    if (req.user.role === "admin") {
      return next();
    }

    // Check if user owns the resource
    const resourceOwnerId =
      req.params[resourceField] || req.body[resourceField];
    if (resourceOwnerId && resourceOwnerId === req.user._id.toString()) {
      return next();
    }

    return res
      .status(403)
      .json(new ApiError(403, "Access denied to this resource"));
  };
};

/**
 * Check multiple permissions with OR logic
 * @param {Function[]} permissions - Array of permission functions
 * @returns {Function} Express middleware function
 */
export const anyPermission = (permissions = []) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Authentication required"));
    }

    let hasPermission = false;

    for (const permission of permissions) {
      const mockRes = {
        status: () => mockRes,
        json: () => mockRes,
        statusCode: 200,
      };

      const mockNext = () => {
        hasPermission = true;
      };

      try {
        await permission(req, mockRes, mockNext);
        if (hasPermission) break;
      } catch (error) {
        // Continue to next permission
      }
    }

    if (!hasPermission) {
      return res
        .status(403)
        .json(new ApiError(403, "Insufficient permissions"));
    }

    next();
  };
};

/**
 * Audit logging for access attempts
 * @param {string} resource - Resource being accessed
 * @returns {Function} Express middleware function
 */
export const auditAccess = (resource) => {
  return (req, res, next) => {
    const logData = {
      timestamp: new Date().toISOString(),
      user: req.user
        ? {
            id: req.user._id,
            email: req.user.email,
            role: req.user.role,
          }
        : null,
      resource,
      method: req.method,
      path: req.path,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get("User-Agent"),
    };

    // Log to console (in production, use proper logging service)
    console.log(`[RBAC AUDIT] ${JSON.stringify(logData)}`);

    next();
  };
};

/**
 * Rate limiting by role
 * @param {Object} limits - Rate limits per role
 * @returns {Function} Express middleware function
 */
export const rateLimitByRole = (limits = {}) => {
  const attempts = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Authentication required"));
    }

    const userRole = req.user.role;
    const limit = limits[userRole] || limits.default || 100;
    const windowMs = 60 * 1000; // 1 minute window

    const userId = req.user._id.toString();
    const now = Date.now();

    if (!attempts.has(userId)) {
      attempts.set(userId, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const userAttempts = attempts.get(userId);

    if (now > userAttempts.resetTime) {
      // Reset the window
      userAttempts.count = 1;
      userAttempts.resetTime = now + windowMs;
      return next();
    }

    if (userAttempts.count >= limit) {
      return res
        .status(429)
        .json(
          new ApiError(429, "Rate limit exceeded. Please try again later.")
        );
    }

    userAttempts.count++;
    next();
  };
};

/**
 * RBAC Utils for external use
 */
export const rbacUtils = {
  /**
   * Check if user has role programmatically
   * @param {Object} user - User object
   * @param {string|string[]} roles - Role(s) to check
   * @returns {boolean}
   */
  userHasRole: (user, roles) => {
    if (!user || !user.role) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  },

  /**
   * Check if user is active
   * @param {Object} user - User object
   * @returns {boolean}
   */
  userIsActive: (user) => {
    return user && user.isActive === true;
  },

  /**
   * Get role hierarchy level
   * @param {string} role - User role
   * @returns {number} - Higher number = more permissions
   */
  getRoleLevel: (role) => {
    const hierarchy = {
      customer: 1,
      vendor: 2,
      admin: 3,
    };
    return hierarchy[role] || 0;
  },

  /**
   * Check if user can access role level
   * @param {Object} user - User object
   * @param {string} requiredRole - Required role
   * @returns {boolean}
   */
  canAccessRole: (user, requiredRole) => {
    if (!user) return false;
    return (
      rbacUtils.getRoleLevel(user.role) >= rbacUtils.getRoleLevel(requiredRole)
    );
  },
};
