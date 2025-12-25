# 🌾 Water Usage Optimization Dashboard - Complete Architecture Guide

## Executive Summary

This is a **production-grade full-stack web application** designed for farmers to optimize water usage in agriculture. The system provides real-time tracking, analytics, and intelligent suggestions to reduce water wastage.

**Tech Stack:** React (Vite) + Redux Toolkit + Express.js + MongoDB + JWT Authentication

---

## 📁 FOLDER STRUCTURE - COMPLETE BREAKDOWN

### Backend Structure (Node.js/Express)

```
backend/
│
├── config/
│   ├── constants.js          ← App-wide enums & thresholds
│   │   ├── ROLES: { FARMER, ADMIN }
│   │   ├── WATER_SOURCES: { BOREWELL, CANAL, RAIN, WELL, OTHER }
│   │   ├── CROP_TYPES: [rice, wheat, sugarcane, ...]
│   │   ├── HTTP_STATUS codes
│   │   ├── ERROR_MESSAGES
│   │   └── WATER_USAGE_THRESHOLDS
│   │
│   └── database.js           ← MongoDB connection
│       └── connectDB() → mongoose.connect()
│
├── controllers/              ← Business logic layer
│   ├── authController.js
│   │   ├── signup(req, res, next)
│   │   │   ├─ Validate email uniqueness
│   │   │   ├─ Hash password (bcryptjs)
│   │   │   ├─ Create user in DB
│   │   │   └─ Generate JWT token
│   │   │
│   │   └── login(req, res, next)
│   │       ├─ Find user by email
│   │       ├─ Compare password hash
│   │       ├─ Generate JWT token
│   │       └─ Return token + user data
│   │
│   ├── userController.js
│   │   ├── getCurrentUser(req, res, next)
│   │   │   └─ Fetch user by req.user.id (from JWT)
│   │   │
│   │   ├── updateProfile(req, res, next)
│   │   │   └─ Update name, phone, location, farm size
│   │   │
│   │   └── getAllUsers(req, res, next)  [Admin only]
│   │       ├─ Support pagination
│   │       ├─ Support role filtering
│   │       └─ Support search by name/email/location
│   │
│   └── waterUsageController.js
│       ├── addWaterUsage(req, res, next)
│       │   ├─ Calculate efficiency (L/acre)
│       │   ├─ Validate required fields
│       │   └─ Store in DB with farmer ID
│       │
│       ├── getMyWaterUsage(req, res, next)
│       │   ├─ Pagination support
│       │   ├─ Date range filtering
│       │   └─ Return paginated results
│       │
│       ├── getAnalytics(req, res, next)  [Farmer]
│       │   ├─ Call calculateAnalytics()
│       │   ├─ Generate breakdown by source & crop
│       │   └─ Return alerts & suggestions
│       │
│       ├── getAllWaterUsage(req, res, next)  [Admin]
│       │   └─ List all logs with farmer info
│       │
│       └── getSystemAnalytics(req, res, next)  [Admin]
│           ├─ Total usage across all farmers
│           ├─ Average per farmer
│           ├─ Source distribution
│           └─ Identify inefficiencies
│
├── middleware/
│   ├── authMiddleware.js
│   │   ├── verifyToken()
│   │   │   ├─ Extract token from Authorization header
│   │   │   ├─ Verify JWT signature
│   │   │   ├─ Attach decoded payload to req.user
│   │   │   └─ Return 401 if invalid
│   │   │
│   │   └── requireRole([FARMER, ADMIN])
│   │       ├─ Check if req.user.role in allowed list
│   │       └─ Return 403 if unauthorized
│   │
│   └── errorHandler.js
│       ├─ Catch all errors globally
│       ├─ Handle ValidationError (mongoose)
│       ├─ Handle CastError (invalid ObjectId)
│       ├─ Handle duplicate key (email)
│       └─ Return consistent error response
│
├── models/
│   ├── User.js
│   │   ├── name: String (required)
│   │   ├── email: String (unique, required)
│   │   ├── password: String (hashed, select: false)
│   │   ├── phone: String (10 digits)
│   │   ├── location: String
│   │   ├── role: 'farmer' | 'admin'
│   │   ├── state, district, farmSize: optional
│   │   ├── isActive: Boolean
│   │   ├── pre('save') hook: hash password
│   │   └── matchPassword(): compare hashed password
│   │
│   └── WaterUsage.js
│       ├── farmer: ObjectId (ref User)
│       ├── source: 'borewell' | 'canal' | 'rain' | ...
│       ├── usageAmount: Number (liters)
│       ├── date: Date
│       ├── cropType: String (enum)
│       ├── areaIrrigated: Number (acres)
│       ├── weatherCondition: String
│       ├── efficiency: Number (calculated L/acre)
│       ├── notes: String
│       ├── Indexes: [farmer, date] for fast queries
│       └── timestamps: createdAt, updatedAt
│
├── routes/
│   ├── authRoutes.js
│   │   ├── POST /api/auth/signup
│   │   └── POST /api/auth/login
│   │
│   ├── userRoutes.js
│   │   ├── GET /api/users/me            [Protected]
│   │   ├── PUT /api/users/me            [Protected]
│   │   └── GET /api/users               [Admin only]
│   │
│   └── waterUsageRoutes.js
│       ├── POST /api/water-usage        [Farmer only]
│       ├── GET /api/water-usage/my      [Farmer only]
│       ├── GET /api/water-usage/analytics/my  [Farmer]
│       ├── GET /api/water-usage         [Admin only]
│       └── GET /api/water-usage/analytics/system  [Admin]
│
├── utils/
│   ├── tokenUtils.js
│   │   ├── generateToken(userId, role)
│   │   │   └─ Create JWT with 7d expiry
│   │   │
│   │   └── verifyTokenUtil(token)
│   │       └─ Decode and validate JWT
│   │
│   └── analyticsUtils.js
│       ├── calculateAnalytics(waterUsages[])
│       │   ├─ Separate logs: today/week/month/all
│       │   ├─ Sum usage per period
│       │   ├─ Check against thresholds
│       │   ├─ Generate alerts if exceeded
│       │   ├─ Calculate source breakdown
│       │   └─ Return { totalUsage, alerts, suggestions }
│       │
│       └── generateSuggestions(usages, weeklyUsage)
│           ├─ Detect heavy borewell usage → suggest alternatives
│           ├─ Identify water-intensive crops → diversify
│           └─ Praise if efficiency is good
│
├── .env                     ← Environment variables (git ignored)
├── package.json             ← Dependencies: express, mongoose, jwt, bcrypt, morgan
└── server.js                ← Express app setup & port listening
    ├─ connectDB()
    ├─ middleware: cors, morgan, json
    ├─ Mount routes
    ├─ Error handler
    └─ listen(5000)
```

