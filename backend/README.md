# Green Magic v2 - Backend API

A robust Node.js backend API built with Express.js, MongoDB, and comprehensive authentication system supporting both traditional email/password and Google OAuth authentication.

## 🏗️ Architecture Overview

### Technology Stack

- **Runtime:** Node.js with ES6 modules
- **Framework:** Express.js 5.1.0
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (Access + Refresh tokens) & Google OAuth
- **File Storage:** Cloudinary for image/file uploads
- **Security:** bcryptjs for password hashing, CORS enabled
- **Development:** Nodemon for hot reload, Prettier for code formatting

### Project Structure

```
backend/src/
├── app.js                 # Express app configuration
├── index.js              # Server entry point
├── constants.js          # Application constants
├── controllers/          # Request handlers
│   ├── googleAuth.controllers.js
│   ├── healthcheck.controllers.js
│   └── user.controllers.js
├── db/                   # Database configuration
│   └── index.js
├── middlewares/          # Custom middleware
│   ├── auth.middlewares.js
│   ├── error.middlewares.js
│   └── multer.middlewares.js
├── models/               # Database schemas
│   └── user.models.js
├── routes/               # API route definitions
│   ├── googleAuth.routes.js
│   ├── healthcheck.routes.js
│   └── user.routes.js
└── utils/                # Utility functions
    ├── ApiError.js
    ├── ApiResponse.js
    ├── asyncHandler.js
    ├── cloudinary.js
    └── google.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB instance (local or cloud)
- Cloudinary account for file uploads
- Google OAuth credentials

### Environment Variables

Create a `.env` file in the backend root directory:

```env
# Server Configuration
PORT=8001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/greenmagic

# CORS
CORS_ORIGIN=http://localhost:5173

# JWT Secrets
ACCESS_TOKEN_SECRET=your_access_token_secret_here
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
REFRESH_TOKEN_EXPIRES_IN=10d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

## 📊 Database Schema

### User Model

```javascript
{
  username: {
    type: String,
    required: function() { return !this.googleId; }, // Optional for Google users
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  fullname: {
    type: String,
    required: true
  },
  avatar: {
    type: String, // Cloudinary URL
    required: false
  },
  password: {
    type: String,
    required: function() { return !this.googleId; } // Optional for Google users
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  refreshToken: {
    type: String
  },
  timestamps: true // createdAt, updatedAt
}
```

## 🔐 Authentication System

### JWT Authentication

- **Access Token:** Short-lived (1 day) for API access
- **Refresh Token:** Long-lived (10 days) stored securely in httpOnly cookies
- **Password Security:** bcryptjs with salt rounds of 10

### Google OAuth Integration

- Seamless Google Sign-In flow
- Automatic user creation for new Google users
- No password required for Google authenticated users

### Token Management

```javascript
// Generate tokens
const { accessToken, refreshToken } =
  await generateAccessAndRefreshToken(userId);

// Verify JWT middleware
const verifyJWT = async (req, res, next) => {
  // Validates access token from cookies or Authorization header
};
```

## 🛠️ API Endpoints

### Base URL: `/api/v1`

### Health Check

```
GET /healthcheck
```

- **Description:** Server health status
- **Authentication:** None required
- **Response:** Service status information

### User Authentication

#### Register User

```
POST /users/register
```

- **Content-Type:** `multipart/form-data`
- **Body:**
  ```json
  {
    "fullname": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "password": "securePassword123"
  }
  ```
- **Files:** `avatar` (optional) - Image file for profile picture
- **Response:** User object (password excluded)

#### Login User

```
POST /users/login
```

- **Body:**
  ```json
  {
    "email": "john@example.com", // or username
    "password": "securePassword123"
  }
  ```
- **Response:** User object + tokens set in httpOnly cookies

#### Logout User

```
POST /users/logout
```

- **Authentication:** Required (JWT)
- **Response:** Success message, clears auth cookies

#### Get Current User

```
GET /users/current
```

- **Authentication:** Required (JWT)
- **Response:** Current authenticated user object

#### Refresh Access Token

```
POST /users/refresh-token
```

- **Authentication:** Refresh token in cookies
- **Response:** New access and refresh tokens

### Google Authentication

#### Google Sign-In

```
POST /users/google-signin
```

- **Body:**
  ```json
  {
    "accessToken": "google_access_token_here"
  }
  ```
- **Response:** User object + JWT tokens

#### Force Logout

```
POST /users/force-logout
```

- **Description:** Logout from all devices
- **Authentication:** Required (JWT)
- **Response:** Success message

## 🔧 Middleware

### Authentication Middleware (`auth.middlewares.js`)

- Validates JWT tokens
- Extracts user information from tokens
- Protects secured routes

### Error Handling Middleware (`error.middlewares.js`)

- Global error handler
- Standardized error responses
- Development vs production error details

### File Upload Middleware (`multer.middlewares.js`)

- Handles multipart/form-data
- Temporary file storage before Cloudinary upload
- File size and type validation

## ☁️ File Upload System

### Cloudinary Integration

- **Automatic Upload:** Files uploaded to Cloudinary after validation
- **Cleanup:** Local files deleted after successful upload
- **Error Handling:** Rollback on upload failures
- **Supported Formats:** Auto-detection of file types

### Upload Flow

1. Client uploads file via multipart form
2. Multer saves file temporarily
3. Cloudinary processes and stores file
4. Local temporary file is deleted
5. Cloudinary URL stored in database

## 🔒 Security Features

### CORS Configuration

```javascript
cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
});
```

### Security Best Practices

- Password hashing with bcryptjs
- HttpOnly cookies for token storage
- Environment-based configuration
- Input validation and sanitization
- Structured error handling

## 🚦 Error Handling

### ApiError Class

```javascript
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    // Custom error class for consistent error responses
  }
}
```

### ApiResponse Class

```javascript
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    // Standardized success response format
  }
}
```

## 🧪 Development Tools

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- Code formatting with Prettier

### Development Features

- Hot reload with nodemon
- Detailed error logging in development
- Environment-based configuration
- MongoDB connection retry logic

## 📝 API Response Format

### Success Response

```json
{
  "statusCode": 200,
  "data": {
    // Response data here
  },
  "message": "Success message",
  "success": true
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Error message",
  "success": false,
  "errors": [] // Additional error details if available
}
```

## 🔄 Authentication Flow

1. **Registration:** User creates account with email/username + password
2. **Login:** Credentials validation + JWT token generation
3. **Token Storage:** Tokens stored in httpOnly cookies
4. **API Access:** Access token validates protected routes
5. **Token Refresh:** Automatic token renewal using refresh token
6. **Logout:** Token invalidation and cookie clearing

## 🌐 Google OAuth Flow

1. **Frontend:** User initiates Google Sign-In
2. **Google:** Returns access token to frontend
3. **Backend:** Validates token with Google APIs
4. **User Creation:** Auto-creates user if first time
5. **JWT Generation:** Issues custom JWT tokens
6. **Session:** User authenticated with backend tokens

## 📦 Dependencies

### Production Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT implementation
- `bcryptjs` - Password hashing
- `cloudinary` - File upload service
- `google-auth-library` - Google OAuth validation
- `cors` - Cross-origin resource sharing
- `cookie-parser` - Cookie parsing middleware
- `multer` - File upload handling
- `dotenv` - Environment variable management

### Development Dependencies

- `nodemon` - Development server
- `prettier` - Code formatting

This backend provides a solid foundation for a modern web application with robust authentication, file handling, and scalable architecture.
