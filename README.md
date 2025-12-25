# Water Usage Optimization Dashboard

A production-grade full-stack web application for farmers to track water usage, optimize irrigation, and reduce wastage. Built with React (Vite), Express.js, MongoDB, and Redux Toolkit.

## 📋 Complete Project Structure

```
water-dashboard/
├── backend/
│   ├── config/
│   │   ├── constants.js          # App-wide constants & thresholds
│   │   └── database.js           # MongoDB connection setup
│   │
│   ├── controllers/
│   │   ├── authController.js     # Signup, login logic
│   │   ├── userController.js     # User profile, admin user listing
│   │   └── waterUsageController.js  # Water logging, analytics
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role checking
│   │   └── errorHandler.js       # Centralized error handling
│   │
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt password hashing
│   │   └── WaterUsage.js         # Water usage schema with indexes
│   │
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── userRoutes.js         # User endpoints
│   │   └── waterUsageRoutes.js   # Water usage endpoints
│   │
│   ├── utils/
│   │   ├── tokenUtils.js         # JWT token generation & verification
│   │   └── analyticsUtils.js     # Analytics calculation logic
│   │
│   ├── .env                      # Environment variables
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express app & server startup

└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx         # Top navigation with user info
    │   │   ├── Sidebar.jsx        # Role-based navigation menu
    │   │   ├── StatCard.jsx       # Reusable metric card component
    │   │   ├── Alert.jsx          # Alert notification component
    │   │   ├── FormElements.jsx   # Button, Input, Select components
    │   │   └── ProtectedRoute.jsx # Route protection logic
    │   │
    │   ├── layouts/
    │   │   ├── PublicLayout.jsx   # Login/Signup page layout
    │   │   ├── FarmerLayout.jsx   # Farmer dashboard layout
    │   │   └── AdminLayout.jsx    # Admin dashboard layout
    │   │
    │   ├── pages/
    │   │   ├── LoginPage.jsx      # Login form
    │   │   ├── SignupPage.jsx     # Registration form
    │   │   ├── FarmerDashboard.jsx    # Farmer home dashboard
    │   │   ├── WaterLogPage.jsx   # Add water usage logs
    │   │   ├── AnalyticsPage.jsx  # Detailed analytics charts
    │   │   ├── ProfilePage.jsx    # User profile editor
    │   │   ├── AdminDashboard.jsx # Admin overview
    │   │   └── AdminFarmersPage.jsx   # Farmers list directory
    │   │
    │   ├── services/
    │   │   ├── api.js             # Axios config with interceptors
    │   │   └── apiServices.js     # API endpoint functions
    │   │
    │   ├── slices/
    │   │   ├── authSlice.js       # Auth state (login, signup, token)
    │   │   ├── userSlice.js       # User state (profile, users list)
    │   │   └── waterUsageSlice.js # Water usage state (logs, analytics)
    │   │
    │   ├── utils/
    │   │   └── helpers.js         # Date, number formatting utilities
    │   │
    │   ├── assets/                # Images, icons, fonts
    │   ├── store.js               # Redux store configuration
    │   ├── App.jsx                # Main app & routing
    │   ├── main.jsx               # React entry point
    │   └── index.css              # Global styles + Tailwind
    │
    ├── public/                    # Static files
    ├── index.html                 # HTML entry point
    ├── package.json               # Frontend dependencies
    ├── vite.config.js             # Vite build config
    ├── tailwind.config.js         # Tailwind CSS config
    └── postcss.config.js          # PostCSS config

```

---

## 🔐 Backend Architecture

### Models

#### User Schema
```javascript
{
  name: String (required, 2+ chars),
  email: String (required, unique, email format),
  password: String (hashed with bcrypt),
  phone: String (required, 10 digits),
  location: String (required),
  role: 'farmer' | 'admin' (default: farmer),
  state: String,
  district: String,
  farmSize: Number (acres),
  isActive: Boolean (default: true),
  timestamps: { createdAt, updatedAt }
}
```

**Password Handling:**
- Automatically hashed before saving using bcryptjs (10 rounds)
- `matchPassword()` method for login verification
- Password field excluded from default queries (select: false)

#### WaterUsage Schema
```javascript
{
  farmer: ObjectId (ref User, required),
  source: 'borewell' | 'canal' | 'rain' | 'well' | 'other',
  usageAmount: Number (liters, required, min 1),
  date: Date (required),
  cropType: String (rice, wheat, sugarcane, cotton, maize, etc.),
  areaIrrigated: Number (acres, required, min 0.1),
  notes: String,
  weatherCondition: 'sunny' | 'cloudy' | 'rainy' | 'partly_cloudy',
  efficiency: Number (liters per acre, calculated),
  timestamps: { createdAt, updatedAt }
}
```

**Indexes:** farmer + date for fast queries

