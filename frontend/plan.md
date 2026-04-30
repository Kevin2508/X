# 🐦 X (Twitter Clone) — Frontend Guide

> A complete, beginner-friendly plan to build the React frontend from scratch.  
> Stack: **React + Axios + TailwindCSS + ShadCN + Context API**

---

## 📁 Folder Structure

```
src/
├── api/                          # All Axios API call functions
│   ├── axiosInstance.js          # Base Axios setup (baseURL, interceptors)
│   ├── authApi.js                # login, register, logout, forgotPassword, resetPassword
│   ├── tweetApi.js               # createTweet, getTweets, deleteTweet, likeTweet
│   ├── userApi.js                # getProfile, updateProfile, followUser, searchUsers
│   └── commentApi.js             # addComment, getComments
│
├── components/                   # Reusable UI pieces
│   ├── common/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Loader.jsx
│   │   ├── Avatar.jsx
│   │   └── Button.jsx
│   ├── tweet/
│   │   ├── TweetCard.jsx         # Single tweet display
│   │   ├── TweetForm.jsx         # Compose tweet box
│   │   └── TweetList.jsx         # List of tweets
│   ├── profile/
│   │   ├── ProfileHeader.jsx     # Cover + avatar + bio
│   │   └── ProfileTabs.jsx       # Tweets / Replies tabs
│   └── auth/
│       ├── OtpTimer.jsx          # Countdown + resend button
│       └── EmailSimulation.jsx   # Simulated email inbox UI
│
├── context/
│   └── AuthContext.jsx           # Auth state: user, token, login(), logout()
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.js                # Shortcut to use AuthContext
│   └── useTweets.js              # Fetch + manage tweets state
│
├── pages/                        # One file = one route/screen
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ForgotPasswordPage.jsx
│   ├── EmailSimulationPage.jsx   # Fake inbox showing OTP
│   ├── OtpVerifyPage.jsx
│   ├── ResetPasswordPage.jsx
│   ├── HomePage.jsx              # Main feed
│   ├── ProfilePage.jsx
│   ├── EditProfilePage.jsx
│   ├── SearchPage.jsx
│   └── NotFoundPage.jsx
│
├── routes/
│   ├── AppRoutes.jsx             # All route definitions
│   └── ProtectedRoute.jsx        # Wrapper that blocks unauthenticated users
│
├── utils/
│   ├── tokenUtils.js             # Save/get/remove token from localStorage
│   └── formatDate.js             # e.g. "2 hours ago"
│
├── App.jsx
└── main.jsx
```

---

## 🗺️ All Routes

| Path | Page | Protected? |
|---|---|---|
| `/login` | LoginPage | ❌ |
| `/register` | RegisterPage | ❌ |
| `/forgot-password` | ForgotPasswordPage | ❌ |
| `/email-simulation` | EmailSimulationPage | ❌ |
| `/verify-otp` | OtpVerifyPage | ❌ |
| `/reset-password` | ResetPasswordPage | ❌ |
| `/` | HomePage (Feed) | ✅ |
| `/profile/:username` | ProfilePage | ✅ |
| `/profile/edit` | EditProfilePage | ✅ |
| `/search` | SearchPage | ✅ |
| `*` | NotFoundPage | ❌ |

---

## 🚀 Build Order (Step by Step)

Follow this order. Don't skip ahead — each step builds on the last.

