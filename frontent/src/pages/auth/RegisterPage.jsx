import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Leaf,
  Users,
  Store,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import GoogleSignIn from "../../pages/auth/GoogleSignIn";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register: registerUser,
    isLoading,
    availableRoles,
    loadAvailableRoles,
  } = useAuth();
  const navigate = useNavigate();

  // Load available roles on component mount
  useEffect(() => {
    loadAvailableRoles();
  }, [loadAvailableRoles]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    const formData = {
      fullname: data.fullname,
      email: data.email,
      username: data.username,
      password: data.password,
      role: data.role || "customer", // Include selected role
    };

    const result = await registerUser(formData);
    if (result.success) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-primary-100 rounded-full">
              <Leaf className="w-12 h-12 text-primary-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold font-display text-natural-900">
            Join our community
          </h2>
          <p className="mt-2 text-sm text-natural-600">
            Create your account and start your natural lifestyle journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullname"
                className="block text-sm font-medium text-natural-700 mb-2"
              >
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-natural-400" />
                </div>
                <input
                  {...register("fullname", {
                    required: "Full name is required",
                    minLength: {
                      value: 2,
                      message: "Full name must be at least 2 characters",
                    },
                  })}
                  type="text"
                  className={`input-field pl-10 ${
                    errors.fullname ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.fullname && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fullname.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-natural-700 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-natural-400 text-sm">@</span>
                </div>
                <input
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message:
                        "Username can only contain letters, numbers, and underscores",
                    },
                  })}
                  type="text"
                  className={`input-field pl-8 ${
                    errors.username ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="Choose a username"
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-natural-700 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-natural-400" />
                </div>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className={`input-field pl-10 ${
                    errors.email ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="Enter your email address"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-natural-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-natural-400" />
                </div>
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  className={`input-field pl-10 pr-10 ${
                    errors.password ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-natural-400 hover:text-natural-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-natural-400 hover:text-natural-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-natural-700 mb-2"
              >
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-natural-400" />
                </div>
                <input
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  type="password"
                  className={`input-field pl-10 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  placeholder="Confirm your password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-natural-700 mb-2"
              >
                Account Type
              </label>
              <div className="grid grid-cols-1 gap-3">
                {availableRoles.map((role) => (
                  <div key={role.value} className="relative">
                    <input
                      {...register("role", {
                        required: "Please select an account type",
                      })}
                      type="radio"
                      value={role.value}
                      id={role.value}
                      className="sr-only peer"
                      defaultChecked={role.value === "customer"}
                    />
                    <label
                      htmlFor={role.value}
                      className="flex items-start p-4 bg-white border border-natural-300 rounded-lg cursor-pointer hover:bg-natural-50 peer-checked:border-primary-500 peer-checked:bg-primary-50 transition-all duration-200"
                    >
                      <div className="flex-shrink-0 mr-3 mt-1">
                        {role.value === "customer" ? (
                          <Users className="h-5 w-5 text-natural-500" />
                        ) : (
                          <Store className="h-5 w-5 text-natural-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-natural-900">
                            {role.label}
                          </h3>
                          <div className="h-4 w-4 border border-natural-300 rounded-full peer-checked:border-primary-500 peer-checked:bg-primary-500 peer-checked:border-4 transition-all duration-200"></div>
                        </div>
                        <p className="mt-1 text-sm text-natural-600">
                          {role.description}
                        </p>
                        {role.permissions && (
                          <ul className="mt-2 text-xs text-natural-500">
                            {role.permissions
                              .slice(0, 3)
                              .map((permission, index) => (
                                <li key={index} className="inline">
                                  {permission}
                                  {index <
                                    Math.min(role.permissions.length, 3) - 1 &&
                                    " • "}
                                </li>
                              ))}
                          </ul>
                        )}
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.role.message}
                </p>
              )}
              <p className="mt-2 text-xs text-natural-500">
                You can upgrade your account later if needed.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <LoadingSpinner size="small" text="" />
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-natural-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-natural-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign-In */}
          <GoogleSignIn />

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-natural-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
