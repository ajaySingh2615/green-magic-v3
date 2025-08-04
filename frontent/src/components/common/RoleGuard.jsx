import { useAuth } from "../../context/AuthContext";
import { userHasRole, userIsActive } from "../../utils/roleUtils";

/**
 * RoleGuard Component
 * Conditionally renders children based on user role and permissions
 */

const RoleGuard = ({ 
  children, 
  roles = [], 
  requireAuth = true,
  requireActive = true,
  fallback = null,
  permissionCheck = null 
}) => {
  const { isAuthenticated, user } = useAuth();

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return fallback;
  }

  // Check if user is active (if required)
  if (requireActive && !userIsActive(user)) {
    return fallback;
  }

  // Check role permissions
  if (roles.length > 0 && !userHasRole(user, roles)) {
    return fallback;
  }

  // Check custom permission function
  if (permissionCheck && typeof permissionCheck === "function" && !permissionCheck(user)) {
    return fallback;
  }

  return children;
};

/**
 * Pre-configured role guards for common use cases
 */

export const CustomerOnly = ({ children, fallback = null }) => (
  <RoleGuard roles={["customer"]} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const VendorOnly = ({ children, fallback = null }) => (
  <RoleGuard roles={["vendor"]} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const AdminOnly = ({ children, fallback = null }) => (
  <RoleGuard roles={["admin"]} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const VendorOrAdmin = ({ children, fallback = null }) => (
  <RoleGuard roles={["vendor", "admin"]} fallback={fallback}>
    {children}
  </RoleGuard>
);

export const AuthenticatedOnly = ({ children, fallback = null }) => (
  <RoleGuard roles={[]} requireAuth={true} fallback={fallback}>
    {children}
  </RoleGuard>
);

export default RoleGuard;