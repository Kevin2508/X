# X Clone Frontend - Complete Setup Guide

A modern, responsive Twitter clone frontend built with React, TypeScript, Tailwind CSS, and shadcn components.

## 🚀 Features

- **Authentication System**: Login, Signup, Forgot Password, OTP Verification
- **Feed Page**: Post tweets, see timeline with real-time interactions
- **Tweet Details**: View full tweet thread with comments and replies
- **User Profiles**: View profiles, follow users, see user tweets
- **Notifications**: Real-time notifications for likes, comments, follows
- **Explore Page**: Search tweets and users, discover trending topics
- **Responsive Design**: Fully responsive on mobile, tablet, and desktop
- **Dark Theme**: Modern dark UI inspired by X (Twitter)
- **State Management**: Context API for auth and routing
- **Component Architecture**: Reusable, modular components

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── LoginPage.tsx              # Login with email/password
│   │   ├── SignupPage.tsx             # Two-step signup process
│   │   ├── ForgotPasswordPage.tsx      # Password reset initiation
│   │   ├── VerifyOtpPage.tsx          # OTP verification & password reset
│   │   ├── HomePage.tsx               # Main feed with tweets
│   │   ├── ExplorePage.tsx            # Search and trending
│   │   ├── ProfilePage.tsx            # User profile and tweets
│   │   ├── NotificationsPage.tsx      # Notification center
│   │   ├── PostDetailPage.tsx         # Single tweet with comments
│   │   └── Splash.tsx                 # Loading screen
│   │
│   ├── components/
│   │   ├── MainLayout.tsx             # Main layout wrapper
│   │   ├── Sidebar.tsx                # Navigation sidebar
│   │   ├── Navbar.tsx                 # Top navigation bar
│   │   └── TweetCard.tsx              # Reusable tweet component
│   │
│   ├── context/
│   │   ├── authContext.tsx            # Authentication state
│   │   └── routerContext.tsx          # Client-side routing
│   │
│   ├── types/
│   │   └── index.ts                   # TypeScript type definitions
│   │
│   ├── lib/
│   │   └── dummyData.ts               # Mock data for development
│   │
│   ├── App.tsx                        # Main app component with routing
│   ├── App.css                        # Global styles
│   ├── index.css                      # Tailwind imports
│   └── main.tsx                       # Entry point
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js 16+ and npm 7+
- Modern browser with ES2020 support

### Installation Steps

1. **Install Dependencies**
```bash
cd frontend
npm install
```

2. **Start Development Server**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

3. **Build for Production**
```bash
npm run build
```

4. **Preview Production Build**
```bash
npm run preview
```

## 🔐 Authentication Flow

### Login
- Enter email and password
- Demo mode: Any email/password works
- Redirects to home feed on success

### Signup (Two-Step)
1. **Step 1**: Email and display name
2. **Step 2**: Username and password
- Account created immediately
- Auto-redirects to feed

### Forgot Password
1. Enter email
2. Receive OTP code
3. Enter new password

## 📱 Pages Overview

### 1. **LoginPage** (`/login`)
- Email and password authentication
- "Forgot password" link
- Sign up link
- Demo credentials info

### 2. **SignupPage** (`/signup`)
- Multi-step signup process
- Email validation
- Password strength validation
- Auto-login after signup

### 3. **HomePage** (`/home`)
- Tweet composer
- Live feed
- Real-time interactions
- Post creation

### 4. **ExplorePage** (`/explore`)
- Search functionality
- Trending topics
- User search
- Tweet search

### 5. **ProfilePage** (`/profile`)
- User profile information
- Tweet history
- Follow/Unfollow button
- Profile stats (followers, following)

### 6. **NotificationsPage** (`/notifications`)
- Likes, comments, retweets, follows
- Notification icons and colors
- Mark as read
- Navigate to profiles

