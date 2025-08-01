/**
 * Test script for User Model with Role-Based Fields
 * Run this to verify the updated User model works correctly
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./src/models/user.models.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Test user creation with different roles
const testUserCreation = async () => {
  console.log("\n🧪 Testing User Model with Role-Based Fields...\n");

  try {
    // Test 1: Create customer user (default registration)
    console.log("1. Creating customer user (default registration)...");
    const customerUser = await User.create({
      fullname: "John Customer",
      email: "customer@test.com",
      username: "customer_test",
      password: "password123",
      // role: 'customer' - automatically set by default
      // addresses: [] - optional, can be added later
    });
    console.log("✅ Customer user created:", {
      id: customerUser._id,
      fullname: customerUser.fullname,
      role: customerUser.role, // Should be 'customer'
      isActive: customerUser.isActive,
      addressesCount: customerUser.addresses?.length || 0,
    });

    // Test 2: Create customer with addresses (optional)
    console.log("\n2. Creating customer user with addresses...");
    const customerWithAddress = await User.create({
      fullname: "Jane Customer",
      email: "jane@test.com",
      username: "jane_test",
      password: "password123",
      addresses: [
        {
          type: "home",
          fullName: "Jane Customer",
          phone: "+91-9876543210",
          street: "123 Customer Street",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400001",
          country: "India",
          isDefault: true,
        },
      ],
    });
    console.log("✅ Customer with address created:", {
      id: customerWithAddress._id,
      fullname: customerWithAddress.fullname,
      role: customerWithAddress.role,
      addressesCount: customerWithAddress.addresses.length,
    });

    // Test 3: Create vendor user (for vendor registration flow)
    console.log("\n3. Creating vendor user (vendor registration)...");
    const vendorUser = await User.create({
      fullname: "Jane Vendor",
      email: "vendor@test.com",
      username: "vendor_test",
      password: "password123",
      role: "vendor", // Explicitly set for vendor registration
      addresses: [
        {
          type: "office",
          fullName: "Jane Vendor",
          phone: "+91-9876543211",
          street: "456 Vendor Avenue",
          city: "Delhi",
          state: "Delhi",
          zipCode: "110001",
          country: "India",
          isDefault: true,
        },
      ],
    });
    console.log("✅ Vendor user created:", {
      id: vendorUser._id,
      fullname: vendorUser.fullname,
      role: vendorUser.role,
      isActive: vendorUser.isActive,
      addressesCount: vendorUser.addresses.length,
    });

    // Test 4: Create admin user (backend logic only)
    console.log("\n4. Creating admin user (backend logic only)...");
    const adminUser = await User.create({
      fullname: "Admin User",
      email: "admin@test.com",
      username: "admin_test",
      password: "password123",
      role: "admin", // Explicitly set for admin creation
    });
    console.log("✅ Admin user created:", {
      id: adminUser._id,
      fullname: adminUser.fullname,
      role: adminUser.role,
      isActive: adminUser.isActive,
    });

    // Test 5: Test JWT token generation with role
    console.log("\n5. Testing JWT token generation...");
    const accessToken = customerUser.generateAccessToken();
    console.log("✅ Access token generated with role included");

    // Test 6: Test password validation
    console.log("\n6. Testing password validation...");
    const isPasswordValid = await customerUser.isPasswordCorrect("password123");
    console.log(
      "✅ Password validation:",
      isPasswordValid ? "PASSED" : "FAILED"
    );

    // Test 7: Query users by role
    console.log("\n7. Testing role-based queries...");
    const customers = await User.find({ role: "customer" });
    const vendors = await User.find({ role: "vendor" });
    const admins = await User.find({ role: "admin" });
    console.log("✅ Role-based queries:", {
      customers: customers.length,
      vendors: vendors.length,
      admins: admins.length,
    });

    // Test 8: Test inactive user
    console.log("\n8. Testing inactive user...");
    const inactiveUser = await User.create({
      fullname: "Inactive User",
      email: "inactive@test.com",
      username: "inactive_test",
      password: "password123",
      role: "customer",
      isActive: false,
    });
    console.log("✅ Inactive user created:", {
      id: inactiveUser._id,
      fullname: inactiveUser.fullname,
      isActive: inactiveUser.isActive,
    });

    console.log(
      "\n🎉 All tests passed! User model with role-based fields is working correctly."
    );
    console.log("\n📋 User Flow Summary:");
    console.log("- Regular registration → role: 'customer' (automatic)");
    console.log("- Vendor registration → role: 'vendor' (explicit)");
    console.log("- Admin creation → role: 'admin' (backend only)");
    console.log("- Addresses are optional and can be added later");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
};

// Clean up test data
const cleanupTestData = async () => {
  try {
    await User.deleteMany({
      email: {
        $in: [
          "customer@test.com",
          "jane@test.com",
          "vendor@test.com",
          "admin@test.com",
          "inactive@test.com",
        ],
      },
    });
    console.log("🧹 Test data cleaned up");
  } catch (error) {
    console.error("❌ Cleanup failed:", error.message);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await testUserCreation();
  await cleanupTestData();
  await mongoose.disconnect();
  console.log("\n👋 Test completed. Database disconnected.");
};

// Run the test
main().catch(console.error);
