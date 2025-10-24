# 🧪 Complete API Testing Guide - Al-Munir Consultancy MLM Backend

## 📋 Overview

This document provides comprehensive testing scenarios for all implemented APIs with expected responses.

## 🚀 Quick Start

1. **Start the server:**

   ```bash
   ./start.sh
   # or
   npm run start:dev
   ```

2. **Access Swagger Documentation:**
   ```
   http://localhost:3000/api/docs
   ```

## 🔐 Authentication APIs

### 1. User Registration

```http
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json

{
  "first_name": "Ahmad",
  "last_name": "Khan",
  "email": "ahmad.khan@example.com",
  "password": "password123",
  "phone": "+923001234567",
  "cnic": "12345-6789012-3",
  "address": "123 Main Street, Lahore",
  "city": "Lahore"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "email": "ahmad.khan@example.com",
      "first_name": "Ahmad",
      "last_name": "Khan",
      "role": "user",
      "level": 4,
      "status": "pending"
    },
    "access_token": "jwt-token-here",
    "expires_in": "24h"
  }
}
```

### 2. User Login

```http
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "ahmad.khan@example.com",
  "password": "password123"
}
```

### 3. Register with Referral

```http
POST http://localhost:3000/api/v1/auth/register
Content-Type: application/json

{
  "first_name": "Sara",
  "last_name": "Ali",
  "email": "sara.ali@example.com",
  "password": "password123",
  "phone": "+923001234568",
  "sponsor_referral_code": "ABC123"
}
```

## 👥 User Management APIs

### 4. Get Current User Profile

```http
GET http://localhost:3000/api/v1/Consultant/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

### 5. Get All Consultant (Admin/Manager Only)

```http
GET http://localhost:3000/api/v1/Consultant?page=1&limit=10
Authorization: Bearer ADMIN_JWT_TOKEN
```

### 6. Search Consultant

```http
GET http://localhost:3000/api/v1/Consultant/search?q=ahmad&page=1&limit=5
Authorization: Bearer ADMIN_JWT_TOKEN
```

### 7. Get Team Structure

```http
GET http://localhost:3000/api/v1/Consultant/USER_ID/team-structure?depth=3
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Team structure retrieved successfully",
  "data": {
    "id": "user-id",
    "first_name": "Ahmad",
    "last_name": "Khan",
    "level": 4,
    "status": "active",
    "children": [
      {
        "id": "downline-1-id",
        "first_name": "Sara",
        "last_name": "Ali",
        "level": 4,
        "children": [],
        "depth": 1
      }
    ],
    "depth": 0
  }
}
```

### 8. Get Team Statistics

```http
GET http://localhost:3000/api/v1/Consultant/USER_ID/team-stats
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🎯 Admissions APIs

### 9. Create New Admission

```http
POST http://localhost:3000/api/v1/admissions
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "student_name": "Muhammad Hassan",
  "student_email": "hassan@example.com",
  "student_phone": "+923001234569",
  "admission_type": "school",
  "course_name": "Computer Science",
  "institution_name": "Al-Munir Academy",
  "fee_amount": 50000,
  "notes": "Excellent student, scholarship candidate"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Admission created successfully",
  "data": {
    "id": "admission-id",
    "student_name": "Muhammad Hassan",
    "admission_type": "school",
    "fee_amount": 50000,
    "commission_amount": 7500,
    "status": "completed"
  }
}
```

### 10. Get My Admissions

```http
GET http://localhost:3000/api/v1/admissions/my-admissions?page=1&limit=10
Authorization: Bearer YOUR_JWT_TOKEN
```

### 11. Get Admission Statistics

```http
GET http://localhost:3000/api/v1/admissions/my-stats
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Your statistics retrieved successfully",
  "data": {
    "total_admissions": 5,
    "school_admissions": 3,
    "academy_admissions": 2,
    "technical_admissions": 0,
    "total_fees": 250000,
    "total_commissions": 37500,
    "by_type": {
      "school": {
        "count": 3,
        "total_fees": 150000,
        "total_commissions": 22500
      }
    }
  }
}
```