### 7. **PostDetailPage** (`/post-detail`)
- Full tweet view
- Comments and replies
- Nested reply threads
- Interaction counts

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6)
- **Background**: Black (#000000)
- **Secondary**: Gray (#374151 - #6B7280)
- **Accents**: Red (likes), Green (retweets)

### Typography
- **Display**: Geist Font (16+)
- **Body**: Tailwind defaults
- **Weights**: 400 (regular), 600 (bold), 700 (extra bold)

### Components
- **Buttons**: Rounded, 8px border radius
- **Inputs**: Dark background, blue focus state
- **Cards**: Subtle hover effects
- **Icons**: Lucide React icons (20-24px)

## 🔌 API Integration Guide

The app is ready for backend integration. Here's how to connect:

### 1. **Authentication Service**
```typescript
// Replace dummy login in LoginPage.tsx
const response = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

### 2. **Tweet Management**
```typescript
// Replace dummy tweets in HomePage.tsx
const tweets = await fetch('/api/tweets').then(r => r.json());
```

### 3. **User Profiles**
```typescript
// Replace dummy users in ProfilePage.tsx
const user = await fetch(`/api/users/${userId}`).then(r => r.json());
```

### 4. **Real-time Updates**
Consider adding WebSocket for:
- Live notifications
- Real-time feed updates
- Online presence

## 📦 Dependencies

### Core
- **React** 19.2.5 - UI framework
- **TypeScript** 6.0 - Type safety
- **Vite** 8.0 - Build tool

### UI & Styling
- **Tailwind CSS** 4.2.4 - Utility-first CSS
- **lucide-react** 1.9.0 - Icons
- **react-icons** 5.6.0 - Alternative icons
- **class-variance-authority** 0.7.1 - Component variants

### Dev Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TS linting

## 🚦 State Management

### AuthContext
Manages:
- Current user data
- Authentication status
- Login/Logout actions

```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

### RouterContext
Manages:
- Current page
- Navigation state
- Page parameters

```typescript
const { currentPage, navigate, pageParams, goBack } = useRouter();
```

## 📝 Mock Data

Dummy data is provided for development:
- **5 Demo Users**: Complete profiles with bios
- **5 Sample Tweets**: Various content types
- **3 Comments**: With nested replies
- **5 Notifications**: Different types

Edit `src/lib/dummyData.ts` to customize.

## 🎯 Getting Started

1. **First Time Setup**
   ```bash
   npm install
   npm run dev
   ```

2. **Demo Login**
   - Email: any email
   - Password: any password
   - Role: Full access

3. **Explore Features**
   - Post tweets
   - Like/Retweet
   - Visit profiles
   - Check notifications

4. **Connect Backend**
   - Replace dummy data calls with API calls
   - Update context with real data
   - Add error handling

## 🔒 Security Notes

- All authentication is demo-only for now
- No real JWT tokens currently
- Data persists in localStorage (demo only)
- Replace with secure backend before production

## 📚 Component Props

### TweetCard
```typescript
<TweetCard 
  tweet={tweet} 
  onLike={(tweetId) => handleLike(tweetId)}
/>
```

### MainLayout
```typescript
<MainLayout showSidebar={true}>
  {children}
</MainLayout>
```

## 🛠️ Customization

### Change Logo
Replace `𝕏` in Sidebar.tsx with your own

### Change Colors
Update Tailwind color classes across components

### Add New Pages
1. Create page in `src/pages/`
2. Add route in `routerContext.tsx`
3. Add case in `App.tsx` switch statement

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (md)
- **Tablet**: 768px - 1024px (lg)
- **Desktop**: > 1024px

## ⚡ Performance Tips

1. Use React DevTools Profiler
2. Memoize expensive components
3. Lazy load images
4. Optimize bundle size
5. Use virtual scrolling for large lists

## 🐛 Troubleshooting

**Port 5173 already in use?**
```bash
npm run dev -- --port 3000
```

**TypeScript errors?**
```bash
npm run build
```

**Tailwind classes not working?**
- Restart dev server
- Clear cache: `npm run dev -- --force`

## 📖 Additional Resources

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev)
- [Lucide Icons](https://lucide.dev)

## 📝 Notes for Backend Integration

1. **API Base URL**: Set up environment variables
   ```env
   VITE_API_URL=http://localhost:5000
   ```

2. **Authentication**: Update auth context with JWT
3. **Error Handling**: Add try-catch and error toasts
4. **Loading States**: Add skeleton loaders
5. **Pagination**: Implement for feeds
6. **Real-time**: Add WebSocket support

## 📄 License

This is a demo/training project. Customize as needed.

---

**Happy Coding! 🚀**
