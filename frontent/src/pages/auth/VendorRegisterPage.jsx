import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Store, Upload, FileText, Building2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const VendorRegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const { registerVendor, isLoading } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password");

  const handleFileUpload = (fieldName, event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFiles((prev) => ({ ...prev, [fieldName]: file }));
    }
  };

  const onSubmit = async (data) => {
    try {
      const vendorData = {
        // Basic user info
        fullname: data.fullname,
        username: data.username,
        email: data.email,
        password: data.password,

        // Business info
        companyName: data.companyName,
        gstNumber: data.gstNumber,
        businessDescription: data.businessDescription,

        // Business address
        businessAddress: {
          street: data.street,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          country: data.country || "India",
        },

        // Contact info
        contactInfo: {
          phone: data.phone,
          alternatePhone: data.alternatePhone,
          email: data.contactEmail || data.email,
        },

        // Documents
        documents: uploadedFiles,
      };

      const result = await registerVendor(vendorData);
      if (result.success) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Vendor registration error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-natural-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Store className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-natural-900">
            Become a Vendor
          </h2>
          <p className="mt-2 text-lg text-natural-600">
            Join our marketplace and start selling your products
          </p>
          <p className="mt-1 text-sm text-natural-500">
            Fill out the form below to register your business
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-natural-900 mb-4 flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-green-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-natural-700">
                      Full Name *
                    </label>
                    <input
                      {...register("fullname", {
                        required: "Full name is required",
                        minLength: {
                          value: 2,
                          message: "Full name must be at least 2 characters",
                        },
                      })}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-natural-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your full name"
                    />
                    {errors.fullname && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.fullname.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-natural-700">
                      Username *
                    </label>
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
                      className="mt-1 block w-full px-3 py-2 border border-natural-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Choose a username"
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.username.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-natural-700">
                      Email Address *
                    </label>
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      type="email"
                      className="mt-1 block w-full px-3 py-2 border border-natural-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-natural-700">
                      Password *
                    </label>
                    <div className="mt-1 relative">
                      <input
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 8,
                            message: "Password must be at least 8 characters",
                          },
                          pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                            message:
                              "Password must contain uppercase, lowercase, and number",
                          },
                        })}
                        type={showPassword ? "text" : "password"}
                        className="block w-full px-3 py-2 pr-10 border border-natural-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-natural-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-natural-400" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-natural-700">
                      Confirm Password *
                    </label>
                    <input
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (value) =>
                          value === password || "Passwords do not match",
                      })}
                      type="password"
                      className="mt-1 block w-full px-3 py-2 border border-natural-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div>
                <h3 className="text-lg font-medium text-natural-900 mb-4 flex items-center">
                  <Store className="h-5 w-5 mr-2 text-green-600" />
                  Business Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-natural-700">
                      Company Name *
                    </label>
                    <input
                      {...register("companyName", {
                        required: "Company name is required",
                      })}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-natural-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter your company name"
                    />
                    {errors.companyName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.companyName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-natural-700">
                      GST Number *
                    </label>
                    <input
                      {...register("gstNumber", {
                        required: "GST number is required",
                        pattern: {
                          value:
                            /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
                          message: "Invalid GST number format",
                        },
                      })}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-natural-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="22AAAAA0000A1Z5"
                    />
                    {errors.gstNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.gstNumber.message}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-natural-700">
                      Business Description *
                    </label>
                    <textarea
                      {...register("businessDescription", {
                        required: "Business description is required",
                        minLength: {
                          value: 50,
                          message: "Description must be at least 50 characters",
                        },
                      })}
                      rows={4}
                      className="mt-1 block w-full px-3 py-2 border border-natural-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Describe your business and the products you plan to sell..."
                    />
                    {errors.businessDescription && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.businessDescription.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-natural-700">
                      Business Phone *
                    </label>
                    <input
                      {...register("phone", {
                        required: "Business phone is required",
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: "Invalid phone number",
                        },
                      })}
                      type="tel"
                      className="mt-1 block w-full px-3 py-2 border border-natural-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="9876543210"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-natural-700">
                      Alternate Phone
                    </label>
                    <input
                      {...register("alternatePhone")}
                      type="tel"
                      className="mt-1 block w-full px-3 py-2 border border-natural-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="9876543210"
                    />
                  </div>
                </div>
              </div>

              {/* Business Address */}
              <div>
                <h3 className="text-lg font-medium text-natural-900 mb-4">
                  Business Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-natural-700">
                      Street Address *
                    </label>
                    <input
                      {...register("street", {
                        required: "Street address is required",
                      })}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-natural-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter street address"
                    />
                    {errors.street && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.street.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-natural-700">
                      City *
                    </label>
                    <input
                      {...register("city", {
                        required: "City is required",
                      })}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-natural-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter city"
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-natural-700">
                      State *
                    </label>
                    <input
                      {...register("state", {
                        required: "State is required",
                      })}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-natural-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter state"
                    />
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.state.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-natural-700">
                      ZIP Code *
                    </label>
                    <input
                      {...register("zipCode", {
                        required: "ZIP code is required",
                        pattern: {
                          value: /^[1-9][0-9]{5}$/,
                          message: "Invalid ZIP code",
                        },
                      })}
                      type="text"
                      className="mt-1 block w-full px-3 py-2 border border-natural-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="123456"
                    />
                    {errors.zipCode && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.zipCode.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-natural-700">
                      Country
                    </label>
                    <input
                      {...register("country")}
                      type="text"
                      defaultValue="India"
                      className="mt-1 block w-full px-3 py-2 border border-natural-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>
              </div>

              {/* Document Upload */}
              <div>
                <h3 className="text-lg font-medium text-natural-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-600" />
                  Required Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: "businessLicense", label: "Business License" },
                    { key: "gstCertificate", label: "GST Certificate" },
                    { key: "addressProof", label: "Address Proof" },
                    { key: "panCard", label: "PAN Card" },
                    { key: "bankStatement", label: "Bank Statement" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-natural-700">
                        {label}
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-natural-300 border-dashed rounded-md hover:border-green-400 transition-colors">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-natural-400" />
                          <div className="flex text-sm text-natural-600">
                            <label
                              htmlFor={key}
                              className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                            >
                              <span>Upload {label}</span>
                              <input
                                id={key}
                                name={key}
                                type="file"
                                className="sr-only"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => handleFileUpload(key, e)}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-natural-500">
                            PNG, JPG, PDF up to 10MB
                          </p>
                          {uploadedFiles[key] && (
                            <p className="text-xs text-green-600 font-medium">
                              ✓ {uploadedFiles[key].name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-natural-600">
                  * All documents are required for vendor verification. Your
                  application will be reviewed within 2-3 business days.
                </p>
              </div>

              {/* Submit Button */}
              <div className="border-t border-natural-200 pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="small" text="" />
                    ) : (
                      <>
                        <Store className="w-5 h-5 mr-2" />
                        Register as Vendor
                      </>
                    )}
                  </button>
                  <Link
                    to="/register"
                    className="flex-1 bg-natural-100 hover:bg-natural-200 text-natural-700 py-3 px-6 rounded-lg font-medium text-center transition-colors"
                  >
                    Register as Customer Instead
                  </Link>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center border-t border-natural-200 pt-6">
                <p className="text-sm text-natural-600">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-green-600 hover:text-green-500"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorRegisterPage;
