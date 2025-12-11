# 🚗 Wheel-World — Vehicle Management System

A complete vehicle rental & management platform designed for efficient booking, rental tracking, and automated schedule handling.

🔗 **Live URL:** [visit site](https://wheel-world.vercel.app)

# admin creadentials

"email": "sheikh@example.com",
"password": "securePassword123"

# customer creadentials

"email": "shakera@example.com",
"password": "securePassword123"




## 📌 Features

### 🚗 Vehicle & Booking Management
- Create, update, and manage vehicle inventory
- Real-time availability & pricing control
- Booking creation with date validation
- Prevent booking cancellation on or after rent start date
- Automated status update when rental period ends

### 🔐 Role-Based Authentication & Authorization
- JWT-powered secure authentication
- Role-based access control:
  - **Admin:** Full system management (vehicles, users, bookings)
  - **Customer:** Can create/view their own bookings only
- Protected routes using token + permission middleware

### 🛡️ Secure API & Data Handling
- Encrypted password storage (bcrypt recommended)
- Consistent API response format (success/error structure)
- User access only to allowed resources (no cross-role leakage)

### 🕒 Automated Cron Jobs (System Automation)
- Auto status update after booking expiration
- Prevent cancellation after rent start date via daily check
- Optional cleanup/maintenance cron tasks

### 🧾 Organized Backend Structure
- TypeScript based service layering (Controller → Service → DB Query)
- Reusable helpers, DTO validation & error handling
- Neon PostgreSQL cloud database configuration

### 🔌 Performance & Reliability
- Connection pooling with Neon & pg
- Graceful server error handling
- Environment-based configuration (`.env`)

### 📊 Admin Control Panel APIs (Backend Level)
- Manage vehicle fleet info
- Track active, expired, upcoming bookings
- Pricing and availability adjustment controls

---

## 🛠️ Technology Stack

| Tech | Purpose |
|------|----------
| **TypeScript** | Type-safe backend |
| **Express.js** | API routing |
| **Neon DB (PostgreSQL)** | Cloud database |
| **node-cron** | Automated scheduled tasks |
| **pg** | PostgreSQL querying |

---


## ⚙️ Project Setup (Local Development)

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/SheikhSalman-koli/level2-A2.git
cd level2-A2

```
## Install Dependencies
npm install

## Create .env File
PORT=5000

DATABASE_URL=<your_neon_database_url>

NODE_ENV=development

## Start Development Server
npm run dev

