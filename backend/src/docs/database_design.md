# Database Design - Staff Attendance Management System

This document specifies the database architecture, schema normalization, CREATE TABLE statements, and Sequelize model associations for the Staff Attendance Management System.

---

## 1. Entity-Relationship (ER) Diagram Description

*   **`roles` (Role Definitions)**:
    *   `1 : M` with `users` (Each user account has one assigned role; a role can belong to multiple users).
*   **`users` (RBAC & Authentication)**:
    *   `1 : 1` with `staff` (Each user credentials entry maps to exactly one physical staff profile).
    *   `1 : M` with `notifications` (A user can receive many notifications).
*   **`departments` (Enterprise Divisions)**:
    *   `1 : M` with `staff` (A department can contain many staff members).
*   **`staff` (Employee Profiles)**:
    *   `1 : M` with `attendance` (An employee punches check-in/out records daily).
    *   `1 : M` with `leave_requests` (An employee submits many leave requests over time).
*   **`users` (Reviewer Admins)**:
    *   `1 : M` with `leave_requests` (An admin reviews and approves/rejects many leave requests).
*   **`attendance_settings` (Global System Parameters)**:
    *   Standalone single-row configuration table containing work hour thresholds and late rules.

```mermaid
erDiagram
    roles {
        int id PK
        string name UNIQUE
        timestamp created_at
        timestamp updated_at
    }

    users {
        int id PK
        string email UNIQUE
        string password
        int role_id FK
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }

    departments {
        int id PK
        string name UNIQUE
        string code UNIQUE
        text description
        timestamp created_at
        timestamp updated_at
    }

    staff {
        int id PK
        int user_id FK "UNIQUE"
        int department_id FK
        string employee_code UNIQUE
        string designation
        string profile_image
        string first_name
        string last_name
        string phone_number
        date joining_date
        text face_template "Face Vectors"
        timestamp face_registration_date
        timestamp created_at
        timestamp updated_at
    }

    attendance {
        int id PK
        int staff_id FK
        date date "UNIQUE(staff_id, date)"
        timestamp check_in
        timestamp check_out
        decimal working_hours
        enum status "PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE"
        text remarks
        string check_in_ip
        string check_out_ip
        decimal check_in_latitude
        decimal check_in_longitude
        decimal check_out_latitude
        decimal check_out_longitude
        enum check_in_method "WEB, QR, FACE"
        enum check_out_method "WEB, QR, FACE"
        string device_info
        timestamp created_at
        timestamp updated_at
    }

    leave_requests {
        int id PK
        int staff_id FK
        date start_date
        date end_date
        decimal applied_days
        enum leave_type "SICK, CASUAL, EARNED, MATERNITY, PATERNITY, UNPAID"
        text reason
        enum status "PENDING, APPROVED, REJECTED"
        int approved_by_user_id FK "users.id"
        text remarks
        timestamp created_at
        timestamp updated_at
    }

    notifications {
        int id PK
        int user_id FK
        string title
        text message
        enum type "ATTENDANCE, LEAVE, SYSTEM, GENERAL"
        boolean is_read
        timestamp read_at
        timestamp created_at
        timestamp updated_at
    }

    attendance_settings {
        int id PK
        time office_start_time
        time office_end_time
        int late_after_minutes
        int half_day_after_minutes
        timestamp created_at
        timestamp updated_at
    }

    roles ||--o{ users : "defines access for"
    users ||--|| staff : "binds credentials to"
    departments ||--o{ staff : "employs"
    staff ||--o{ attendance : "logs"
    staff ||--o{ leave_requests : "submits"
    users ||--o{ leave_requests : "reviews"
    users ||--o{ notifications : "receives"
```

---

## 2. Table Schemas, Constraints & 3NF Normalization

---

### Table 1: `roles`
Purpose: Centralizes available authorization roles (e.g. Super Admin, Admin, Manager, HR, Staff) so adding roles doesn't require modifying DB columns or ENUM definitions.

| Column Name | Data Type | Nullable | Default Value | Primary/Foreign Key | Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **id** | INT | NO | *Auto-Increment* | **PK** | |
| **name** | VARCHAR(50) | NO | *None* | | Unique index |
| **created_at** | TIMESTAMP | NO | CURRENT_TIMESTAMP | | Audit field |
| **updated_at** | TIMESTAMP | NO | CURRENT_TIMESTAMP | | Audit field, auto-update |

---

### Table 2: `users`
Purpose: Stores user account authorization details and login secrets.

