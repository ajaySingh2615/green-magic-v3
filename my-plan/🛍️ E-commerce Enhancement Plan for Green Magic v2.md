<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# 🛍️ E-commerce Enhancement Plan for Green Magic v2

A comprehensive transformation plan to extend the existing authentication system into a full-featured e-commerce platform supporting **Customer**, **Vendor**, and **Admin** roles for natural products marketplace.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Current Architecture](#-current-architecture)
- [Enhanced Architecture](#-enhanced-architecture)
- [Database Schema Design](#-database-schema-design)
- [Backend API Development](#-backend-api-development)
- [Frontend Development](#-frontend-development)
- [Implementation Timeline](#-implementation-timeline)
- [Technical Guidelines](#-technical-guidelines)
- [Security Considerations](#-security-considerations)
- [Deployment Strategy](#-deployment-strategy)


## 🎯 Project Overview

Transform the existing Green Magic v2 authentication system into a comprehensive e-commerce platform featuring natural products like wheat flour, rice, ghee, honey, apple, mango, vegetables, etc.

### Target User Roles

- **🛒 Customer**: Browse and purchase products from various vendors
- **🏪 Vendor**: Register company, list products, manage orders
- **👨💼 Admin**: Manage vendors, customers, products, and overall platform


### Current System Foundation

- ✅ **Authentication System**: JWT + Google OAuth implemented
- ✅ **User Management**: Registration, login, profile management
- ✅ **File Upload**: Cloudinary integration for avatars
- ✅ **Security**: bcryptjs, CORS, HTTP-only cookies
- ✅ **Frontend**: React + Tailwind CSS responsive design
- ✅ **Backend**: Express.js + MongoDB + Mongoose


## 🏗️ Current Architecture

### Existing Backend Structure

```
backend/src/
├── controllers/
│   ├── user.controllers.js        ✅ Implemented
│   ├── googleAuth.controllers.js  ✅ Implemented
│   └── healthcheck.controllers.js ✅ Implemented
├── models/
│   └── user.models.js             ✅ Implemented
├── routes/
│   ├── user.routes.js             ✅ Implemented
│   ├── googleAuth.routes.js       ✅ Implemented
│   └── healthcheck.routes.js      ✅ Implemented
├── middlewares/
│   ├── auth.middlewares.js        ✅ Implemented
│   ├── error.middlewares.js       ✅ Implemented
│   └── multer.middlewares.js      ✅ Implemented
└── utils/                         ✅ All implemented
```


### Existing Frontend Structure

```
frontend/src/
├── components/
│   ├── common/LoadingSpinner.jsx  ✅ Implemented
│   └── layout/
│       ├── Navbar.jsx             ✅ Implemented
│       └── Footer.jsx             ✅ Implemented
├── pages/
│   ├── HomePage.jsx               ✅ Implemented
│   ├── AboutPage.jsx              ✅ Implemented
│   ├── ProductsPage.jsx           ✅ Basic version
│   ├── ContactPage.jsx            ✅ Implemented
│   └── auth/
│       ├── LoginPage.jsx          ✅ Implemented
│       └── RegisterPage.jsx       ✅ Implemented
├── context/AuthContext.jsx        ✅ Implemented
└── services/authService.js        ✅ Implemented
```


## 🚀 Enhanced Architecture

### New Backend Structure

```
backend/src/
├── controllers/
│   ├── user.controllers.js        ✅ Existing
│   ├── vendor.controllers.js      🆕 To implement
│   ├── product.controllers.js     🆕 To implement
│   ├── category.controllers.js    🆕 To implement
│   ├── order.controllers.js       🆕 To implement
│   ├── admin.controllers.js       🆕 To implement
│   └── cart.controllers.js        🆕 To implement
├── models/
│   ├── user.models.js             ✅ Update required
│   ├── vendor.models.js           🆕 To create
│   ├── product.models.js          🆕 To create
│   ├── category.models.js         🆕 To create
│   ├── order.models.js            🆕 To create
│   ├── cart.models.js             🆕 To create
│   └── review.models.js           🆕 To create
├── routes/
│   ├── vendor.routes.js           🆕 To create
│   ├── product.routes.js          🆕 To create
│   ├── category.routes.js         🆕 To create
│   ├── order.routes.js            🆕 To create
│   ├── admin.routes.js            🆕 To create
│   └── cart.routes.js             🆕 To create
├── middlewares/
│   ├── rbac.middlewares.js        🆕 Role-based access control
│   └── upload.middlewares.js      🆕 Enhanced file upload
└── utils/
    ├── orderUtils.js              🆕 Order processing utilities
    └── emailService.js            🆕 Email notifications
```


### Enhanced Frontend Structure

```
frontend/src/
├── components/
│   ├── product/                   🆕 Product components
│   │   ├── ProductCard.jsx
│   │   ├── ProductGrid.jsx
│   │   ├── ProductFilter.jsx
│   │   ├── ProductSearch.jsx
│   │   └── ProductImages.jsx
│   ├── shopping/                  🆕 Shopping components
│   │   ├── CartItem.jsx
│   │   ├── CartSummary.jsx
│   │   ├── CheckoutForm.jsx
│   │   └── OrderCard.jsx
│   ├── vendor/                    🆕 Vendor components
│   │   ├── VendorCard.jsx
│   │   └── VendorProductForm.jsx
│   └── admin/                     🆕 Admin components
│       ├── AdminStats.jsx
│       └── AdminTable.jsx
├── pages/
│   ├── customer/                  🆕 Customer pages
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── CartPage.jsx
│   │   ├── CheckoutPage.jsx
│   │   ├── OrdersPage.jsx
│   │   └── OrderDetailPage.jsx
│   ├── vendor/                    🆕 Vendor pages
│   │   ├── VendorDashboard.jsx
│   │   ├── VendorRegistration.jsx
│   │   ├── ProductManagement.jsx
│   │   ├── AddProductPage.jsx
│   │   └── VendorOrdersPage.jsx
│   └── admin/                     🆕 Admin pages
│       ├── AdminDashboard.jsx
│       ├── VendorManagement.jsx
│       ├── ProductModeration.jsx
│       ├── CategoryManagement.jsx
│       └── OrderManagement.jsx
├── context/
│   ├── AuthContext.jsx            ✅ Update required
│   ├── CartContext.jsx            🆕 Shopping cart state
│   └── ProductContext.jsx         🆕 Product state
└── services/
    ├── authService.js             ✅ Existing
    ├── vendorService.js           🆕 Vendor API calls
    ├── productService.js          🆕 Product API calls
    ├── orderService.js            🆕 Order API calls
    └── adminService.js            🆕 Admin API calls
```


## 🗄️ Database Schema Design

### 1. Updated User Model

```javascript
const userSchema = new mongoose.Schema({
  // Existing fields
  username: {
    type: String,
    required: function() { return !this.googleId; },
    unique: true,
    lowercase: true
  },
  email: { type: String, required: true, unique: true, lowercase: true },
  fullname: { type: String, required: true },
  avatar: { type: String },
  password: { type: String, required: function() { return !this.googleId; } },
  googleId: { type: String, unique: true, sparse: true },
  refreshToken: { type: String },
  
  // New fields for e-commerce
  role: {
    type: String,
    enum: ['customer', 'vendor', 'admin'],
    default: 'customer'
  },
  isActive: { type: Boolean, default: true },
  vendorProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  
  // Customer specific fields
  addresses: [{
    type: { type: String, enum: ['home', 'office', 'other'], default: 'home' },
    fullName: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' },
    isDefault: { type: Boolean, default: false }
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, {
  timestamps: true
});
```


### 2. Vendor Model

```javascript
const vendorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  businessLicense: { type: String, required: true }, // Cloudinary URL
  gstNumber: { type: String, required: true },
  
  businessAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  
  contactInfo: {
    phone: { type: String, required: true },
    alternateEmail: String,
    website: String
  },
  
  businessDescription: String,
  logo: String, // Cloudinary URL
  
  bankDetails: {
    accountHolderName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String
  },
  
  isVerified: { type: Boolean, default: false },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'under_review'],
    default: 'pending'
  },
  verificationNotes: String,
  
  // Performance metrics
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalOrders: { type: Number, default: 0 },
  totalRevenue: { type: Number, default: 0 },
  
  // Subscription/Commission
  subscriptionPlan: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic'
  },
  commissionRate: { type: Number, default: 0.05 }, // 5% default
  
  settings: {
    autoAcceptOrders: { type: Boolean, default: true },
    minOrderAmount: { type: Number, default: 0 },
    shippingCharges: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});
```


### 3. Category Model

```javascript
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  image: String, // Cloudinary URL
  icon: String, // Icon class or URL
  
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  sortOrder: { type: Number, default: 0 },
  
  seoMeta: {
    title: String,
    description: String,
    keywords: [String]
  },
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});
```


### 4. Product Model

```javascript
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 200 },
  
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  
  images: [{
    url: { type: String, required: true },
    alt: String,
    isMain: { type: Boolean, default: false }
  }],
  
  // Pricing
  price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
  discountPercentage: { type: Number, min: 0, max: 100 },
  
  // Inventory
  sku: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, min: 0 },
  lowStockThreshold: { type: Number, default: 10 },
  
  // Physical attributes
  weight: String, // e.g., "1kg", "500g"
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, default: 'cm' }
  },
  
  // Variants (for products with options like size, color)
  variants: [{
    name: String, // e.g., "Size", "Color"
    options: [String] // e.g., ["Small", "Medium", "Large"]
  }],
  
  // SEO and marketing
  tags: [String],
  metaTitle: String,
  metaDescription: String,
  
  // Status flags
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isOrganic: { type: Boolean, default: false },
  
  // Performance metrics
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  
  // Shipping info
  shippingInfo: {
    weight: Number,
    freeShippingEligible: { type: Boolean, default: false },
    estimatedDeliveryDays: { type: Number, default: 7 }
  }
}, {
  timestamps: true
});
```


### 5. Order Model

```javascript
const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    name: String, // Product name at time of order
    image: String, // Main product image
    sku: String,
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }, // Price at time of order
    discountPrice: Number,
    totalPrice: { type: Number, required: true }
  }],
  
  // Shipping information
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  
  // Payment information
  paymentInfo: {
    method: { 
      type: String, 
      enum: ['cod', 'razorpay', 'stripe', 'paytm'], 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paymentDate: Date
  },
  
  // Order status tracking
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }],
  
  // Financial breakdown
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  
  // Delivery information
  estimatedDelivery: Date,
  actualDelivery: Date,
  trackingNumber: String,
  courier: String,
  
  // Additional info
  notes: String,
  cancellationReason: String,
  returnReason: String
}, {
  timestamps: true
});
```


### 6. Cart Model

```javascript
const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    addedAt: { type: Date, default: Date.now }
  }],
  lastModified: { type: Date, default: Date.now }
}, {
  timestamps: true
});
```


### 7. Review Model

```javascript
const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  comment: { type: String, maxlength: 1000 },
  
  images: [String], // Cloudinary URLs for review images
  
  isVerified: { type: Boolean, default: false }, // Verified purchase
  isApproved: { type: Boolean, default: true },
  
  helpful: { type: Number, default: 0 }, // Helpful votes count
  
  vendorResponse: {
    message: String,
    respondedAt: Date,
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }
}, {
  timestamps: true
});
```


## 🚀 Backend API Development

### 1. Enhanced Authentication Middleware

```javascript
// middlewares/rbac.middlewares.js
const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Authentication required"));
    }
    
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json(new ApiError(403, "Insufficient permissions"));
    }
    
    next();
  };
};

// Specific role middlewares
const authorizeCustomer = authorize(['customer', 'vendor', 'admin']);
const authorizeVendor = authorize(['vendor', 'admin']);
const authorizeAdmin = authorize(['admin']);
const authorizeVendorOwn = async (req, res, next) => {
  // Additional logic to ensure vendor can only access their own resources
};
```


### 2. API Endpoints Structure

#### Vendor Management APIs

```javascript
// routes/vendor.routes.js
const router = Router();

// Public vendor routes
router.route('/vendors').get(getAllVendors);
router.route('/vendors/:id').get(getVendorById);

// Vendor registration and profile
router.route('/register').post(verifyJWT, registerVendor);
router.route('/profile').get(verifyJWT, authorizeVendor, getVendorProfile);
router.route('/profile').put(verifyJWT, authorizeVendor, updateVendorProfile);

// Vendor business operations
router.route('/products').get(verifyJWT, authorizeVendor, getVendorProducts);
router.route('/orders').get(verifyJWT, authorizeVendor, getVendorOrders);
router.route('/orders/:id/status').put(verifyJWT, authorizeVendor, updateOrderStatus);
router.route('/analytics').get(verifyJWT, authorizeVendor, getVendorAnalytics);

// Admin vendor management
router.route('/admin/vendors').get(verifyJWT, authorizeAdmin, getAllVendorsAdmin);
router.route('/admin/vendors/:id/verify').put(verifyJWT, authorizeAdmin, verifyVendor);
router.route('/admin/vendors/:id/suspend').put(verifyJWT, authorizeAdmin, suspendVendor);
```


#### Product Management APIs

```javascript
// routes/product.routes.js
const router = Router();

// Public product routes
router.route('/').get(getAllProducts);
router.route('/:id').get(getProductById);
router.route('/category/:categoryId').get(getProductsByCategory);
router.route('/vendor/:vendorId').get(getProductsByVendor);
router.route('/search').get(searchProducts);
router.route('/featured').get(getFeaturedProducts);

// Vendor product management
router.route('/vendor/products').get(verifyJWT, authorizeVendor, getVendorProducts);
router.route('/vendor/products').post(verifyJWT, authorizeVendor, upload.array('images'), createProduct);
router.route('/vendor/products/:id').put(verifyJWT, authorizeVendor, upload.array('images'), updateProduct);
router.route('/vendor/products/:id').delete(verifyJWT, authorizeVendor, deleteProduct);

// Admin product management
router.route('/admin/products').get(verifyJWT, authorizeAdmin, getAllProductsAdmin);
router.route('/admin/products/:id/approve').put(verifyJWT, authorizeAdmin, approveProduct);
router.route('/admin/products/:id/feature').put(verifyJWT, authorizeAdmin, featureProduct);
```


#### Order Management APIs

```javascript
// routes/order.routes.js
const router = Router();

// Customer order operations
router.route('/').get(verifyJWT, authorizeCustomer, getCustomerOrders);
router.route('/').post(verifyJWT, authorizeCustomer, createOrder);
router.route('/:id').get(verifyJWT, authorizeCustomer, getOrderById);
router.route('/:id/cancel').put(verifyJWT, authorizeCustomer, cancelOrder);
router.route('/:id/return').post(verifyJWT, authorizeCustomer, returnOrder);

// Vendor order management
router.route('/vendor/orders').get(verifyJWT, authorizeVendor, getVendorOrders);
router.route('/vendor/orders/:id/status').put(verifyJWT, authorizeVendor, updateOrderStatus);
router.route('/vendor/orders/:id/tracking').put(verifyJWT, authorizeVendor, updateTracking);

// Admin order management
router.route('/admin/orders').get(verifyJWT, authorizeAdmin, getAllOrdersAdmin);
router.route('/admin/orders/:id/status').put(verifyJWT, authorizeAdmin, updateOrderStatusAdmin);
```


#### Category Management APIs

```javascript
// routes/category.routes.js
const router = Router();

// Public category routes
router.route('/').get(getAllCategories);
router.route('/:id').get(getCategoryById);
router.route('/featured').get(getFeaturedCategories);

// Admin category management
router.route('/admin/categories').post(verifyJWT, authorizeAdmin, upload.single('image'), createCategory);
router.route('/admin/categories/:id').put(verifyJWT, authorizeAdmin, upload.single('image'), updateCategory);
router.route('/admin/categories/:id').delete(verifyJWT, authorizeAdmin, deleteCategory);
```


#### Cart Management APIs

```javascript
// routes/cart.routes.js
const router = Router();

router.route('/').get(verifyJWT, authorizeCustomer, getCart);
router.route('/items').post(verifyJWT, authorizeCustomer, addToCart);
router.route('/items/:productId').put(verifyJWT, authorizeCustomer, updateCartItem);
router.route('/items/:productId').delete(verifyJWT, authorizeCustomer, removeFromCart);
router.route('/clear').delete(verifyJWT, authorizeCustomer, clearCart);
```


#### Review Management APIs

```javascript
// routes/review.routes.js
const router = Router();

// Public review routes
router.route('/product/:productId').get(getProductReviews);

// Customer review operations
router.route('/').post(verifyJWT, authorizeCustomer, upload.array('images'), createReview);
router.route('/:id').put(verifyJWT, authorizeCustomer, updateReview);
router.route('/:id').delete(verifyJWT, authorizeCustomer, deleteReview);

// Vendor response to reviews
router.route('/:id/response').post(verifyJWT, authorizeVendor, respondToReview);

// Admin review moderation
router.route('/admin/reviews').get(verifyJWT, authorizeAdmin, getAllReviewsAdmin);
router.route('/admin/reviews/:id/approve').put(verifyJWT, authorizeAdmin, approveReview);
```


## 🎨 Frontend Development

### 1. Enhanced Authentication Context

```javascript
// context/AuthContext.jsx
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Role checking utilities
  const hasRole = (role) => user?.role === role;
  const isCustomer = () => hasRole('customer');
  const isVendor = () => hasRole('vendor');
  const isAdmin = () => hasRole('admin');
  
  // Permission checking
  const canAccessVendorRoutes = () => isVendor() || isAdmin();
  const canAccessAdminRoutes = () => isAdmin();
  
  // Update user role (for role switching if needed)
  const updateUserRole = (newRole) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  return (
    <AuthContext.Provider value={{
      user, setUser, loading, setLoading,
      hasRole, isCustomer, isVendor, isAdmin,
      canAccessVendorRoutes, canAccessAdminRoutes,
      updateUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
};
```


### 2. Cart Context

```javascript
// context/CartContext.jsx
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(false);

  const addToCart = async (productId, quantity = 1) => {
    // API call to add item to cart
  };

  const updateCartItem = async (productId, quantity) => {
    // API call to update cart item
  };

  const removeFromCart = async (productId) => {
    // API call to remove item from cart
  };

  const clearCart = async () => {
    // API call to clear entire cart
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems, cartLoading,
      addToCart, updateCartItem, removeFromCart, clearCart,
      getCartTotal, getCartItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
```


### 3. Role-Based Routing

```javascript
// components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles = [], redirectTo = "/login" }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Usage in App.jsx
<Routes>
  {/* Public routes */}
  <Route path="/" element={<HomePage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/products" element={<ProductsPage />} />
  
  {/* Customer routes */}
  <Route path="/cart" element={
    <ProtectedRoute roles={['customer']}>
      <CartPage />
    </ProtectedRoute>
  } />
  <Route path="/orders" element={
    <ProtectedRoute roles={['customer']}>
      <OrdersPage />
    </ProtectedRoute>
  } />
  
  {/* Vendor routes */}
  <Route path="/vendor/*" element={
    <ProtectedRoute roles={['vendor', 'admin']}>
      <VendorRoutes />
    </ProtectedRoute>
  } />
  
  {/* Admin routes */}
  <Route path="/admin/*" element={
    <ProtectedRoute roles={['admin']}>
      <AdminRoutes />
    </ProtectedRoute>
  } />
</Routes>
```


### 4. Service Layer Structure

```javascript
// services/productService.js
import apiClient from './apiClient';

export const productService = {
  // Public product APIs
  getAllProducts: (params = {}) => apiClient.get('/products', { params }),
  getProductById: (id) => apiClient.get(`/products/${id}`),
  searchProducts: (query) => apiClient.get('/products/search', { params: { q: query } }),
  
  // Vendor product APIs
  getVendorProducts: () => apiClient.get('/products/vendor/products'),
  createProduct: (productData) => apiClient.post('/products/vendor/products', productData),
  updateProduct: (id, productData) => apiClient.put(`/products/vendor/products/${id}`, productData),
  deleteProduct: (id) => apiClient.delete(`/products/vendor/products/${id}`),
  
  // Admin product APIs
  getAllProductsAdmin: (params = {}) => apiClient.get('/products/admin/products', { params }),
  approveProduct: (id) => apiClient.put(`/products/admin/products/${id}/approve`),
  featureProduct: (id, featured) => apiClient.put(`/products/admin/products/${id}/feature`, { featured })
};

// services/orderService.js
export const orderService = {
  // Customer order APIs
  getCustomerOrders: () => apiClient.get('/orders'),
  createOrder: (orderData) => apiClient.post('/orders', orderData),
  getOrderById: (id) => apiClient.get(`/orders/${id}`),
  cancelOrder: (id) => apiClient.put(`/orders/${id}/cancel`),
  
  // Vendor order APIs
  getVendorOrders: () => apiClient.get('/orders/vendor/orders'),
  updateOrderStatus: (id, status) => apiClient.put(`/orders/vendor/orders/${id}/status`, { status }),
  
  // Admin order APIs
  getAllOrdersAdmin: (params = {}) => apiClient.get('/orders/admin/orders', { params })
};
```


## 📅 Implementation Timeline

### 🗓️ Phase 1: Database \& Core Backend (Week 1-2)

#### Week 1: Database Setup

- **Day 1-2**: Update User model with role field
- **Day 3-4**: Create Vendor, Category, Product models
- **Day 5-7**: Create Order, Cart, Review models
- **Testing**: Database relationships and indexes


#### Week 2: Core Backend APIs

- **Day 1-2**: Role-based access control middleware
- **Day 3-4**: Vendor registration and management APIs
- **Day 5-7**: Category management APIs (admin)
- **Testing**: Authentication and authorization flow


### 🗓️ Phase 2: Product \& Inventory System (Week 3-4)

#### Week 3: Product Management

- **Day 1-3**: Product CRUD operations (vendor)
- **Day 4-5**: Product image upload (multiple images)
- **Day 6-7**: Product search and filtering APIs
- **Testing**: Product management flow


#### Week 4: Inventory \& Categories

- **Day 1-2**: Stock management and low stock alerts
- **Day 3-4**: Category hierarchy and navigation
- **Day 5-7**: Product variants and attributes
- **Testing**: Inventory tracking accuracy


### 🗓️ Phase 3: Shopping Experience (Week 5-6)

#### Week 5: Shopping Cart

- **Day 1-3**: Cart management APIs and frontend
- **Day 4-5**: Cart persistence and session management
- **Day 6-7**: Cart calculations and validations
- **Testing**: Cart functionality across sessions


#### Week 6: Product Catalog Frontend

- **Day 1-2**: Product listing page with filters
- **Day 3-4**: Product detail page with image gallery
- **Day 5-7**: Search functionality and results page
- **Testing**: Product browsing experience


### 🗓️ Phase 4: Order Management (Week 7-8)

#### Week 7: Order Processing

- **Day 1-3**: Order creation and checkout process
- **Day 4-5**: Order status tracking system
- **Day 6-7**: Order history and details page
- **Testing**: Complete order flow


#### Week 8: Payment Integration

- **Day 1-3**: Payment gateway integration (Razorpay/Stripe)
- **Day 4-5**: COD (Cash on Delivery) option
- **Day 6-7**: Payment status handling and webhooks
- **Testing**: Payment processing and confirmations


### 🗓️ Phase 5: Vendor Portal (Week 9-10)

#### Week 9: Vendor Dashboard

- **Day 1-3**: Vendor registration and verification process
- **Day 4-5**: Vendor dashboard with analytics
- **Day 6-7**: Vendor product management interface
- **Testing**: Vendor onboarding flow


#### Week 10: Vendor Operations

- **Day 1-3**: Vendor order management and fulfillment
- **Day 4-5**: Vendor profile and business settings
- **Day 6-7**: Vendor analytics and reporting
- **Testing**: Complete vendor workflow


### 🗓️ Phase 6: Admin Panel (Week 11-12)

#### Week 11: Admin Management

- **Day 1-3**: Admin dashboard with system overview
- **Day 4-5**: Vendor verification and management
- **Day 6-7**: Product moderation and approval
- **Testing**: Admin control features


#### Week 12: System Administration

- **Day 1-3**: User management and role assignment
- **Day 4-5**: Order management and dispute resolution
- **Day 6-7**: System reports and analytics
- **Testing**: Complete admin functionality


### 🗓️ Phase 7: Advanced Features (Week 13-14)

#### Week 13: Reviews \& Notifications

- **Day 1-3**: Product review and rating system
- **Day 4-5**: Email notification system
- **Day 6-7**: In-app notifications and alerts
- **Testing**: Communication flow


#### Week 14: Performance \& Polish

- **Day 1-3**: Performance optimization and caching
- **Day 4-5**: UI/UX improvements and mobile optimization
- **Day 6-7**: Final testing and bug fixes
- **Testing**: Load testing and user acceptance


## 🔒 Security Considerations

### Backend Security

```javascript
// Enhanced security middleware
const securityMiddleware = {
  rateLimit: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  }),
  
  inputValidation: [
    body('email').isEmail().normalizeEmail(),
    body('price').isNumeric().custom(value => value >= 0),
    body('quantity').isInt({ min: 1 })
  ],
  
  fileUploadSecurity: multer({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|webp/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      
      if (mimetype && extname) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    }
  })
};
```


### Data Protection

- **PCI Compliance**: For payment data handling
- **GDPR Compliance**: User data protection and rights
- **Data Encryption**: Sensitive data encryption at rest
- **SQL Injection Prevention**: Mongoose built-in protection
- **XSS Protection**: Input sanitization and CSP headers


## 🚀 Deployment Strategy

### Development Environment

```bash
# Backend development
cd backend
npm run dev # Nodemon with hot reload

# Frontend development  
cd frontend
npm run dev # Vite dev server with HMR
```


### Production Deployment

#### Backend Deployment (Railway/Heroku)

```yaml
# railway.toml or similar
[build]
  command = "npm install"
  
[deploy]
  startCommand = "npm start"
  
[env]
  NODE_ENV = "production"
  MONGODB_URI = "mongodb+srv://..."
  CLOUDINARY_CLOUD_NAME = "your-cloud"
```


#### Frontend Deployment (Vercel/Netlify)

```json
{
  "build": {
    "command": "npm run build",
    "publish": "dist"
  },
  "env": {
    "VITE_API_BASE_URL": "https://your-api.railway.app/api/v1"
  }
}
```


### Environment Variables

#### Backend (.env)

```env
# Server Configuration
PORT=8001
NODE_ENV=production
CORS_ORIGIN=https://your-frontend.vercel.app

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greenmagic

# JWT Secrets
ACCESS_TOKEN_SECRET=your_super_secure_access_token_secret
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_super_secure_refresh_token_secret
REFRESH_TOKEN_EXPIRES_IN=10d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Payment Gateways
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```


#### Frontend (.env)

```env
VITE_API_BASE_URL=https://your-api.railway.app/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_RAZORPAY_KEY_ID=your_razorpay_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
```


## 📊 Performance Optimization

### Database Optimization

```javascript
// Add indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });
productSchema.index({ vendor: 1, isActive: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text' }); // Text search
orderSchema.index({ customer: 1, createdAt: -1 });
```


### Caching Strategy

```javascript
// Redis caching for frequently accessed data
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    const cached = await redis.get(key);
    
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    
    // Store original json function
    const originalJson = res.json;
    res.json = function(data) {
      redis.setex(key, duration, JSON.stringify(data));
      originalJson.call(this, data);
    };
    
    next();
  };
};

// Apply caching to product routes
router.get('/products', cacheMiddleware(600), getAllProducts); // 10 minutes
```


## 🧪 Testing Strategy

### Backend Testing

```javascript
// Jest test example for product controller
describe('Product Controller', () => {
  test('should create product with valid data', async () => {
    const productData = {
      name: 'Organic Wheat Flour',
      description: 'Premium quality organic wheat flour',
      price: 150,
      category: categoryId,
      vendor: vendorId
    };
    
    const response = await request(app)
      .post('/api/v1/products/vendor/products')
      .set('Authorization', `Bearer ${vendorToken}`)
      .send(productData)
      .expect(201);
      
    expect(response.body.data.name).toBe(productData.name);
  });
});
```


### Frontend Testing

```javascript
// React Testing Library example
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from '../components/ProductCard';

test('should add product to cart when button clicked', () => {
  const mockAddToCart = jest.fn();
  const product = { id: 1, name: 'Test Product', price: 100 };
  
  render(<ProductCard product={product} onAddToCart={mockAddToCart} />);
  
  const addButton = screen.getByText('Add to Cart');
  fireEvent.click(addButton);
  
  expect(mockAddToCart).toHaveBeenCalledWith(product.id);
});
```


## 📈 Analytics \& Monitoring

### Backend Monitoring

```javascript
// Add request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  });
  
  next();
};
```


### Error Tracking

```javascript
// Sentry integration for error tracking
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  Sentry.captureException(err);
  
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

This comprehensive README.md provides a complete roadmap for transforming your existing authentication system into a full-featured e-commerce platform. Each section includes detailed implementation guides, code examples, and best practices to ensure successful development with Cursor AI assistance.

<div style="text-align: center">⁂</div>

[^1]: README.md

[^2]: README.md

[^3]: README.md