### Frontend Structure (React/Vite)

```
frontend/
│
├── src/
│   │
│   ├── components/
│   │   ├── Header.jsx
│   │   │   ├─ Display user name & role
│   │   │   ├─ Logout button
│   │   │   └─ Mobile menu toggle
│   │   │
│   │   ├── Sidebar.jsx
│   │   │   ├─ Role-based menu items
│   │   │   │   ├─ Farmer: Dashboard, Water Log, Analytics, Profile
│   │   │   │   └─ Admin: Dashboard, Farmers, Analytics
│   │   │   ├─ Active route highlighting
│   │   │   └─ Mobile collapse/expand
│   │   │
│   │   ├── StatCard.jsx
│   │   │   ├─ Reusable metric display
│   │   │   ├─ Icon, value, title
│   │   │   ├─ Color variants (green, red, blue, yellow)
│   │   │   └─ Optional trend indicator
│   │   │
│   │   ├── Alert.jsx
│   │   │   ├─ Type: info, success, warning, error
│   │   │   ├─ Message + optional title
│   │   │   ├─ Close button
│   │   │   └─ Color-coded styling
│   │   │
│   │   ├── FormElements.jsx
│   │   │   ├── Button (variant, size, disabled states)
│   │   │   ├── Input (label, error display, validation)
│   │   │   ├── Select (dropdown)
│   │   │   └── Textarea
│   │   │
│   │   └── ProtectedRoute.jsx
│   │       ├─ Check if authenticated
│   │       ├─ Check if role matches required role
│   │       └─ Redirect to login if unauthorized
│   │
│   ├── layouts/
│   │   ├── PublicLayout.jsx
│   │   │   └─ No sidebar, just main content
│   │   │
│   │   ├── FarmerLayout.jsx
│   │   │   ├─ Header + Sidebar + Outlet
│   │   │   ├─ Mobile sidebar toggle state
│   │   │   └─ Responsive design
│   │   │
│   │   └── AdminLayout.jsx
│   │       └─ Same as FarmerLayout (different sidebar items)
│   │
│   ├── pages/
│   │   ├── LoginPage.jsx
│   │   │   ├─ Email + password form
│   │   │   ├─ Error alert display
│   │   │   ├─ Loading state on button
│   │   │   ├─ dispatch(login()) thunk
│   │   │   ├─ Navigate to /farmer/dashboard on success
│   │   │   └─ Link to signup
│   │   │
│   │   ├── SignupPage.jsx
│   │   │   ├─ Full form: name, email, password, phone, location
│   │   │   ├─ Input validation
│   │   │   ├─ dispatch(signup()) thunk
│   │   │   ├─ Navigate to dashboard on success
│   │   │   └─ Link to login
│   │   │
│   │   ├── FarmerDashboard.jsx
│   │   │   ├─ useEffect: dispatch(fetchAnalytics())
│   │   │   ├─ Grid of StatCards: Total, Daily Avg, Today, Weekly
│   │   │   ├─ Alert boxes if thresholds exceeded
│   │   │   ├─ Suggestions cards
│   │   │   └─ Color coding: green/yellow/red based on values
│   │   │
│   │   ├── WaterLogPage.jsx
│   │   │   ├─ Form with fields:
│   │   │   │   ├─ source (dropdown)
│   │   │   │   ├─ usageAmount (number)
│   │   │   │   ├─ date (date picker)
│   │   │   │   ├─ cropType (dropdown)
│   │   │   │   ├─ areaIrrigated (number)
│   │   │   │   ├─ weatherCondition (dropdown)
│   │   │   │   └─ notes (textarea)
│   │   │   ├─ dispatch(addWaterUsage()) on submit
│   │   │   ├─ Show success message
│   │   │   └─ Reset form after submit
│   │   │
│   │   ├── AnalyticsPage.jsx
│   │   │   ├─ useEffect: dispatch(fetchAnalytics())
│   │   │   ├─ Display total, monthly, efficiency stats
│   │   │   ├─ Source distribution bar chart
│   │   │   ├─ Crop-wise usage table
│   │   │   └─ Responsive table layout
│   │   │
│   │   ├── ProfilePage.jsx
│   │   │   ├─ useEffect: dispatch(fetchCurrentUser())
│   │   │   ├─ Form fields: name, phone, location, state, district, farmSize
│   │   │   ├─ Email field (read-only)
│   │   │   ├─ dispatch(updateUserProfile()) on submit
│   │   │   └─ Success message
│   │   │
│   │   ├── AdminDashboard.jsx
│   │   │   ├─ useEffect: dispatch(fetchSystemAnalytics())
│   │   │   ├─ StatCards: Farmer count, total usage, avg per farmer, inefficiencies
│   │   │   ├─ Source distribution breakdown
│   │   │   ├─ Flagged inefficiencies table
│   │   │   └─ Severity badges (high/medium)
│   │   │
│   │   └── AdminFarmersPage.jsx
│   │       ├─ useEffect: dispatch(fetchAllUsers({ role: 'farmer' }))
│   │       ├─ Table with columns: name, email, phone, location, farmSize, joined
│   │       ├─ Pagination info
│   │       └─ Search/filter support (future)
│   │
│   ├── services/
│   │   ├── api.js
│   │   │   ├─ Create axios instance with baseURL
│   │   │   ├─ Request interceptor:
│   │   │   │   └─ Add Authorization header with token from Redux
│   │   │   │
│   │   │   └─ Response interceptor:
│   │   │       ├─ Auto-logout on 401 (token expired)
│   │   │       └─ Redirect to login
│   │   │
│   │   └── apiServices.js
│   │       ├── authAPI
│   │       │   ├─ signup(data)
│   │       │   └─ login(data)
│   │       │
│   │       ├── userAPI
│   │       │   ├─ getCurrentUser()
│   │       │   ├─ updateProfile(data)
│   │       │   └─ getAllUsers(params)
│   │       │
│   │       └── waterUsageAPI
│   │           ├─ addUsage(data)
│   │           ├─ getMyUsage(params)
│   │           ├─ getAnalytics(params)
│   │           ├─ getAllUsage(params)
│   │           └─ getSystemAnalytics()
│   │
│   ├── slices/
│   │   ├── authSlice.js (Redux Toolkit)
│   │   │   ├─ State:
│   │   │   │   ├─ token: localStorage.getItem('token')
│   │   │   │   ├─ user: { id, name, email, role, ... }
│   │   │   │   ├─ loading, error, isAuthenticated
│   │   │   │   └─ Persisted to localStorage
│   │   │   │
│   │   │   ├─ Async Thunks:
│   │   │   │   ├─ signup(data) → POST /api/auth/signup
│   │   │   │   └─ login(data) → POST /api/auth/login
│   │   │   │
│   │   │   └─ Reducers:
│   │   │       ├─ logout() → clear token & user
│   │   │       ├─ setLoading(bool)
│   │   │       └─ clearError()
│   │   │
│   │   ├── userSlice.js
│   │   │   ├─ State:
│   │   │   │   ├─ user: { ...profile }
│   │   │   │   ├─ users: [] (for admin list)
│   │   │   │   ├─ loading, error, pagination
│   │   │   │
│   │   │   └─ Async Thunks:
│   │   │       ├─ fetchCurrentUser() → GET /api/users/me
│   │   │       ├─ updateUserProfile(data) → PUT /api/users/me
│   │   │       └─ fetchAllUsers(params) → GET /api/users
│   │   │
│   │   └── waterUsageSlice.js
│   │       ├─ State:
│   │       │   ├─ usages: []
│   │       │   ├─ analytics: { totalUsage, alerts, suggestions, ... }
│   │       │   ├─ systemAnalytics: { ... }
│   │       │   ├─ loading, error, pagination
│   │       │
│   │       └─ Async Thunks:
│   │           ├─ addWaterUsage(data) → POST /api/water-usage
│   │           ├─ fetchMyUsage(params) → GET /api/water-usage/my
│   │           ├─ fetchAnalytics(params) → GET /api/water-usage/analytics/my
│   │           └─ fetchSystemAnalytics() → GET /api/water-usage/analytics/system
│   │
│   ├── utils/
│   │   └── helpers.js
│   │       ├─ decodeToken(token) → Parse JWT payload
│   │       ├─ isTokenExpired(token)
│   │       ├─ formatDate(date) → 'Jan 15, 2024'
│   │       ├─ formatNumber(num) → '1,00,000' (Indian)
│   │       ├─ getInitials(name)
│   │       ├─ truncateText(text, length)
│   │       └─ calculateDaysAgo(date) → 'Today', 'Yesterday', '5 days ago'
│   │
│   ├── assets/                ← Images, icons, fonts
│   ├── store.js               ← Redux store configuration
│   │   └─ configureStore({ auth, user, waterUsage })
│   │
│   ├── App.jsx                ← Main routing & root component
│   │   └─ <Routes>
│   │       ├─ Public: /login, /signup
│   │       ├─ Farmer: /farmer/* (protected)
│   │       ├─ Admin: /admin/* (protected)
│   │       └─ Root: / → redirect based on auth
│   │
│   ├── main.jsx               ← React entry point
│   │   └─ ReactDOM.createRoot()
│   │       └─ <Provider store>
│   │
│   └── index.css              ← Global styles + Tailwind imports
│
├── public/                    ← Static files (favicon, etc.)
├── index.html                 ← HTML shell
├── package.json               ← Dependencies
├── vite.config.js             ← Vite build config + path alias
├── tailwind.config.js         ← Tailwind CSS customization
└── postcss.config.js          ← PostCSS plugins
```