| Column Name | Data Type | Nullable | Default Value | Primary/Foreign Key | Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **id** | INT | NO | *Auto-Increment* | **PK** | |
| **email** | VARCHAR(128) | NO | *None* | | Unique index |
| **password** | VARCHAR(255) | NO | *None* | | Encrypted hash string |
| **role_id** | INT | NO | *None* | **FK** | References `roles(id)` ON DELETE RESTRICT |
| **is_active** | TINYINT(1) | NO | 1 | | Boolean state indicator |
| **created_at** | TIMESTAMP | NO | CURRENT_TIMESTAMP | | Audit field |
| **updated_at** | TIMESTAMP | NO | CURRENT_TIMESTAMP | | Audit field, auto-update |

---

### Table 3: `departments`
Purpose: Grouping staff members into enterprise units.

| Column Name | Data Type | Nullable | Default Value | Primary/Foreign Key | Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **id** | INT | NO | *Auto-Increment* | **PK** | |
| **name** | VARCHAR(100) | NO | *None* | | Unique index |
| **code** | VARCHAR(20) | NO | *None* | | Unique index |
| **description** | TEXT | YES | NULL | | |
| **created_at** | TIMESTAMP | NO | CURRENT_TIMESTAMP | | Audit field |
| **updated_at** | TIMESTAMP | NO | CURRENT_TIMESTAMP | | Audit field, auto-update |

---

### Table 4: `staff`
Purpose: Holds profile information, designation title, photo links, and employee codes.

| Column Name | Data Type | Nullable | Default Value | Primary/Foreign Key | Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **id** | INT | NO | *Auto-Increment* | **PK** | |
| **user_id** | INT | NO | *None* | **FK** | Unique. References `users(id)` ON DELETE CASCADE |
| **department_id**| INT | YES | NULL | **FK** | References `departments(id)` ON DELETE SET NULL|
| **employee_code**| VARCHAR(20) | NO | *None* | | Unique index (e.g. EMP001) |
| **designation** | VARCHAR(100) | NO | *None* | | Designation title description |
| **profile_image**| VARCHAR(255) | YES | NULL | | Path to profile photo upload |
| **first_name** | VARCHAR(64) | NO | *None* | | |
| **last_name** | VARCHAR(64) | NO | *None* | | |
| **phone_number** | VARCHAR(20) | YES | NULL | | |
| **joining_date** | DATE | YES | NULL | | |
| **face_template**| TEXT | YES | NULL | | Face biometrics vectors |
| **face_registration_date**| TIMESTAMP| YES| NULL | | Registration time |
| **created_at** | TIMESTAMP | NO | CURRENT_TIMESTAMP | | Audit field |
| **updated_at** | TIMESTAMP | NO | CURRENT_TIMESTAMP | | Audit field, auto-update |

---

### Table 5: `attendance`
Purpose: Daily check-in and check-out tracking parameters, working hours calculations, and correction remarks.

| Column Name | Data Type | Nullable | Default Value | Primary/Foreign Key | Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **id** | INT | NO | *Auto-Increment* | **PK** | |
| **staff_id** | INT | NO | *None* | **FK** | References `staff(id)` ON DELETE CASCADE |
| **date** | DATE | NO | *None* | | Unique index composite: `(staff_id, date)` |
| **check_in** | TIMESTAMP | YES | NULL | | |
| **check_out** | TIMESTAMP | YES | NULL | | |
| **working_hours**| DECIMAL(5,2)| YES | NULL | | Hours worked calculation (e.g. 8.50) |
| **status** | ENUM(...) | NO | 'PRESENT' | | Enforced values: `PRESENT`, `ABSENT`, `LATE`, `HALF_DAY`, `ON_LEAVE` |
| **remarks** | TEXT | YES | NULL | | Manual overrides explanation/comments |
| **check_in_ip** | VARCHAR(45) | YES | NULL | | |
| **check_out_ip**| VARCHAR(45) | YES | NULL | | |
| **check_in_latitude**| DECIMAL(10,8)| YES| NULL | | |
| **check_in_longitude**| DECIMAL(11,8)|YES| NULL | | |
| **check_out_latitude**| DECIMAL(10,8)|YES| NULL | | |
| **check_out_longitude**| DECIMAL(11,8)|YES| NULL | | |
| **check_in_method**| ENUM(...) | NO | 'WEB' | | Enforced values: `WEB`, `QR`, `FACE` |
| **check_out_method**| ENUM(...) | NO | 'WEB' | | Enforced values: `WEB`, `QR`, `FACE` |
| **device_info** | VARCHAR(255) | YES | NULL | | |
| **created_at** | TIMESTAMP | NO | CURRENT_TIMESTAMP | | Audit field |
| **updated_at** | TIMESTAMP | NO | CURRENT_TIMESTAMP | | Audit field, auto-update |

---

### Table 6: `leave_requests`
Purpose: Tracks leave requests, durations, categories, and reviews.