### 12. Get Top Courses (Admin/Manager)

```http
GET http://localhost:3000/api/v1/admissions/top-courses?limit=5
Authorization: Bearer ADMIN_JWT_TOKEN
```

### 13. Get Monthly Statistics

```http
GET http://localhost:3000/api/v1/admissions/monthly-stats/2024
Authorization: Bearer ADMIN_JWT_TOKEN
```

## 💰 Bonus APIs

### 14. Get My Bonuses

```http
GET http://localhost:3000/api/v1/bonuses/my-bonuses?page=1&limit=10
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Your bonuses retrieved successfully",
  "data": {
    "data": [
      {
        "id": "bonus-id",
        "bonus_type": "direct",
        "amount": 5000,
        "percentage": 10,
        "base_amount": 50000,
        "description": "Direct bonus for school admission",
        "earned_date": "2024-01-15T10:00:00Z",
        "status": "completed"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 15,
      "totalPages": 2
    }
  }
}
```

### 15. Get My Bonus Statistics

```http
GET http://localhost:3000/api/v1/bonuses/my-stats
Authorization: Bearer YOUR_JWT_TOKEN
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Your bonus statistics retrieved successfully",
  "data": {
    "total_bonuses": 25,
    "total_amount": 45000,
    "by_type": {
      "direct": {
        "count": 15,
        "amount": 30000
      },
      "indirect_level_1": {
        "count": 8,
        "amount": 12000
      },
      "global": {
        "count": 2,
        "amount": 3000
      }
    }
  }
}
```

### 16. Get Top Bonus Earners (Admin/Manager)

```http
GET http://localhost:3000/api/v1/bonuses/top-earners?limit=10&period=month
Authorization: Bearer ADMIN_JWT_TOKEN
```

### 17. Get Team Bonus Performance

```http
GET http://localhost:3000/api/v1/bonuses/team-performance/USER_ID
Authorization: Bearer YOUR_JWT_TOKEN
```

## 💳 Transaction APIs

### 18. Request Withdrawal

```http
POST http://localhost:3000/api/v1/transactions/withdrawal-request
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "amount": 10000,
  "payment_method": "bank_transfer",
  "payment_details": "Account: 1234567890, Bank: HBL, Name: Ahmad Khan",
  "notes": "Monthly withdrawal request"
}
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Withdrawal request submitted successfully",
  "data": {
    "id": "transaction-id",
    "transaction_type": "withdrawal",
    "amount": 10000,
    "status": "pending",
    "payment_method": "bank_transfer",
    "description": "Withdrawal request - bank_transfer"
  }
}
```

### 19. Get My Transactions

```http
GET http://localhost:3000/api/v1/transactions/my-transactions?page=1&limit=10
Authorization: Bearer YOUR_JWT_TOKEN
```

### 20. Get My Transaction Statistics

```http
GET http://localhost:3000/api/v1/transactions/my-stats
Authorization: Bearer YOUR_JWT_TOKEN
```

### 21. Get Pending Withdrawals (Admin Only)

```http
GET http://localhost:3000/api/v1/transactions/pending-withdrawals
Authorization: Bearer ADMIN_JWT_TOKEN
```

### 22. Process Withdrawal (Admin Only)

```http
PATCH http://localhost:3000/api/v1/transactions/TRANSACTION_ID/process-withdrawal
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "approved": true,
  "notes": "Withdrawal approved and processed"
}
```

## 📊 Advanced Testing Scenarios

### 23. Complete MLM Flow Test

1. **Register Sponsor:**

   ```http
   POST http://localhost:3000/api/v1/auth/register
   # Register user A (sponsor)
   ```

2. **Get Referral Code:**

   ```http
   GET http://localhost:3000/api/v1/Consultant/profile
   # Get referral_code from response
   ```

