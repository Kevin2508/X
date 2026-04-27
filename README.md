

## 📋 Twitter Clone Backend - Complete Setup Guide

This is a comprehensive README for your **Twitter Clone backend** built with **Node.js, TypeScript, Express, MySQL, and JWT**.

---

## 📑 Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [Environment Setup](#environment-setup)
4. [Database Setup](#database-setup)
5. [Core Architecture](#core-architecture)
6. [API Endpoints](#api-endpoints)
7. [Postman Collection Setup](#postman-collection-setup)
8. [Implementation Guide](#implementation-guide)

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** v16+
- **MySQL** 5.7+
- **npm** v7+

### Installation Steps

```bash
# 1. Create and navigate to project directory
mkdir x-clone-backend
cd x-clone-backend

# 2. Initialize npm
npm init -y

# 3. Install dependencies
npm install express cors multer bcryptjs jsonwebtoken dotenv mysql2

# 4. Install dev dependencies
npm install --save-dev typescript ts-node nodemon @types/express @types/node @types/jsonwebtoken @types/multer @types/bcryptjs

# 5. Create tsconfig.json and .env files (see sections below)

# 6. Run development server
npm run dev
```

---

## 📁 Project Structure

```
x-clone-backend/
├── src/
│   ├── config/
│   │   └── database.ts              # MySQL connection setup
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts       # JWT verification
│   │   ├── errorHandler.ts          # Error handling
│   │   └── upload.ts                # File upload config
│   │
│   ├── controllers/
│   │   ├── authController.ts        # Signup, Login, Password Reset
│   │   ├── userController.ts        # Profile management
│   │   ├── tweetController.ts       # Create, Read, Delete tweets
│   │   ├── interactionController.ts # Likes, Comments, Retweets
│   │   └── followController.ts      # Follow/Unfollow
│   │
│   ├── services/
│   │   ├── authService.ts           # Auth logic
│   │   ├── userService.ts           # User operations
│   │   ├── tweetService.ts          # Tweet operations
│   │   ├── interactionService.ts    # Like/Comment/Retweet logic
│   │   ├── followService.ts         # Follow logic
│   │   └── emailService.ts          # Email simulation
│   │
│   ├── routes/
│   │   ├── authRoutes.ts            # /api/auth/* routes
│   │   ├── userRoutes.ts            # /api/users/* routes
│   │   ├── tweetRoutes.ts           # /api/tweets/* routes
│   │   ├── interactionRoutes.ts     # /api/interactions/* routes
│   │   ├── followRoutes.ts          # /api/follows/* routes
│   │   └── index.ts                 # Combine all routes
│   │
│   ├── utils/
│   │   ├── jwt.ts                   # JWT generation & verification
│   │   ├── password.ts              # Password hashing & checking
│   │   ├── validators.ts            # Input validation
│   │   ├── response.ts              # Standard response format
│   │   └── errors.ts                # Custom error classes
│   │
│   ├── uploads/                     # Local file storage
│   │   ├── profiles/
│   │   ├── covers/
│   │   └── tweets/
│   │
│   └── index.ts                     # Main app file
│
├── .env                             # Environment variables (create this)
├── .gitignore                       # Git ignore file
├── tsconfig.json                    # TypeScript config (create this)
├── package.json                     # Dependencies
└── README.md                        # This file
```

---

## 🔧 Environment Setup

### Step 1: Create `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

### Step 2: Update `package.json` Scripts

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### Step 3: Create `.env` File

```env
# Server
NODE_ENV=development
PORT=5000
BASE_URL=http://localhost:5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=x_db
DB_TIMEZONE=+00:00

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=refresh_secret_key
REFRESH_TOKEN_EXPIRE=30d

# OTP
OTP_EXPIRE=120000
OTP_LENGTH=6

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# CORS
CORS_ORIGIN=http://localhost:3000
```

### Step 4: Create `.gitignore`

```
node_modules/
dist/
.env
.env.local
uploads/
.DS_Store
```

---

## 🗄️ Database Setup

### Step 1: Create Database & Tables

Use this **SQL script** to initialize your database:

```sql
CREATE DATABASE x_db;
USE x_db;
SET GLOBAL time_zone = "+00:00";

-- Users Table
CREATE TABLE users(
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    display_name VARCHAR(50) NOT NULL,
    user_name VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(150) NOT NULL,
    country VARCHAR(50),
    profile_image VARCHAR(150),
    cover_image VARCHAR(150),
    bio TEXT DEFAULT NULL,
    date_of_birth DATE,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tweets Table
CREATE TABLE tweets(
    tweet_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    content TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tweet Media Table
CREATE TABLE tweet_media(
    media_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tweet_id BIGINT,
    media_type VARCHAR(50),
    media VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id) ON DELETE CASCADE
);

-- Retweets Table
CREATE TABLE retweet(
    user_id BIGINT,
    tweet_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, tweet_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id) ON DELETE CASCADE
);

-- Reactions/Likes Table
CREATE TABLE reactions(
    user_id BIGINT,
    tweet_id BIGINT,
    is_liked BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, tweet_id),
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Comments Table
CREATE TABLE comments(
    comment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    tweet_id BIGINT,
    content TEXT,
    parent_comment_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(comment_id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id) ON DELETE CASCADE
);

-- Comment Reactions Table
CREATE TABLE comment_reactions(
    user_id BIGINT,
    comment_id BIGINT,
    is_liked BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, comment_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE notifications(
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    actor_id BIGINT,
    tweet_id BIGINT,
    comment_id BIGINT,
    content VARCHAR(100),
    notification_type VARCHAR(40),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (tweet_id) REFERENCES tweets(tweet_id) ON DELETE SET NULL,
    FOREIGN KEY (comment_id) REFERENCES comments(comment_id) ON DELETE SET NULL
);

-- Follows Table
CREATE TABLE follows(
    follower_id BIGINT NOT NULL,
    followee_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(follower_id, followee_id),
    FOREIGN KEY (follower_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (followee_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- OTP Table (for password reset)
CREATE TABLE otp_verification(
    otp_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    otp VARCHAR(10),
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);
```

### Step 2: Test Connection

Create **`src/config/database.ts`**:

```typescript
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: process.env.DB_TIMEZONE,
});

export default pool;
```

---

## 🏗️ Core Architecture

### Request Flow

```
HTTP Request
    ↓
Routes (Receive & Validate)
    ↓
Middleware (Auth & Validation)
    ↓
Controllers (Handle Request)
    ↓
Services (Business Logic)
    ↓
Database (Query/Update)
    ↓
Response (Send Back)
```

### Layer Responsibilities

| Layer | Purpose |
|-------|---------|
| **Routes** | Define endpoints and HTTP methods |
| **Controllers** | Parse request, call services, send response |
| **Services** | Business logic, validations, calculations |
| **Database** | Direct SQL queries and operations |
| **Middleware** | Authentication, validation, error handling |
| **Utils** | Helper functions (JWT, Password, Validators) |

---

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| **POST** | `/api/auth/signup` | Register new user | ❌ |
| **POST** | `/api/auth/login` | Login user | ❌ |
| **POST** | `/api/auth/forgot-password` | Initiate password reset | ❌ |
| **POST** | `/api/auth/verify-otp` | Verify OTP & reset password | ❌ |
| **POST** | `/api/auth/resend-otp` | Resend OTP | ❌ |
| **POST** | `/api/auth/change-password` | Change password (authenticated) | ✅ |
| **POST** | `/api/auth/logout` | Logout user | ✅ |

### User Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| **GET** | `/api/users/me` | Get current user | ✅ |
| **GET** | `/api/users/:user_id` | Get user by ID | ❌ |
| **GET** | `/api/users/username/:username` | Get user by username | ❌ |
| **PUT** | `/api/users/me` | Update profile | ✅ |
| **PUT** | `/api/users/me/profile-image` | Update profile picture | ✅ |
| **PUT** | `/api/users/me/cover-image` | Update cover image | ✅ |
| **DELETE** | `/api/users/me` | Delete account | ✅ |

### Tweet Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| **POST** | `/api/tweets` | Create tweet | ✅ |
| **GET** | `/api/tweets` | Get all tweets | ❌ |
| **GET** | `/api/tweets/:tweet_id` | Get tweet by ID | ❌ |
| **GET** | `/api/tweets/user/:user_id` | Get user tweets | ❌ |
| **PUT** | `/api/tweets/:tweet_id` | Edit tweet | ✅ |
| **DELETE** | `/api/tweets/:tweet_id` | Delete tweet | ✅ |

### Interaction Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| **POST** | `/api/tweets/:tweet_id/like` | Like tweet | ✅ |
| **DELETE** | `/api/tweets/:tweet_id/like` | Unlike tweet | ✅ |
| **POST** | `/api/tweets/:tweet_id/retweet` | Retweet | ✅ |
| **DELETE** | `/api/tweets/:tweet_id/retweet` | Remove retweet | ✅ |
| **POST** | `/api/tweets/:tweet_id/comment` | Comment on tweet | ✅ |
| **GET** | `/api/tweets/:tweet_id/comments` | Get comments | ❌ |
| **DELETE** | `/api/comments/:comment_id` | Delete comment | ✅ |

### Follow Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| **POST** | `/api/follows/:followee_id` | Follow user | ✅ |
| **DELETE** | `/api/follows/:followee_id` | Unfollow user | ✅ |
| **GET** | `/api/follows/:user_id/followers` | Get followers | ❌ |
| **GET** | `/api/follows/:user_id/following` | Get following | ❌ |
| **GET** | `/api/follows/check/:followee_id` | Check if following | ✅ |

### Feed Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| **GET** | `/api/feed` | Get user's feed | ✅ |

### Search Endpoints

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| **GET** | `/api/search/users?q=keyword` | Search users | ❌ |
| **GET** | `/api/search/tweets?q=keyword` | Search tweets | ❌ |

---

## 📮 Postman Collection Setup

### How to Import Collection

1. **Create New Collection** in Postman
2. **Name it:** `X-Clone Backend`
3. **Add Environment Variables** (manage environment)

### Environment Variables Setup

Create an environment with these variables:

```json
{
  "base_url": "http://localhost:5000",
  "access_token": "",
  "user_id": "",
  "tweet_id": "",
  "username": "testuser",
  "email": "test@example.com",
  "password": "Test@123"
}
```