| Column Name | Data Type | Nullable | Default Value | Primary/Foreign Key | Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **id** | INT | NO | *Auto-Increment* | **PK** | |
| **staff_id** | INT | NO | *None* | **FK** | References `staff(id)` ON DELETE CASCADE |
| **start_date** | DATE | NO | *None* | | |
| **end_date** | DATE | NO | *None* | | Constraint: `end_date >= start_date` |
| **applied_days** | DECIMAL(4,1) | NO | *None* | | Duration check (e.g., 0.5, 3.0 days) |
| **leave_type** | ENUM(...) | NO | *None* | | Enforced: `SICK`, `CASUAL`, `EARNED`, `MATERNITY`, `PATERNITY`, `UNPAID` |
| **reason** | TEXT | NO | *None* | | |
| **status** | ENUM(...) | NO | 'PENDING' | | Enforced: `PENDING`, `APPROVED`, `REJECTED` |
| **approved_by_user_id**| INT | YES | NULL | **FK** | References `users(id)` ON DELETE SET NULL |
| **remarks** | TEXT | YES | NULL | | |
| **created_at** | TIMESTAMP | NO | CURRENT_TIMESTAMP | | Audit field |
| **updated_at** | TIMESTAMP | NO | CURRENT_TIMESTAMP | | Audit field, auto-update |

---

### Table 7: `notifications`
Purpose: Reminders, alerts, and system notices.

| Column Name | Data Type | Nullable | Default Value | Primary/Foreign Key | Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **id** | INT | NO | *Auto-Increment* | **PK** | |
| **user_id** | INT | NO | *None* | **FK** | References `users(id)` ON DELETE CASCADE |
| **title** | VARCHAR(150) | NO | *None* | | |
| **message** | TEXT | NO | *None* | | |
| **type** | ENUM(...) | NO | 'GENERAL' | | Enforced: `ATTENDANCE`, `LEAVE`, `SYSTEM`, `GENERAL` |
| **is_read** | TINYINT(1) | NO | 0 | | Boolean status indicator |
| **read_at** | TIMESTAMP | YES | NULL | | Timestamp indicating when read |
| **created_at** | TIMESTAMP | NO | CURRENT_TIMESTAMP | | Audit field |
| **updated_at** | TIMESTAMP | NO | CURRENT_TIMESTAMP | | Audit field, auto-update |

---

### Table 8: `attendance_settings`
Purpose: Global business variables for shift times, grace periods, and late thresholds.

| Column Name | Data Type | Nullable | Default Value | Primary/Foreign Key | Constraints |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **id** | INT | NO | *Auto-Increment* | **PK** | |
| **office_start_time**| TIME | NO | '09:00:00' | | Expected shift start |
| **office_end_time** | TIME | NO | '17:00:00' | | Expected shift end |
| **late_after_minutes**| INT | NO | 15 | | Grace buffer time before late status |
| **half_day_after_minutes**| INT | NO | 120 | | Threshold for half-day status |
| **created_at** | TIMESTAMP | NO | CURRENT_TIMESTAMP | | Audit field |
| **updated_at** | TIMESTAMP | NO | CURRENT_TIMESTAMP | | Audit field, auto-update |

---

## 3. MySQL CREATE TABLE Statements

```sql
-- Create database schema
CREATE DATABASE IF NOT EXISTS `staff_attendance_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `staff_attendance_db`;

-- 1. Create 'roles' table
CREATE TABLE `roles` (
  `id` INT AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_roles_name` (`name`)
) ENGINE=InnoDB;

-- 2. Create 'users' table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT,
  `email` VARCHAR(128) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role_id` INT NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`),
  CONSTRAINT `fk_users_role_id` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- 3. Create 'departments' table
CREATE TABLE `departments` (
  `id` INT AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `code` VARCHAR(20) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_departments_name` (`name`),
  UNIQUE KEY `idx_departments_code` (`code`)
) ENGINE=InnoDB;