---

## 🔄 DATA FLOW PATTERNS

### Pattern 1: Authentication Flow
```
User fills signup form
    ↓
onClick → dispatch(signup({name, email, password, phone, location}))
    ↓
Thunk → call authAPI.signup(data)
    ↓
Axios → POST to /api/auth/signup
    ↓
Backend: authController.signup()
    → User.create() with hashed password
    → generateToken(id, role)
    → respond { token, user }
    ↓
Frontend: authSlice.fulfilled
    → store token in state + localStorage
    → store user data
    → set isAuthenticated = true
    ↓
Component: navigate to /farmer/dashboard
```

### Pattern 2: Protected API Call
```
Component mounts
    ↓
dispatch(fetchAnalytics())
    ↓
Thunk calls waterUsageAPI.getAnalytics()
    ↓
Request Interceptor:
    → get token from Redux state
    → add Authorization: Bearer <token> header
    ↓
Axios POST /api/water-usage/analytics/my
    ↓
Backend receives with header
    ↓
verifyToken middleware:
    → extract token from header
    → jwt.verify() with secret
    → attach decoded payload to req.user
    ↓
requireRole(['farmer']) middleware:
    → check if req.user.role === 'farmer'
    → return 403 if not authorized
    ↓
Controller runs: waterUsageController.getAnalytics()
    → fetch WaterUsage records for req.user.id
    → call calculateAnalytics()
    → respond with metrics
    ↓
Response Interceptor:
    → on 401: dispatch(logout()) + redirect to login
    → on success: return response
    ↓
Thunk fulfilled:
    → update waterUsageSlice.analytics
    ↓
Component re-renders with new data
```