### Phase 1 — Project Setup
1. Create React app: `npm create vite@latest x-frontend -- --template react`
2. Install packages:
   ```bash
   npm install axios react-router-dom
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
3. Install ShadCN: follow [shadcn/ui docs](https://ui.shadcn.com/docs/installation/vite)
4. Set up folder structure above (just create empty files/folders for now)

### Phase 2 — Auth Foundation
5. Build `AuthContext.jsx` + `useAuth.js`
6. Build `tokenUtils.js`
7. Build `axiosInstance.js` with token interceptor
8. Build `ProtectedRoute.jsx`
9. Build `AppRoutes.jsx` with all routes

### Phase 3 — Auth Pages
10. `RegisterPage` — form + call `authApi.register()`
11. `LoginPage` — form + call `authApi.login()` + save token
12. `ForgotPasswordPage` → `EmailSimulationPage` → `OtpVerifyPage` → `ResetPasswordPage`

### Phase 4 — Main App
13. `Sidebar.jsx` + `Navbar.jsx`
14. `TweetForm.jsx` + `TweetCard.jsx` + `TweetList.jsx`
15. `HomePage` — feed with compose box + tweet list

### Phase 5 — Profile
16. `ProfileHeader.jsx`
17. `ProfilePage` + `EditProfilePage`

### Phase 6 — Social Features
18. Like button in `TweetCard`
19. Comments section
20. Follow/Unfollow button on `ProfilePage`
21. Repost button

### Phase 7 — Search
22. `SearchPage` with user + tweet search

### Phase 8 — Polish
23. Loading states (`Loader.jsx`)
24. Error messages
25. Responsive layout check

---

## 🔐 Auth Context

**`src/context/AuthContext.jsx`**

```jsx
import { createContext, useState, useEffect } from "react";
import { getToken, saveToken, removeToken } from "../utils/tokenUtils";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(getToken());

  // When app loads, restore user from token if "Remember Me" was used
  useEffect(() => {
    const savedToken = getToken();
    if (savedToken) {
      setToken(savedToken);
      // Optional: call /api/auth/me to get current user info
    }
  }, []);

  const login = (userData, tokenValue, rememberMe) => {
    setUser(userData);
    setToken(tokenValue);
    saveToken(tokenValue, rememberMe); // rememberMe = use localStorage vs sessionStorage
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    removeToken();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

**`src/hooks/useAuth.js`**

```js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export function useAuth() {
  return useContext(AuthContext);
}
```

---

## 🔑 Token Storage (Remember Me)

**`src/utils/tokenUtils.js`**

```js
const TOKEN_KEY = "x_token";

export function saveToken(token, rememberMe = false) {
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);   // stays after browser close
  } else {
    sessionStorage.setItem(TOKEN_KEY, token); // clears when browser closes
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
}
```

---

## 🌐 Axios Setup

**`src/api/axiosInstance.js`**

```js
import axios from "axios";
import { getToken } from "../utils/tokenUtils";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // your backend URL
});

// Automatically attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally (token expired / invalid)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired — redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

## 📡 API Services

**`src/api/authApi.js`**

```js
import axiosInstance from "./axiosInstance";

export const authApi = {
  register: (data) => axiosInstance.post("/auth/register", data),
  login: (data) => axiosInstance.post("/auth/login", data),
  logout: () => axiosInstance.post("/auth/logout"),
  forgotPassword: (email) => axiosInstance.post("/auth/forgot-password", { email }),
  verifyOtp: (data) => axiosInstance.post("/auth/verify-otp", data),  // { email, otp }
  resetPassword: (data) => axiosInstance.post("/auth/reset-password", data), // { email, otp, newPassword }
  resendOtp: (email) => axiosInstance.post("/auth/resend-otp", { email }),
};
```

**`src/api/tweetApi.js`**

```js
import axiosInstance from "./axiosInstance";

export const tweetApi = {
  getFeed: () => axiosInstance.get("/tweets/feed"),
  createTweet: (data) => axiosInstance.post("/tweets", data),         // data = FormData if image
  deleteTweet: (id) => axiosInstance.delete(`/tweets/${id}`),
  likeTweet: (id) => axiosInstance.post(`/tweets/${id}/like`),
  repostTweet: (id) => axiosInstance.post(`/tweets/${id}/repost`),
  getComments: (id) => axiosInstance.get(`/tweets/${id}/comments`),
  addComment: (id, content) => axiosInstance.post(`/tweets/${id}/comments`, { content }),
};
```

**`src/api/userApi.js`**

```js
import axiosInstance from "./axiosInstance";

export const userApi = {
  getProfile: (username) => axiosInstance.get(`/users/${username}`),
  updateProfile: (data) => axiosInstance.put("/users/profile", data),  // FormData
  followUser: (username) => axiosInstance.post(`/users/${username}/follow`),
  unfollowUser: (username) => axiosInstance.delete(`/users/${username}/follow`),
  searchUsers: (query) => axiosInstance.get(`/users/search?q=${query}`),
};
```

---

## 🛡️ Protected Route

**`src/routes/ProtectedRoute.jsx`**

```jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

**`src/routes/AppRoutes.jsx`**

```jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import EmailSimulationPage from "../pages/EmailSimulationPage";
import OtpVerifyPage from "../pages/OtpVerifyPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import EditProfilePage from "../pages/EditProfilePage";
import SearchPage from "../pages/SearchPage";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/email-simulation" element={<EmailSimulationPage />} />
      <Route path="/verify-otp" element={<OtpVerifyPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/profile/:username" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
```

---

## 📧 Email Simulation Page (OTP)

This page simulates a real email inbox. When the user submits Forgot Password, your backend returns the OTP (for dev/simulation only). You pass it to this page via React Router state.

**Flow:**
```
ForgotPasswordPage 
  → POST /auth/forgot-password 
  → backend returns { otp, email }  (simulation only!)
  → navigate("/email-simulation", { state: { otp, email } })
  → User reads OTP from fake inbox UI
  → User goes to /verify-otp and types the OTP
```

**`src/pages/EmailSimulationPage.jsx`** (structure)

```jsx
import { useLocation, useNavigate } from "react-router-dom";

export default function EmailSimulationPage() {
  const { state } = useLocation();   // state.otp, state.email
  const navigate = useNavigate();

  // Design this page like a real email inbox:
  // - Header: "📬 Your Inbox"
  // - Email card: From: "no-reply@x.com", Subject: "Password Reset OTP"
  // - Body: "Your OTP is: XXXXXX"
  // - Button: "Enter OTP" → navigate("/verify-otp", { state: { email: state.email } })
}
```

---

## ⏱️ OTP Timer Component

**`src/components/auth/OtpTimer.jsx`**

```jsx
import { useState, useEffect } from "react";

export default function OtpTimer({ onExpire, onResend }) {
  const [seconds, setSeconds] = useState(120); // 2 minutes

  useEffect(() => {
    if (seconds === 0) {
      onExpire();
      return;
    }
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const format = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div>
      {seconds > 0 ? (
        <p>OTP expires in: <strong>{format(seconds)}</strong></p>
      ) : (
        <button onClick={() => { setSeconds(120); onResend(); }}>
          Resend OTP
        </button>
      )}
    </div>
  );
}
```

---

## 🐦 How to Make a Tweet (with image)

```jsx
import { useState } from "react";
import { tweetApi } from "../api/tweetApi";

export default function TweetForm() {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("content", content);
    if (image) formData.append("image", image);

    try {
      await tweetApi.createTweet(formData);
      setContent("");
      setImage(null);
      // refresh feed
    } catch (err) {
      console.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleSubmit}>Post</button>
    </div>
  );
}
```

---

## 📝 General Coding Rules to Follow

### 1. Every API call goes in `api/` folder, never directly in a component
```js
// ✅ Good
import { authApi } from "../api/authApi";
await authApi.login(formData);

// ❌ Bad — don't do this in a page component
await axios.post("http://localhost:5000/api/auth/login", formData);
```

### 2. Handle errors properly
```js
try {
  const res = await authApi.login(formData);
  // success
} catch (err) {
  const message = err.response?.data?.message || "Login failed";
  setError(message); // show in UI, don't just console.log
}
```

### 3. Loading state for every async action
```jsx
const [loading, setLoading] = useState(false);

const handleLogin = async () => {
  setLoading(true);
  try {
    await authApi.login(data);
  } catch (err) { ... }
  finally {
    setLoading(false);
  }
};

return <button disabled={loading}>{loading ? "Loading..." : "Login"}</button>;
```

### 4. Keep pages thin — logic in hooks or api files
```jsx
// pages/HomePage.jsx — just renders components
export default function HomePage() {
  return (
    <div>
      <TweetForm />
      <TweetList />
    </div>
  );
}
```

### 5. Naming conventions
| Thing | Style | Example |
|---|---|---|
| Component files | PascalCase | `TweetCard.jsx` |
| Hook files | camelCase | `useAuth.js` |
| API files | camelCase | `authApi.js` |
| CSS classes | Tailwind utilities | `className="flex gap-4"` |

---

## 🧰 Which Tool for What Feature

| Feature | Tool/Approach |
|---|---|
| Routing + protected routes | `react-router-dom` |
| Auth state across app | `Context API` (AuthContext) |
| API calls | `axios` via `axiosInstance` |
| UI components (buttons, inputs, dialogs) | `ShadCN UI` |
| Styling / layout | `TailwindCSS` |
| Image upload | `FormData` + `axiosInstance` |
| OTP countdown | Custom `OtpTimer` component with `useEffect` |
| Date formatting | Custom `formatDate.js` util |
| Form handling | `useState` (simple) — no need for a form library for this project |

---

## 🗂️ App.jsx Setup

```jsx
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
```

---

## ✅ Quick Checklist

### Setup
- [ ] Vite + React project created
- [ ] Tailwind configured
- [ ] ShadCN installed
- [ ] Folder structure created

### Auth
- [ ] AuthContext + useAuth hook
- [ ] tokenUtils (remember me logic)
- [ ] axiosInstance with interceptors
- [ ] Register page works
- [ ] Login page works + token saved
- [ ] Logout works + token cleared
- [ ] Forgot Password → Email Simulation → OTP Verify → Reset Password flow works
- [ ] OTP timer (2 min) + resend button

### Core App
- [ ] Protected routes working (redirect to /login if no token)
- [ ] Sidebar + layout visible on protected pages
- [ ] Feed loads tweets
- [ ] Compose tweet works (text + optional image)
- [ ] Like/unlike tweet works
- [ ] Comment on tweet works
- [ ] Repost works

### Profile
- [ ] View own profile
- [ ] View other user's profile
- [ ] Edit profile (name, bio, picture, cover)
- [ ] Follow / unfollow button

### Search
- [ ] Search users by name/username

---

> **Tip for beginners:** Build one small thing at a time, test it, then move to the next. Don't try to build everything at once. Start with login → protected route → homepage → one tweet showing → then keep adding.