-- 4. Create 'staff' table
CREATE TABLE `staff` (
  `id` INT AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `department_id` INT DEFAULT NULL,
  `employee_code` VARCHAR(20) NOT NULL,
  `designation` VARCHAR(100) NOT NULL,
  `profile_image` VARCHAR(255) DEFAULT NULL,
  `first_name` VARCHAR(64) NOT NULL,
  `last_name` VARCHAR(64) NOT NULL,
  `phone_number` VARCHAR(20) DEFAULT NULL,
  `joining_date` DATE DEFAULT NULL,
  `face_template` TEXT DEFAULT NULL,
  `face_registration_date` TIMESTAMP DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_staff_user_id` (`user_id`),
  UNIQUE KEY `idx_staff_employee_code` (`employee_code`),
  CONSTRAINT `fk_staff_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_staff_department_id` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Create 'attendance' table
CREATE TABLE `attendance` (
  `id` INT AUTO_INCREMENT,
  `staff_id` INT NOT NULL,
  `date` DATE NOT NULL,
  `check_in` TIMESTAMP NULL DEFAULT NULL,
  `check_out` TIMESTAMP NULL DEFAULT NULL,
  `working_hours` DECIMAL(5,2) DEFAULT NULL,
  `status` ENUM('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE') NOT NULL DEFAULT 'PRESENT',
  `remarks` TEXT DEFAULT NULL,
  `check_in_ip` VARCHAR(45) DEFAULT NULL,
  `check_out_ip` VARCHAR(45) DEFAULT NULL,
  `check_in_latitude` DECIMAL(10,8) DEFAULT NULL,
  `check_in_longitude` DECIMAL(11,8) DEFAULT NULL,
  `check_out_latitude` DECIMAL(10,8) DEFAULT NULL,
  `check_out_longitude` DECIMAL(11,8) DEFAULT NULL,
  `check_in_method` ENUM('WEB', 'QR', 'FACE') NOT NULL DEFAULT 'WEB',
  `check_out_method` ENUM('WEB', 'QR', 'FACE') NOT NULL DEFAULT 'WEB',
  `device_info` VARCHAR(255) DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_attendance_staff_date` (`staff_id`, `date`),
  CONSTRAINT `fk_attendance_staff_id` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Create 'leave_requests' table
CREATE TABLE `leave_requests` (
  `id` INT AUTO_INCREMENT,
  `staff_id` INT NOT NULL,
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `applied_days` DECIMAL(4,1) NOT NULL,
  `leave_type` ENUM('SICK', 'CASUAL', 'EARNED', 'MATERNITY', 'PATERNITY', 'UNPAID') NOT NULL,
  `reason` TEXT NOT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `approved_by_user_id` INT DEFAULT NULL,
  `remarks` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_leaves_staff_id` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_leaves_approved_by` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_leaves_dates` CHECK (`end_date` >= `start_date`)
) ENGINE=InnoDB;

-- 7. Create 'notifications' table
CREATE TABLE `notifications` (
  `id` INT AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `type` ENUM('ATTENDANCE', 'LEAVE', 'SYSTEM', 'GENERAL') NOT NULL DEFAULT 'GENERAL',
  `is_read` TINYINT(1) NOT NULL DEFAULT 0,
  `read_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_notifications_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 8. Create 'attendance_settings' table
CREATE TABLE `attendance_settings` (
  `id` INT AUTO_INCREMENT,
  `office_start_time` TIME NOT NULL DEFAULT '09:00:00',
  `office_end_time` TIME NOT NULL DEFAULT '17:00:00',
  `late_after_minutes` INT NOT NULL DEFAULT 15,
  `half_day_after_minutes` INT NOT NULL DEFAULT 120,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;
```

---

## 4. Sequelize Associations

```javascript
// ============================================
// Model Associations Setup
// ============================================

// 1. Role <-> User (One-to-Many)
Role.hasMany(User, {
  foreignKey: 'role_id',
  onDelete: 'RESTRICT',
  as: 'users'
});
User.belongsTo(Role, {
  foreignKey: 'role_id',
  as: 'role'
});

// 2. User <-> Staff (One-to-One)
User.hasOne(Staff, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  as: 'staffProfile'
});
Staff.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'userCredentials'
});

// 3. Department <-> Staff (One-to-Many)
Department.hasMany(Staff, {
  foreignKey: 'department_id',
  onDelete: 'SET NULL',
  as: 'employees'
});
Staff.belongsTo(Department, {
  foreignKey: 'department_id',
  as: 'department'
});

// 4. Staff <-> Attendance (One-to-Many)
Staff.hasMany(Attendance, {
  foreignKey: 'staff_id',
  onDelete: 'CASCADE',
  as: 'attendances'
});
Attendance.belongsTo(Staff, {
  foreignKey: 'staff_id',
  as: 'staff'
});

// 5. Staff <-> LeaveRequest (One-to-Many)
Staff.hasMany(LeaveRequest, {
  foreignKey: 'staff_id',
  onDelete: 'CASCADE',
  as: 'leaveRequests'
});
LeaveRequest.belongsTo(Staff, {
  foreignKey: 'staff_id',
  as: 'applicant'
});

// 6. User (Admin) <-> LeaveRequest (One-to-Many Approvals)
User.hasMany(LeaveRequest, {
  foreignKey: 'approved_by_user_id',
  onDelete: 'SET NULL',
  as: 'reviewedLeaves'
});
LeaveRequest.belongsTo(User, {
  foreignKey: 'approved_by_user_id',
  as: 'reviewer'
});

// 7. User <-> Notification (One-to-Many)
User.hasMany(Notification, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  as: 'notifications'
});
Notification.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'receiver'
});
```