### Pattern 3: State Update & Persistence
```
User updates profile
    ↓
dispatch(updateUserProfile({name, phone, location, ...}))
    ↓
Thunk → axios PUT /api/users/me
    ↓
Response: { ...updated user }
    ↓
userSlice.fulfilled:
    → state.user = action.payload
    → localStorage.setItem('user', JSON.stringify(user))  [manually in component]
    ↓
useSelector(state => state.user.user) detects change
    ↓
Component re-renders with updated profile
```

---

## 🎯 KEY BUSINESS LOGIC

### Water Threshold Alerts
```javascript
const THRESHOLDS = {
  DAILY_WARNING: 5000,      // liters
  DAILY_CRITICAL: 10000,    // liters
  WEEKLY_WARNING: 30000,    // liters
};

if (dailyUsage > DAILY_CRITICAL) {
  alerts.push({
    level: 'critical',
    message: "Today's usage exceeds safe limit!"
  });
} else if (dailyUsage > DAILY_WARNING) {
  alerts.push({
    level: 'warning',
    message: "Today's usage is above average"
  });
}
```

### Efficiency Calculation
```javascript
efficiency = usageAmount / areaIrrigated
// Example: 5000L / 5 acres = 1000 L/acre
```

### Smart Suggestions
```
Rule 1: If borewell usage > 60% of weekly total
  → Suggest: "Use canal or rainwater harvesting"
  
Rule 2: If growing rice or sugarcane (water-intensive)
  → Suggest: "Diversify with water-efficient crops"
  
Rule 3: If low inefficiencies detected
  → Praise: "Your water usage is well-managed!"
```