### API Endpoints

#### Authentication Routes
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Get JWT token

#### User Routes (Protected)
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users` (Admin only) - List all users with filters

#### Water Usage Routes (Protected)
- `POST /api/water-usage` (Farmer) - Log water usage
- `GET /api/water-usage/my` (Farmer) - Get personal logs with pagination
- `GET /api/water-usage/analytics/my` (Farmer) - Get personal analytics
- `GET /api/water-usage` (Admin) - Get all logs with pagination
- `GET /api/water-usage/analytics/system` (Admin) - System-wide analytics

### Authentication Flow

1. **Signup/Login** → Generate JWT token containing `{ id, role }`
2. **Token Storage** → Saved in localStorage and Redux state
3. **Protected Routes** → `verifyToken` middleware checks Authorization header
4. **Role-Based Access** → `requireRole([ROLES])` middleware validates permissions
5. **Token Expiry** → Configured via `JWT_EXPIRE` (default: 7d)

### Analytics Logic

**Calculated Metrics:**
- Total usage (all time)
- Daily/Weekly/Monthly breakdown
- Average daily usage across all logs
- Efficiency (liters per acre)
- Source distribution (borewell, canal, etc.)
- Crop-wise breakdown

**Alerts Generated:**
- Daily usage > 10,000L → Critical alert
- Daily usage > 5,000L → Warning
- Weekly usage > 30,000L → Warning

**Suggestions:**
- If borewell > 60% usage → Suggest alternative sources
- Water-intensive crops (rice, sugarcane) → Recommend crop diversification
- Default → Positive reinforcement

---

## ⚛️ Frontend Architecture

### State Management (Redux Toolkit)

#### authSlice
```javascript
{
  token: string | null,
  user: { id, name, email, role, phone, location },
  loading: boolean,
  error: string | null,
  isAuthenticated: boolean
}
```
**Async Thunks:** `signup()`, `login()`

#### userSlice
```javascript
{
  user: { ...user fields },
  users: [],
  loading: boolean,
  error: string | null,
  pagination: { page, limit, total, pages }
}
```
**Async Thunks:** `fetchCurrentUser()`, `updateUserProfile()`, `fetchAllUsers()`

#### waterUsageSlice
```javascript
{
  usages: [],
  analytics: {
    totalUsage, averageDailyUsage, dailyUsage, weeklyUsage, monthlyUsage,
    alerts: [{ level, message }],
    suggestions: [{ type, message, priority }],
    sourceBreakdown: {},
    cropBreakdown: {}
  },
  systemAnalytics: { ... },
  loading: boolean,
  error: string | null,
  pagination: { ... }
}
```
**Async Thunks:** `addWaterUsage()`, `fetchMyUsage()`, `fetchAnalytics()`, `fetchSystemAnalytics()`

### API Service Layer

**Axios Configuration:**
- Base URL: `http://localhost:5000/api`
- Request interceptor: Adds `Authorization: Bearer <token>` header
- Response interceptor: Auto-logout on 401 (token expired)
- Error handling: Centralized with user-friendly messages

**API Services:**
```javascript
authAPI.signup(data)
authAPI.login(data)

userAPI.getCurrentUser()
userAPI.updateProfile(data)
userAPI.getAllUsers(params)

waterUsageAPI.addUsage(data)
waterUsageAPI.getMyUsage(params)
waterUsageAPI.getAnalytics(params)
waterUsageAPI.getAllUsage(params)
waterUsageAPI.getSystemAnalytics()
```

### Routing Architecture

**Public Routes:**
- `/login` - Login page
- `/signup` - Registration page

**Farmer Routes (Protected):**
- `/farmer/dashboard` - Home with quick stats
- `/farmer/water-log` - Add new water usage log
- `/farmer/analytics` - Detailed analytics & charts
- `/farmer/profile` - Edit profile information

**Admin Routes (Protected):**
- `/admin/dashboard` - System overview & inefficiencies
- `/admin/farmers` - Directory of all farmers
- `/admin/analytics` - System-wide water usage analytics

**Root Route:**
- `/` - Redirects based on auth status and role

### Component Hierarchy

```
App (routing + auth check)
├── PublicLayout
│   ├── LoginPage
│   └── SignupPage
├── FarmerLayout
│   ├── Header
│   ├── Sidebar
│   └── Outlet (routed pages)
│       ├── FarmerDashboard
│       ├── WaterLogPage
│       ├── AnalyticsPage
│       └── ProfilePage
└── AdminLayout
    ├── Header
    ├── Sidebar
    └── Outlet (routed pages)
        ├── AdminDashboard
        ├── AdminFarmersPage
        └── AnalyticsPage
```

---

## 📊 Data Flow Diagram

