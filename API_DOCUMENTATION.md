# API Documentation - Water Dashboard

## Base URL
```
http://localhost:5000/api
```

---

## Authentication Endpoints

### 1. User Signup
**POST** `/auth/signup`

**Request Body:**
```json
{
  "name": "Rajesh Kumar",
  "email": "rajesh@example.com",
  "password": "securePassword123",
  "phone": "9876543210",
  "location": "Nashik"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "role": "farmer",
    "phone": "9876543210",
    "location": "Nashik"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (409 Conflict):**
```json
{
  "success": false,
  "message": "User with this email already exists"
}
```

---

### 2. User Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "rajesh@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "role": "farmer",
    "phone": "9876543210",
    "location": "Nashik"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## User Endpoints

### 1. Get Current User Profile
**GET** `/users/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "role": "farmer",
    "phone": "9876543210",
    "location": "Nashik",
    "state": "Maharashtra",
    "district": "Nashik",
    "farmSize": 25,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 2. Update User Profile
**PUT** `/users/me`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Rajesh Kumar",
  "phone": "9876543210",
  "location": "Nashik",
  "state": "Maharashtra",
  "district": "Nashik",
  "farmSize": 30
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Rajesh Kumar",
    "email": "rajesh@example.com",
    "phone": "9876543210",
    "location": "Nashik",
    "state": "Maharashtra",
    "district": "Nashik",
    "farmSize": 30
  }
}
```

---

### 3. Get All Users (Admin Only)
**GET** `/users`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
```
?role=farmer&search=rajesh&page=1&limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Rajesh Kumar",
      "email": "rajesh@example.com",
      "role": "farmer",
      "phone": "9876543210",
      "location": "Nashik",
      "farmSize": 25,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

---

## Water Usage Endpoints

### 1. Add Water Usage Log
**POST** `/water-usage`

**Headers:**
```
Authorization: Bearer <farmer_token>
```

**Request Body:**
```json
{
  "source": "borewell",
  "usageAmount": 5000,
  "date": "2024-01-15",
  "cropType": "rice",
  "areaIrrigated": 5,
  "weatherCondition": "sunny",
  "notes": "Morning irrigation"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Water usage logged successfully",
  "data": {
    "id": "507f191e810c19729de860ea",
    "farmer": "507f1f77bcf86cd799439011",
    "source": "borewell",
    "usageAmount": 5000,
    "date": "2024-01-15",
    "cropType": "rice",
    "areaIrrigated": 5,
    "efficiency": 1000,
    "weatherCondition": "sunny",
    "notes": "Morning irrigation",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 2. Get My Water Usage Logs
**GET** `/water-usage/my`

**Headers:**
```
Authorization: Bearer <farmer_token>
```

**Query Parameters:**
```
?startDate=2024-01-01&endDate=2024-01-31&page=1&limit=20
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f191e810c19729de860ea",
      "farmer": "507f1f77bcf86cd799439011",
      "source": "borewell",
      "usageAmount": 5000,
      "date": "2024-01-15",
      "cropType": "rice",
      "areaIrrigated": 5,
      "efficiency": 1000,
      "weatherCondition": "sunny",
      "notes": "Morning irrigation",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 15,
    "pages": 1
  }
}
```

---

### 3. Get My Analytics
**GET** `/water-usage/analytics/my`

**Headers:**
```
Authorization: Bearer <farmer_token>
```

**Query Parameters:**
```
?period=all  # options: all, daily, weekly, monthly
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalUsage": 125000,
    "averageDailyUsage": 8333,
    "dailyUsage": 5000,
    "weeklyUsage": 58333,
    "monthlyUsage": 125000,
    "period": "all",
    "sourceBreakdown": {
      "borewell": 75000,
      "canal": 40000,
      "rain": 10000
    },
    "cropBreakdown": {
      "rice": 80000,
      "wheat": 45000
    },
    "alerts": [
      {
        "level": "warning",
        "message": "Weekly water usage is above average"
      }
    ],
    "suggestions": [
      {
        "type": "source",
        "message": "Heavy reliance on borewell. Consider using canal or rainwater harvesting.",
        "priority": "high"
      },
      {
        "type": "crop",
        "message": "Rice is water-intensive. Diversify with water-efficient crops.",
        "priority": "medium"
      }
    ]
  }
}
```

---

### 4. Get All Water Usage (Admin Only)
**GET** `/water-usage`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
```
?farmerId=507f1f77bcf86cd799439011&startDate=2024-01-01&endDate=2024-01-31&page=1&limit=20
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "507f191e810c19729de860ea",
      "farmer": {
        "_id": "507f1f77bcf86cd799439011",
        "name": "Rajesh Kumar",
        "email": "rajesh@example.com",
        "location": "Nashik"
      },
      "source": "borewell",
      "usageAmount": 5000,
      "date": "2024-01-15",
      "cropType": "rice",
      "areaIrrigated": 5,
      "efficiency": 1000,
      "weatherCondition": "sunny",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 245,
    "pages": 13
  }
}
```

---

### 5. Get System Analytics (Admin Only)
**GET** `/water-usage/analytics/system`

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalUsage": 2500000,
    "farmerCount": 150,
    "avgPerFarmer": 16667,
    "sourceDistribution": {
      "borewell": 1500000,
      "canal": 800000,
      "rain": 200000
    },
    "inefficiencies": [
      {
        "farmerId": "507f1f77bcf86cd799439011",
        "issue": "Heavy borewell dependency",
        "severity": "high"
      }
    ]
  }
}
```

---

## Health Check

### System Status
**GET** `/health`

**Response (200 OK):**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Please provide all required fields"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access forbidden"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Email already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsInJvbGUiOiJmYXJtZXIiLCJpYXQiOjE3MDUzMjQyMDAsImV4cCI6MTcwNTkyOTAwMH0.xyz
```

Token contains:
```json
{
  "id": "507f1f77bcf86cd799439011",
  "role": "farmer",
  "iat": 1705324200,
  "exp": 1705929000
}
```

---

## Rate Limiting (Future)

Coming soon:
- 100 requests per 15 minutes per IP
- 1000 requests per hour per authenticated user

---

## Pagination

Endpoints that return lists support pagination:

```
?page=1&limit=20
```

Response includes:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Date Format

All dates are in ISO 8601 format:
```
2024-01-15T10:30:00.000Z
```

For date parameters, use:
```
YYYY-MM-DD format: 2024-01-15
```

---

## Water Sources

Valid values for `source` field:
- `borewell` - Underground water well
- `canal` - Irrigation canal
- `rain` - Rainwater harvesting
- `well` - Dug well
- `other` - Other sources

---

## Crop Types

Valid values for `cropType` field:
- `rice`
- `wheat`
- `sugarcane`
- `cotton`
- `maize`
- `vegetables`
- `fruits`
- `pulses`
- `oilseeds`
- `other`

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

---

Last Updated: January 2024