3. **Register Downline:**

   ```http
   POST http://localhost:3000/api/v1/auth/register
   # Register user B with A's referral code
   ```

4. **Create Admission for Downline:**

   ```http
   POST http://localhost:3000/api/v1/admissions
   # Create admission as user B
   ```

5. **Check Sponsor's Bonuses:**
   ```http
   GET http://localhost:3000/api/v1/bonuses/my-bonuses
   # Check A's bonuses (should have team bonus from B)
   ```

### 24. Multi-Level Testing

```http
# Register Level 1: User A
POST http://localhost:3000/api/v1/auth/register

# Register Level 2: User B (sponsored by A)
POST http://localhost:3000/api/v1/auth/register

# Register Level 3: User C (sponsored by B)
POST http://localhost:3000/api/v1/auth/register

# Create admission as User C
POST http://localhost:3000/api/v1/admissions

# Check bonuses for A, B, C
GET http://localhost:3000/api/v1/bonuses/my-bonuses
```

## ⚠️ Error Testing

### 25. Test Invalid Requests

```http
# Invalid login
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{
  "email": "wrong@email.com",
  "password": "wrongpassword"
}
```

**Expected Response:**

```json
{
  "success": false,
  "error": "Invalid credentials",
  "statusCode": 401
}
```

### 26. Test Insufficient Balance

```http
# Try to withdraw more than available balance
POST http://localhost:3000/api/v1/transactions/withdrawal-request
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "amount": 1000000,
  "payment_method": "bank_transfer",
  "payment_details": "Account: 123"
}
```

## 🔧 Admin Testing

### 27. Admin Operations

```http
# Update user status (Admin only)
PATCH http://localhost:3000/api/v1/Consultant/USER_ID/status
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "status": "active"
}

# Update user level (Admin only)
PATCH http://localhost:3000/api/v1/Consultant/USER_ID/level
Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "level": 3
}
```

## 📈 Performance Testing

### 28. Load Testing Endpoints

```bash
# Test with multiple concurrent requests
curl -X GET "http://localhost:3000/api/v1/Consultant/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" &
curl -X GET "http://localhost:3000/api/v1/admissions/my-admissions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" &
curl -X GET "http://localhost:3000/api/v1/bonuses/my-bonuses" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" &
```

## ✅ Testing Checklist

- [ ] User registration works with and without referral codes
- [ ] User login and JWT authentication works
- [ ] Team structure displays correctly with multi-level relationships
- [ ] Admission creation triggers bonus calculations
- [ ] Direct bonuses are calculated correctly (10%-30% based on level)
- [ ] Team bonuses are distributed to sponsors (up to 4 levels)
- [ ] Global bonuses are given to managers
- [ ] Withdrawal requests are created and can be processed
- [ ] Role-based access control works (user/admin/manager permissions)
- [ ] Statistics and reporting endpoints return accurate data
- [ ] Error handling works for invalid requests
- [ ] Rate limiting prevents API abuse
- [ ] Swagger documentation is complete and functional

## 🎯 Success Criteria

A successful test run should demonstrate:

1. **Complete User Journey:** Registration → Team Building → Admissions → Bonus Earning → Withdrawals
2. **MLM Functionality:** Multi-level relationships and bonus distributions
3. **Business Logic:** Correct bonus calculations based on Al-Munir's model
4. **Security:** Authentication, authorization, and data protection
5. **Performance:** Responsive APIs with proper error handling
6. **Documentation:** Complete Swagger docs with all endpoints working

## 🔗 Quick Links

- **Swagger UI:** http://localhost:3000/api/docs
- **Base API:** http://localhost:3000/api/v1
- **Health Check:** http://localhost:3000/api/v1/health (if implemented)

---

**Note:** Replace `YOUR_JWT_TOKEN`, `ADMIN_JWT_TOKEN`, and `USER_ID` with actual values from your test environment.
