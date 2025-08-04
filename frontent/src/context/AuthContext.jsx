import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";
import {
  userHasRole,
  userIsActive,
  getRoleLandingPage,
  permissions,
} from "../utils/roleUtils";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [roleInfo, setRoleInfo] = useState(null);
  const [dashboardConfig, setDashboardConfig] = useState(null);
  const [availableRoles, setAvailableRoles] = useState([]);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const userData = await authService.getCurrentUser();
      if (userData) {
        setUser(userData);
        setUserRole(userData.role);
        setIsAuthenticated(true);

        // Fetch role-specific information
        await loadRoleInformation();

        // Mark that user is authenticated
        localStorage.setItem("wasAuthenticated", "true");
      }
    } catch (error) {
      // Only log the error if it's not a 401 (which is expected when not logged in)
      if (error?.response?.status !== 401) {
        console.error("Auth check failed:", error);
      }
      clearAuthState();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);

      if (response.success) {
        setUser(response.data.user);
        setUserRole(response.data.user.role);
        setIsAuthenticated(true);

        // Load role-specific information
        await loadRoleInformation();

        // Mark that user is now authenticated
        localStorage.setItem("wasAuthenticated", "true");
        toast.success(`Welcome back, ${response.data.user.fullname}!`);
        return {
          success: true,
          data: response.data,
          redirectTo: getRoleLandingPage(response.data.user.role),
        };
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);

      if (response.success) {
        toast.success("Registration successful! Please login to continue.");
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
      clearAuthState();
      toast.success("Logged out successfully!");
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout fails on server, clear local state
      clearAuthState();
      toast.error("Logout failed, but you have been logged out locally.");
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken();
      if (response.success) {
        return { success: true };
      } else {
        throw new Error("Token refresh failed");
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      clearAuthState();
      return { success: false, error: error.message };
    }
  };

  const googleLogin = async (accessToken) => {
    try {
      setIsLoading(true);
      const result = await authService.googleLogin(accessToken);

      if (result.success) {
        setUser(result.data.user);
        setUserRole(result.data.user.role);
        setIsAuthenticated(true);

        // Load role-specific information
        await loadRoleInformation();

        localStorage.setItem("wasAuthenticated", "true");
        return {
          success: true,
          redirectTo: getRoleLandingPage(result.data.user.role),
        };
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Google login failed");
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  const forceLogout = async () => {
    try {
      setIsLoading(true);
      await authService.forceLogout();
      clearAuthState();
      toast.success("All sessions cleared!");
      return { success: true };
    } catch (error) {
      console.error("Force logout error:", error);
      // Even if server call fails, clear local state
      clearAuthState();
      toast.success("Sessions cleared locally!");
      return { success: true };
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to clear all auth state
  const clearAuthState = () => {
    setUser(null);
    setUserRole(null);
    setRoleInfo(null);
    setDashboardConfig(null);
    setIsAuthenticated(false);
    localStorage.removeItem("wasAuthenticated");
  };

  // Load role-specific information
  const loadRoleInformation = async () => {
    try {
      // Load role info and dashboard config in parallel
      const [roleResponse, dashboardResponse] = await Promise.allSettled([
        authService.getCurrentUserRole(),
        authService.getRoleDashboard(),
      ]);

      if (roleResponse.status === "fulfilled" && roleResponse.value.success) {
        setRoleInfo(roleResponse.value.data);
      }

      if (
        dashboardResponse.status === "fulfilled" &&
        dashboardResponse.value.success
      ) {
        setDashboardConfig(dashboardResponse.value.data);
      }
    } catch (error) {
      console.error("Failed to load role information:", error);
    }
  };

  // Load available roles (for registration)
  const loadAvailableRoles = async () => {
    try {
      const response = await authService.getAvailableRoles();
      if (response.success && Array.isArray(response.data)) {
        setAvailableRoles(response.data);
      } else {
        console.error("Available roles response is not an array:", response.data);
        // Set default roles if API fails
        setAvailableRoles([
          {
            value: "customer",
            label: "Customer", 
            description: "Browse and purchase products from vendors",
            permissions: ["Browse products", "Add items to cart", "Place orders"]
          },
          {
            value: "vendor",
            label: "Vendor/Seller",
            description: "Sell products and manage your online store", 
            permissions: ["Create and manage products", "Manage inventory", "Process orders"]
          }
        ]);
      }
    } catch (error) {
      console.error("Failed to load available roles:", error);
      // Set default roles if API fails
      setAvailableRoles([
        {
          value: "customer",
          label: "Customer", 
          description: "Browse and purchase products from vendors",
          permissions: ["Browse products", "Add items to cart", "Place orders"]
        },
        {
          value: "vendor",
          label: "Vendor/Seller",
          description: "Sell products and manage your online store", 
          permissions: ["Create and manage products", "Manage inventory", "Process orders"]
        }
      ]);
    }
  };

  // Role-based utility functions
  const hasRole = (roles) => userHasRole(user, roles);
  const isActive = () => userIsActive(user);
  const hasPermission = (permissionCheck) => {
    if (typeof permissionCheck === "function") {
      return permissionCheck(user);
    }
    return false;
  };

  // Check specific permissions
  const canCreateProducts = () => permissions.canCreateProducts(user);
  const canManageUsers = () => permissions.canManageUsers(user);
  const canAccessAdminPanel = () => permissions.canAccessAdminPanel(user);
  const canAccessVendorPanel = () => permissions.canAccessVendorPanel(user);

  // Request role upgrade
  const requestRoleUpgrade = async () => {
    try {
      setIsLoading(true);
      const response = await authService.requestRoleUpgrade();
      if (response.success) {
        toast.success("Role upgrade request submitted successfully!");
        return { success: true, data: response.data };
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Role upgrade request failed";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    // Basic auth state
    user,
    isLoading,
    isAuthenticated,
    userRole,
    roleInfo,
    dashboardConfig,
    availableRoles,

    // Auth methods
    login,
    register,
    logout,
    googleLogin,
    forceLogout,
    refreshToken,
    checkAuthStatus,
    loadAvailableRoles,
    requestRoleUpgrade,

    // Role-based utilities
    hasRole,
    isActive,
    hasPermission,
    canCreateProducts,
    canManageUsers,
    canAccessAdminPanel,
    canAccessVendorPanel,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
