# 🌿 Green Magic v2

A modern, full-stack web application for natural products e-commerce built with React frontend and Node.js backend, featuring comprehensive authentication, file uploads, and a beautiful user experience focused on sustainable living.

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Development Setup](#-development-setup)
- [API Documentation](#-api-documentation)
- [Frontend Architecture](#-frontend-architecture)
- [Backend Architecture](#-backend-architecture)
- [Authentication Flow](#-authentication-flow)
- [Environment Configuration](#-environment-configuration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## 🎯 Project Overview

Green Magic v2 is a complete e-commerce platform specializing in natural and eco-friendly products. The application provides a seamless shopping experience with modern authentication, secure file handling, and responsive design optimized for all devices.

### Key Highlights

- **Full-Stack Architecture:** React frontend with Express.js backend
- **Dual Authentication:** Traditional email/password + Google OAuth
- **File Upload System:** Cloudinary integration for avatars and product images
- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Secure API:** JWT tokens with automatic refresh mechanism
- **Modern Development:** ES6 modules, Vite bundling, hot reload

## 🚀 Technology Stack

### Frontend

- **Framework:** React 18 with modern hooks and context
- **Build Tool:** Vite for fast development and optimized builds
- **Styling:** Tailwind CSS with custom color themes
- **Routing:** React Router v6 with protected routes
- **Forms:** React Hook Form with validation
- **HTTP Client:** Axios with automatic token refresh
- **UI Components:** Lucide React icons, React Hot Toast notifications
- **Authentication:** Google OAuth integration (@react-oauth/google)

### Backend

- **Runtime:** Node.js with ES6 modules
- **Framework:** Express.js 5.1.0
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (Access + Refresh tokens) + Google OAuth
- **File Storage:** Cloudinary for image uploads
- **Security:** bcryptjs, CORS, HTTP-only cookies
- **Development:** Nodemon, Prettier code formatting

## 📁 Project Structure

```
green-magic-v2/
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── models/            # Database schemas
│   │   ├── routes/            # API endpoints
│   │   ├── middlewares/       # Auth, error handling
│   │   ├── utils/             # Helper functions
│   │   ├── db/                # Database configuration
│   │   ├── app.js             # Express app setup
│   │   └── index.js           # Server entry point
│   ├── package.json
│   └── README.md              # Backend documentation
├── frontent/                   # React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Route components
│   │   ├── context/           # React context providers
│   │   ├── services/          # API communication
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Application entry point
│   ├── package.json
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind customization
│   └── README.md              # Frontend documentation
└── README.md                  # This file
```

## ✨ Features

### 🔐 Authentication & Security

- **User Registration:** Email/username with avatar upload
- **User Login:** Secure authentication with session management
- **Google OAuth:** One-click Google Sign-In integration
- **JWT Tokens:** Access tokens (1 day) + Refresh tokens (10 days)
- **Automatic Refresh:** Seamless token renewal without user interaction
- **Protected Routes:** Frontend route protection based on auth status
- **Secure Cookies:** HTTP-only cookies for token storage

### 👤 User Management

- **Profile Creation:** Full name, email, username, avatar
- **Avatar Upload:** Cloudinary integration with automatic optimization
- **Current User API:** Get authenticated user information
- **Force Logout:** Logout from all devices functionality

### 🎨 User Interface

- **Responsive Design:** Mobile-first approach for all screen sizes
- **Natural Theme:** Green/yellow color scheme representing eco-friendliness
- **Modern Typography:** Inter and Poppins fonts for readability
- **Smooth Animations:** Hover effects and transitions
- **Loading States:** Professional loading spinners and feedback
- **Toast Notifications:** Success/error messages for user actions

### 📱 Pages & Components

- **Home Page:** Hero section, features showcase, testimonials
- **About Page:** Company story, values, team information
- **Products Page:** Protected product catalog (requires authentication)
- **Contact Page:** Contact form with validation
- **Auth Pages:** Login and registration with form validation
- **Layout Components:** Navigation, footer, loading spinners

### 🛠 Technical Features

- **API Proxy:** Vite development proxy for seamless API calls
- **Error Handling:** Global error boundaries and API error management
- **Form Validation:** React Hook Form with custom validation rules
- **File Upload:** Multer middleware with Cloudinary storage
- **CORS Configuration:** Secure cross-origin resource sharing
- **Environment Config:** Separate development/production configurations

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- MongoDB instance (local or cloud)
- Cloudinary account for file uploads
- Google OAuth credentials (optional)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd green-magic-v2
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure environment variables
   npm run dev
   ```

3. **Frontend Setup**

   ```bash
   cd frontent
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8001

## 🔧 Development Setup

### Backend Development

```bash
cd backend
npm install
npm run dev          # Start with nodemon (hot reload)
npm start           # Production start
```

### Frontend Development

```bash
cd frontent
npm install
npm run dev         # Start development server (http://localhost:3000)
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run ESLint
```

## 📡 API Documentation

### Base URL: `http://localhost:8001/api/v1`

### Authentication Endpoints

| Method | Endpoint               | Description          | Auth Required |
| ------ | ---------------------- | -------------------- | ------------- |
| POST   | `/users/register`      | Register new user    | ❌            |
| POST   | `/users/login`         | User login           | ❌            |
| POST   | `/users/logout`        | User logout          | ✅            |
| GET    | `/users/current`       | Get current user     | ✅            |
| POST   | `/users/refresh-token` | Refresh access token | ✅            |
| POST   | `/users/google-signin` | Google OAuth login   | ❌            |
| POST   | `/users/force-logout`  | Logout all devices   | ✅            |

### Health Check

| Method | Endpoint       | Description          | Auth Required |
| ------ | -------------- | -------------------- | ------------- |
| GET    | `/healthcheck` | Server health status | ❌            |

For detailed API documentation, see [Backend README](./backend/README.md).

## 🏗 Frontend Architecture

### Component Structure

```
src/components/
├── common/
│   └── LoadingSpinner.jsx     # Reusable loading component
└── layout/
    ├── Navbar.jsx             # Navigation header
    └── Footer.jsx             # Site footer
```

### Page Components

```
src/pages/
├── HomePage.jsx               # Landing page
├── AboutPage.jsx              # About company
├── ProductsPage.jsx           # Protected products page
├── ContactPage.jsx            # Contact form
└── auth/
    ├── LoginPage.jsx          # User login
    └── RegisterPage.jsx       # User registration
```

### State Management

- **AuthContext:** Global authentication state management
- **React Router:** Client-side routing with route protection
- **Local Storage:** Authentication state persistence

### API Communication

- **apiClient:** Configured Axios instance with interceptors
- **authService:** Authentication-related API calls
- **Automatic Refresh:** Token refresh on 401 responses

## 🏗 Backend Architecture

### API Structure

- **Controllers:** Business logic and request handling
- **Models:** MongoDB schemas with Mongoose
- **Routes:** API endpoint definitions
- **Middlewares:** Authentication, error handling, file upload
- **Utils:** Helper functions for errors, responses, file upload

### Database Design

- **User Model:** Authentication, profile, file references
- **MongoDB:** NoSQL database with Mongoose ODM
- **Indexing:** Optimized queries for email, username lookups

### Security Implementation

- **Password Hashing:** bcryptjs with 10 salt rounds
- **JWT Tokens:** Separate access and refresh tokens
- **CORS Policy:** Configured for frontend domain
- **Input Validation:** Request validation and sanitization

## 🔄 Authentication Flow

### Registration Flow

1. User submits registration form with optional avatar
2. Backend validates input and checks for existing users
3. Avatar uploaded to Cloudinary (if provided)
4. Password hashed with bcryptjs
5. User created in MongoDB
6. Success response sent to frontend

### Login Flow

1. User submits email/username and password
2. Backend validates credentials
3. JWT access and refresh tokens generated
4. Tokens stored in HTTP-only cookies
5. User redirected to protected products page

### Token Refresh Flow

1. Frontend API call receives 401 response
2. Axios interceptor automatically calls refresh endpoint
3. New tokens generated and stored
4. Original request retried with new tokens
5. Seamless experience for the user

### Google OAuth Flow

1. User initiates Google Sign-In on frontend
2. Google returns access token to frontend
3. Frontend sends token to backend for validation
4. Backend validates with Google APIs
5. User auto-created if first time
6. Custom JWT tokens issued for session management

## ⚙️ Environment Configuration

### Backend Environment Variables (.env)

```env
# Server
PORT=8001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/greenmagic

# JWT Secrets
ACCESS_TOKEN_SECRET=your_secret_here
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_SECRET=your_refresh_secret_here
REFRESH_TOKEN_EXPIRES_IN=10d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Frontend Environment Variables (.env)

```env
VITE_API_BASE_URL=http://localhost:8001/api/v1
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

## 🚀 Deployment

### Backend Deployment

1. Set production environment variables
2. Configure MongoDB connection string
3. Set up Cloudinary for file storage
4. Deploy to service like Railway, Heroku, or AWS
5. Configure CORS for production domain

### Frontend Deployment

1. Update API base URL for production
2. Build production bundle: `npm run build`
3. Deploy to Vercel, Netlify, or similar
4. Configure environment variables in deployment platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m 'Add new feature'`
5. Push to your branch: `git push origin feature/new-feature`
6. Open a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Add tests for new features
- Update documentation for API changes
- Ensure responsive design for frontend changes
- Test authentication flows thoroughly

## 📚 Additional Documentation

- [Backend API Documentation](./backend/README.md) - Detailed backend setup and API reference
- [Frontend Documentation](./frontent/README.md) - React app setup and component guide

## 📄 License

This project is private and proprietary. All rights reserved.

---

**Green Magic v2** - Building a sustainable future, one natural product at a time. 🌱
