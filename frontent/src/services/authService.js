import { apiClient } from "./apiClient";

const AUTH_ENDPOINTS = {
  REGISTER: "/users/register",
  LOGIN: "/users/login",
  LOGOUT: "/users/logout",
  REFRESH_TOKEN: "/users/refresh-token",
  CURRENT_USER: "/users/current",
  GOOGLE_SIGNIN: "/users/google-signin",
  // Role Management Endpoints
  AVAILABLE_ROLES: "/roles/available",
  CURRENT_ROLE: "/roles/current",
  ROLE_DASHBOARD: "/roles/dashboard",
  CHECK_PERMISSIONS: "/roles/permissions",
  ROLE_UPGRADE: "/roles/upgrade",
};

class AuthService {
  async register(userData) {
    try {
      // Customer registration only
      const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, {
        fullname: userData.fullname,
        email: userData.email,
        username: userData.username,
        password: userData.password,
        role: "customer", // Always customer for main registration
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async registerVendor(vendorData) {
    try {
      const formData = new FormData();

      // Add basic user data
      formData.append("fullname", vendorData.fullname);
      formData.append("username", vendorData.username);
      formData.append("email", vendorData.email);
      formData.append("password", vendorData.password);

      // Add business data
      formData.append("companyName", vendorData.companyName);
      formData.append("gstNumber", vendorData.gstNumber);
      formData.append("businessDescription", vendorData.businessDescription);

      // Add business address
      formData.append(
        "businessAddress[street]",
        vendorData.businessAddress.street
      );
      formData.append("businessAddress[city]", vendorData.businessAddress.city);
      formData.append(
        "businessAddress[state]",
        vendorData.businessAddress.state
      );
      formData.append(
        "businessAddress[zipCode]",
        vendorData.businessAddress.zipCode
      );
      formData.append(
        "businessAddress[country]",
        vendorData.businessAddress.country || "India"
      );

      // Add contact info
      formData.append("contactInfo[phone]", vendorData.contactInfo.phone);
      formData.append(
        "contactInfo[alternatePhone]",
        vendorData.contactInfo.alternatePhone || ""
      );
      formData.append(
        "contactInfo[email]",
        vendorData.contactInfo.email || vendorData.email
      );

      // Add document files
      if (vendorData.documents) {
        Object.keys(vendorData.documents).forEach((key) => {
          if (
            vendorData.documents[key] &&
            vendorData.documents[key] instanceof File
          ) {
            formData.append(key, vendorData.documents[key]);
          }
        });
      }

      const response = await apiClient.post("/vendors/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Vendor registration error:", error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials);

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async googleLogin(accessToken) {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.GOOGLE_SIGNIN, {
        access_token: accessToken,
      });

      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      // Only log unexpected errors (not 401 which is normal when no refresh token exists)
      if (error?.response?.status !== 401) {
        console.error("Token refresh error:", error);
      }
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await apiClient.get(AUTH_ENDPOINTS.CURRENT_USER);
      return response.data.data;
    } catch (error) {
      // Only log unexpected errors (not 401 which is normal for unauthenticated users)
      if (error?.response?.status !== 401) {
        console.error("Get current user error:", error);
      }
      return null;
    }
  }

  async forceLogout() {
    try {
      const response = await apiClient.post("/users/force-logout");
      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Force logout error:", error);
      return {
        success: false,
        message: "Force logout completed locally",
      };
    }
  }

  // Role Management Methods
  async getAvailableRoles() {
    try {
      const response = await apiClient.get(AUTH_ENDPOINTS.AVAILABLE_ROLES);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Get available roles error:", error);
      throw error;
    }
  }

  async getCurrentUserRole() {
    try {
      const response = await apiClient.get(AUTH_ENDPOINTS.CURRENT_ROLE);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Get current user role error:", error);
      throw error;
    }
  }

  async getRoleDashboard() {
    try {
      const response = await apiClient.get(AUTH_ENDPOINTS.ROLE_DASHBOARD);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Get role dashboard error:", error);
      throw error;
    }
  }

  async checkPermissions(action, resource = null) {
    try {
      const params = { action };
      if (resource) params.resource = resource;

      const response = await apiClient.get(AUTH_ENDPOINTS.CHECK_PERMISSIONS, {
        params,
      });
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Check permissions error:", error);
      throw error;
    }
  }

  async requestRoleUpgrade() {
    try {
      const response = await apiClient.post(AUTH_ENDPOINTS.ROLE_UPGRADE);
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } catch (error) {
      console.error("Role upgrade request error:", error);
      throw error;
    }
  }

  // Helper method to check if user is authenticated
  isAuthenticated() {
    // This will be handled by checking if API calls return 401
    return true;
  }
}

export const authService = new AuthService();
