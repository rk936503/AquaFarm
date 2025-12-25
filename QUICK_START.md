# Quick Start Guide - Water Dashboard

## ⚡ 5-Minute Setup

### Prerequisites
- Node.js 16+ installed
- MongoDB running locally (or use MongoDB Atlas)
- Git

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Setup Backend Environment
```bash
# Create .env file
cat > .env << 'EOF'
PORT=5000
MONGODB_URI=mongodb://localhost:27017/water-dashboard
JWT_SECRET=dev_secret_key_change_in_production
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
NODE_ENV=development
EOF
```

### Step 3: Start Backend Server
```bash
npm run dev
```
✅ Backend running on `http://localhost:5000`

### Step 4: Install Frontend Dependencies (new terminal)
```bash
cd frontend
npm install
```

### Step 5: Start Frontend Dev Server
```bash
npm run dev
```
✅ Frontend running on `http://localhost:5173`

---

## 🎮 Using the Application

### 1. Sign Up as Farmer
- Go to http://localhost:5173/signup
- Fill in details:
  - Name: Rajesh Kumar
  - Email: rajesh@example.com
  - Password: password123
  - Phone: 9876543210
  - Location: Nashik
- Click "Create Account"
- Auto-redirect to dashboard

### 2. Log Water Usage
- Click "Water Log" in sidebar
- Fill form:
  - Source: borewell
  - Amount: 5000 (liters)
  - Date: today
  - Crop: rice
  - Area: 5 (acres)
  - Weather: sunny
- Click "Log Water Usage"
- Success message appears

### 3. View Dashboard
- Shows stats: Total, Daily Avg, Today, Weekly
- Color-coded alerts if over thresholds
- Optimization tips displayed
- Real-time updates

### 4. Check Analytics
- Click "Analytics" in sidebar
- See breakdowns by source and crop
- View charts and percentages
- Historical data

### 5. Update Profile
- Click "Profile" in sidebar
- Edit details (name, phone, location, farm size)
- Click "Update Profile"

### 6. Admin Login (Optional)
- Create admin account with `role: admin` during signup
- Or manually insert in MongoDB:
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$10$...", // bcrypt hash of "password123"
  phone: "9999999999",
  location: "City",
  role: "admin",
  isActive: true
})
```

---

## 🗄️ Database Setup

### Option 1: Local MongoDB
```bash
# Start MongoDB daemon
mongod
```

### Option 2: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `.env`:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/water-dashboard
```

### Verify Connection
```bash
# Terminal
mongosh

# In mongo shell
use water-dashboard
db.users.find()
```

---

## 📝 Common Tasks

### Add Test Data
```bash
# In backend directory
node << 'EOF'
const mongoose = require('mongoose');
require('dotenv').config();

async function seedData() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const User = require('./models/User').default;
  const WaterUsage = require('./models/WaterUsage').default;
  
  // Create test farmer
  const farmer = await User.create({
    name: "Test Farmer",
    email: "test@example.com",
    password: "password123",
    phone: "9999999999",
    location: "Test Village",
    role: "farmer"
  });
  
  // Add water logs
  for(let i = 0; i < 10; i++) {
    await WaterUsage.create({
      farmer: farmer._id,
      source: "borewell",
      usageAmount: 5000 + (i * 100),
      date: new Date(),
      cropType: "rice",
      areaIrrigated: 5
    });
  }
  
  console.log("✅ Test data created");
  process.exit(0);
}

seedData().catch(err => {
  console.error(err);
  process.exit(1);
});
EOF
```

### View Logs
```bash
# Backend logs in console during dev mode
# Frontend errors in browser console (F12)
```

### Check API
```bash
# In new terminal
curl http://localhost:5000/health
# Response: {"status":"OK","timestamp":"2024-01-15T10:30:00.000Z"}
```

### Reset Database
```bash
# Connect to MongoDB
mongosh
use water-dashboard
db.dropDatabase()
# Or: db.users.deleteMany({})
```

---

## 🐛 Troubleshooting

### Backend Won't Start
```
Error: connect ECONNREFUSED
→ Check if MongoDB is running
→ mongod in another terminal
```