---

## 🔐 Security Features

1. **Password Hashing**
   - bcryptjs with 10 salt rounds
   - One-way hash, never stored in plain text

2. **JWT Authentication**
   - Token contains: { id, role }
   - Signed with JWT_SECRET
   - 7-day expiry
   - Sent in Authorization header

3. **Request Validation**
   - Field type checks
   - Email format validation
   - Phone number length validation
   - Enum validation for sources/crops

4. **Error Handling**
   - No stack traces exposed in production
   - Consistent error response format
   - 401 for missing/invalid token
   - 403 for unauthorized role

5. **SQL/NoSQL Injection Prevention**
   - Mongoose schema validation
   - No raw queries
   - Parametrized queries only

---

## 🚀 Quick Start Commands

### Backend
```bash
cd backend
npm install
npm run dev        # starts server on localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev        # starts on localhost:5173
```

### Database
```bash
# MongoDB must be running locally
# Default connection: mongodb://localhost:27017/water-dashboard
mongod             # start MongoDB daemon
```

---

## 📊 Database Schema Example

### Users Collection
```javascript
{
  _id: ObjectId,
  name: "Rajesh Kumar",
  email: "rajesh@example.com",
  password: "$2a$10$...",  // bcrypt hash
  phone: "9876543210",
  location: "Nashik",
  state: "Maharashtra",
  district: "Nashik",
  farmSize: 25,
  role: "farmer",
  isActive: true,
  createdAt: ISODate("2024-01-15"),
  updatedAt: ISODate("2024-01-15")
}
```

