# API Documentation - Staff Attendance Management System

This document specifies the REST API contract for the Staff Attendance Management System. All endpoints must adhere to the request and response formats defined below.

---

## Centralized JSON Structure

### Success Response Format
```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {}
}
```

### Error Response Format
```json
{
  "success": false,
  "message": "Detailed error explanation message",
  "error": "Stack trace (Only in development mode)",
  "errors": [] // Optional validation details (Field name + validation message)
}
```

---

## Authentication Endpoints

### 1. User Login
*   **Method**: `POST`
*   **Path**: `/api/auth/login`
*   **Access**: Public
*   **Request Body**:
    ```json
    {
      "email": "user@company.com",
      "password": "user_password"
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Logged in successfully",
      "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
          "id": 1,
          "email": "user@company.com",
          "role": "STAFF",
          "name": "Jane Doe"
        }
      }
    }
    ```

### 2. Get Profile
*   **Method**: `GET`
*   **Path**: `/api/auth/profile`
*   **Access**: Protected (JWT token required)
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Profile details retrieved successfully",
      "data": {
        "profile": {
          "id": 1,
          "name": "Jane Doe",
          "email": "user@company.com",
          "role": "STAFF",
          "department": "Technology Services"
        }
      }
    }
    ```

---

## Staff CRUD Endpoints (Admin Only)

### 1. List Staff Members
*   **Method**: `GET`
*   **Path**: `/api/staff`
*   **Access**: Protected (ADMIN role required)
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Staff records retrieved successfully",
      "data": {
        "staffList": []
      }
    }
    ```

### 2. Create Staff Member
*   **Method**: `POST`
*   **Path**: `/api/staff`
*   **Access**: Protected (ADMIN role required)
*   **Request Body**:
    ```json
    {
      "email": "new.staff@company.com",
      "password": "SecurePassword123",
      "name": "John Smith",
      "department_id": 2
    }
    ```
*   **Success Response (201 Created)**:
    ```json
    {
      "success": true,
      "message": "Staff member profile created successfully",
      "data": {
        "userId": 3,
        "email": "new.staff@company.com",
        "name": "John Smith",
        "role": "STAFF"
      }
    }
    ```

### 3. Update Staff Member
*   **Method**: `PUT`
*   **Path**: `/api/staff/:id`
*   **Access**: Protected (ADMIN role required)
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Staff member profile updated successfully",
      "data": {
        "userId": 3,
        "updated": true
      }
    }
    ```

### 4. Delete Staff Member
*   **Method**: `DELETE`
*   **Path**: `/api/staff/:id`
*   **Access**: Protected (ADMIN role required)
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Staff member profile deleted successfully",
      "data": {
        "userId": 3,
        "deleted": true
      }
    }
    ```

---

## Attendance Endpoints (Staff Only)

### 1. Check-In
*   **Method**: `POST`
*   **Path**: `/api/attendance/check-in`
*   **Access**: Protected (STAFF role required)
*   **Request Body**:
    ```json
    {
      "latitude": 12.9716,
      "longitude": 77.5946,
      "qrData": "company-qr-token-abc",
      "deviceInfo": "Chrome / Windows 10"
    }
    ```
*   **Success Response (201 Created)**:
    ```json
    {
      "success": true,
      "message": "Check-in successful",
      "data": {
        "userId": 2,
        "checkInTime": "2026-06-09T09:00:00.000Z",
        "status": "ON_TIME"
      }
    }
    ```

### 2. Check-Out
*   **Method**: `POST`
*   **Path**: `/api/attendance/check-out`
*   **Access**: Protected (STAFF role required)
*   **Request Body**:
    ```json
    {
      "latitude": 12.9716,
      "longitude": 77.5946,
      "deviceInfo": "Chrome / Windows 10"
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Check-out successful",
      "data": {
        "userId": 2,
        "checkOutTime": "2026-06-09T18:00:00.000Z",
        "durationMinutes": 540
      }
    }
    ```

### 3. Fetch History
*   **Method**: `GET`
*   **Path**: `/api/attendance/history`
*   **Access**: Protected (STAFF logs own records; ADMIN can filter via `?user_id=X` query)
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Attendance records retrieved successfully",
      "data": {
        "history": []
      }
    }
    ```

---

## Leave Management Endpoints

### 1. Apply Leave
*   **Method**: `POST`
*   **Path**: `/api/leaves`
*   **Access**: Protected (STAFF role required)
*   **Request Body**:
    ```json
    {
      "startDate": "2026-06-15",
      "endDate": "2026-06-18",
      "type": "SICK",
      "reason": "Recovering from medical surgery procedures."
    }
    ```
*   **Success Response (201 Created)**:
    ```json
    {
      "success": true,
      "message": "Leave request submitted successfully",
      "data": {
        "leaveId": 24,
        "userId": 2,
        "startDate": "2026-06-15",
        "endDate": "2026-06-18",
        "type": "SICK",
        "status": "PENDING"
      }
    }
    ```

### 2. Fetch Leave Applications
*   **Method**: `GET`
*   **Path**: `/api/leaves`
*   **Access**: Protected (STAFF fetches own; ADMIN retrieves all pending/reviewed applications)
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Leave records retrieved successfully",
      "data": {
        "leaves": []
      }
    }
    ```

### 3. Review Leave Application (Admin Only)
*   **Method**: `PATCH`
*   **Path**: `/api/leaves/:id/status`
*   **Access**: Protected (ADMIN role required)
*   **Request Body**:
    ```json
    {
      "status": "APPROVED",
      "remarks": "Covered by medical certificate details."
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Leave request status updated successfully",
      "data": {
        "leaveId": 24,
        "status": "APPROVED",
        "remarks": "Covered by medical certificate details.",
        "updatedBy": 1,
        "updatedAt": "2026-06-09T09:50:00.000Z"
      }
    }
    ```