### Frontend Can't Connect
```
Error: Network Error
→ Backend not running on localhost:5000
→ Check CORS in server.js
→ Clear browser cache (Ctrl+Shift+Del)
```

### MongoDB Connection Failed
```
Error: MongooseError
→ Check MONGODB_URI in .env
→ Verify MongoDB is running
→ Test connection: mongosh
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000
# Kill it
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

### Node Version Issue
```bash
# Check Node version
node --version  # Should be 16+

# Update if needed
# Visit https://nodejs.org/
```

---

## 📚 File Structure Quick Reference

```
backend/
  ├─ server.js          ← Start here for backend
  ├─ config/           ← DB config, constants
  ├─ models/           ← User, WaterUsage schemas
  ├─ controllers/      ← Business logic
  ├─ routes/           ← API endpoints
  └─ .env              ← Environment variables

frontend/
  ├─ src/
  │  ├─ main.jsx       ← React entry point
  │  ├─ App.jsx        ← Routes & layout
  │  ├─ pages/         ← Page components
  │  ├─ components/    ← Reusable components
  │  ├─ slices/        ← Redux state
  │  └─ services/      ← API calls
  └─ index.html        ← HTML shell
```

---

## 🔐 Security Notes

⚠️ **For Development Only:**
- Never commit `.env` files
- Change `JWT_SECRET` before production
- Don't use dummy data in production
- Add request validation/sanitization
- Enable HTTPS in production

---

## 🚀 Production Deployment

### Backend (Heroku/Railway/Render)
```bash
# Install Heroku CLI
heroku login

# Create app
heroku create water-dashboard-api

# Set environment variables
heroku config:set JWT_SECRET=<strong_secret>
heroku config:set MONGODB_URI=<atlas_uri>

# Deploy
git push heroku main
```

### Frontend (Vercel/Netlify)
```bash
# Vercel
vercel deploy

# Or Netlify
netlify deploy --prod
```

---

## 📊 API Testing

### Test Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Farmer Name",
    "email": "farmer@test.com",
    "password": "password123",
    "phone": "9876543210",
    "location": "Village"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "farmer@test.com",
    "password": "password123"
  }'
```

### Test Protected Route
```bash
curl -X GET http://localhost:5000/api/users/me \
  -H "Authorization: Bearer <token_from_login>"
```

---

## 💡 Tips & Tricks

### Hot Reload
- **Backend:** nodemon watches files automatically
- **Frontend:** Vite auto-refreshes on save

### Browser DevTools
- F12 → Redux DevTools to see state
- Network tab to inspect API calls
- Console to see errors

### VS Code Extensions
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Thunder Client (for API testing)
- Postman (alternative for API testing)

### Common npm Scripts
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm start        # Start production server
npm test         # Run tests (if setup)
```

---

## 📞 Support Resources

- **MongoDB Docs:** https://docs.mongodb.com/
- **Express.js:** https://expressjs.com/
- **React:** https://react.dev/
- **Redux Toolkit:** https://redux-toolkit.js.org/
- **Tailwind CSS:** https://tailwindcss.com/

---

## ✅ Checklist Before Deployment

- [ ] Change JWT_SECRET in .env
- [ ] Update MONGODB_URI for production
- [ ] Set NODE_ENV=production
- [ ] Add CORS_ORIGIN for frontend domain
- [ ] Test all endpoints
- [ ] Check error handling
- [ ] Enable HTTPS
- [ ] Setup monitoring/logging
- [ ] Configure backups
- [ ] Load test the app

---

## 🎯 Next Steps

1. ✅ Get app running locally
2. ✅ Test all features
3. ✅ Add more water usage data
4. ✅ Explore analytics
5. ✅ Customize styling (Tailwind)
6. ✅ Add more features as needed
7. ✅ Deploy to production

---

**Happy coding! 🌾💧**

For detailed architecture, see: `ARCHITECTURE.md`
For API endpoints, see: `API_DOCUMENTATION.md`
For folder structure, see: `PROJECT_STRUCTURE.md`