### Water Usage Collection
```javascript
{
  _id: ObjectId,
  farmer: ObjectId("user_id"),
  source: "borewell",
  usageAmount: 5000,
  date: ISODate("2024-01-15"),
  cropType: "rice",
  areaIrrigated: 5,
  weatherCondition: "sunny",
  efficiency: 1000,
  notes: "Afternoon irrigation",
  createdAt: ISODate("2024-01-15T10:30:00"),
  updatedAt: ISODate("2024-01-15T10:30:00")
}
```

---

## ✅ Production Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Change `JWT_SECRET` to secure random value
- [ ] Configure `MONGODB_URI` for production database
- [ ] Enable HTTPS for API calls
- [ ] Set up CORS with specific frontend domain
- [ ] Implement rate limiting (express-rate-limit)
- [ ] Add request validation (joi/express-validator)
- [ ] Configure logging (Winston/Morgan to files)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Set up health checks and monitoring
- [ ] Implement database backups
- [ ] Configure error tracking (Sentry)
- [ ] Add email verification for signup
- [ ] Implement password reset flow
- [ ] Set up CI/CD pipeline (GitHub Actions)

---

## 🎓 Interview-Ready Code Quality

✅ **Clean Architecture:** Separation of concerns (models, controllers, routes)
✅ **Error Handling:** Global error handler, consistent responses
✅ **Input Validation:** Mongoose schemas + backend validation
✅ **Security:** JWT, bcrypt, no secrets in code
✅ **Code Organization:** Modular, DRY, reusable components
✅ **State Management:** Redux Toolkit with proper slicing
✅ **API Design:** RESTful, consistent endpoints, proper HTTP methods
✅ **Performance:** Indexed queries, pagination, async operations
✅ **Scalability:** Stateless backend, easy to containerize
✅ **Documentation:** Clear comments, consistent naming conventions

This codebase demonstrates **production-ready practices** suitable for enterprise applications.

---

Generated: January 2024
Technology: Node.js, Express, MongoDB, React, Vite, Redux Toolkit