### User Registration Flow
```
SignupPage (form input)
    ↓
dispatch(signup(formData))
    ↓
Axios POST /api/auth/signup
    ↓
Backend: authController.signup()
    ↓
User.create() → MongoDB insert
    ↓
generateToken(id, role)
    ↓
Response: { token, user data }
    ↓
Redux: authSlice.fulfilled → store token + user
    ↓
localStorage.setItem(token, user)
    ↓
Navigate to /farmer/dashboard
```

### Water Usage Logging Flow
```
WaterLogPage (form with date, source, amount, etc.)
    ↓
dispatch(addWaterUsage(formData))
    ↓
Request interceptor: adds Authorization header
    ↓
Axios POST /api/water-usage
    ↓
Backend: authMiddleware.verifyToken() → validates JWT
    ↓
waterUsageController.addWaterUsage()
    ↓
Calculates efficiency = amount / area
    ↓
WaterUsage.create() → MongoDB insert
    ↓
Response: { success, data }
    ↓
Redux: waterUsageSlice.fulfilled
    ↓
UI updates: show success message, reset form
```

### Analytics Calculation Flow
```
FarmerDashboard mounted
    ↓
dispatch(fetchAnalytics({ period: 'all' }))
    ↓
Axios GET /api/water-usage/analytics/my?period=all
    ↓
Backend: waterUsageController.getAnalytics()
    ↓
WaterUsage.find({ farmer: req.user.id })
    ↓
analyticsUtils.calculateAnalytics(usages)
    ├─ Separate logs by: today, week, month, all-time
    ├─ Sum amounts for each period
    ├─ Check against thresholds
    ├─ Generate alerts if thresholds exceeded
    ├─ Calculate source & crop breakdowns
    └─ Generate suggestions based on patterns
    ↓
Response: { totalUsage, alerts, suggestions, ... }
    ↓
Redux: waterUsageSlice.fulfilled
    ↓
Component renders: StatCards, Alerts, Suggestions
```

---

## 🔒 Role-Based Access Control

### Farmer Permissions
- ✅ View own profile
- ✅ Add water usage logs
- ✅ View own analytics
- ✅ Update own profile
- ❌ View other farmers' data
- ❌ View system-wide analytics

### Admin Permissions
- ✅ View all farmers
- ✅ View all water usage logs
- ✅ View system analytics
- ✅ Identify inefficient farmers
- ✅ Monitor system health
- ❌ Modify farmer data (read-only)

### Implementation
```javascript
// Backend Middleware
requireRole(['farmer', 'admin']) // 🚫 Blocks unauthorized access

// Frontend Protection
<ProtectedRoute requiredRole='farmer'>
  <FarmerLayout />
</ProtectedRoute>

// API Interceptor
if (401) → dispatch(logout()) → redirect to login
```

---

## ⚙️ Setup & Installation

### Backend Setup
```bash
cd backend
npm install

# Configure .env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/water-dashboard
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10

# Start server (requires MongoDB running)
npm run dev  # with nodemon
npm start    # production
```

### Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm run dev   # runs on http://localhost:5173

# Build for production
npm run build
npm run preview
```

---

## 🔌 Key Features

### For Farmers
- 📊 Real-time dashboard with water usage stats
- 📝 Easy-to-use water logging interface
- 📈 Detailed analytics with source breakdown
- 💡 Smart suggestions for water conservation
- ⚠️ Alerts for excessive water usage
- 👤 Profile management with farm details

### For Admins
- 👥 Monitor all farmers and their data
- 📊 System-wide analytics and statistics
- 🚨 Identify inefficient farmers
- 📉 Track water source distribution
- 📋 Farmer directory with filtering

---

## 🛠️ Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 | UI framework |
| | Vite | Build tool (fast refresh) |
| | Redux Toolkit | State management |
| | Axios | HTTP client |
| | Tailwind CSS | Styling |
| | React Router | Navigation |
| **Backend** | Node.js | Runtime |
| | Express | API framework |
| | MongoDB | Database |
| | Mongoose | ODM |
| | JWT | Authentication |
| | bcryptjs | Password hashing |
| | Morgan | HTTP logging |

---

## 📝 Production Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Configure MONGODB_URI for production database
- [ ] Enable HTTPS for all API calls
- [ ] Set NODE_ENV=production
- [ ] Configure CORS origins for frontend domain
- [ ] Enable rate limiting on API endpoints
- [ ] Add request validation (joi/express-validator)
- [ ] Implement API versioning (/v1/api/...)
- [ ] Add request logging to file system
- [ ] Set up environment-specific configs
- [ ] Add health checks for monitoring
- [ ] Implement data backup strategy
- [ ] Add email verification for signup
- [ ] Implement password reset flow

---

This is a **production-ready** full-stack application with clean architecture, comprehensive error handling, role-based access control, and scalable design patterns.
