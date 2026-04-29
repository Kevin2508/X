# Frontend Architecture & Component Guide

## Overview

The X Clone frontend follows a **layered architecture** with clear separation of concerns:

```
Routing Layer (RouterContext)
    ↓
Auth Layer (AuthContext)
    ↓
Pages (Business Logic)
    ↓
Components (UI)
    ↓
Utilities & Types
```

## 📋 Types & Interfaces

All TypeScript types are defined in `src/types/index.ts`:

### User Interface
```typescript
interface User {
  user_id: number;
  display_name: string;
  user_name: string;
  email: string;
  profile_image?: string;
  is_verified: boolean;
  followers_count: number;
  following_count: number;
  created_at: string;
}
```

### Tweet Interface
```typescript
interface Tweet {
  tweet_id: number;
  user_id: number;
  user: User;
  content: string;
  media?: TweetMedia[];
  likes_count: number;
  retweets_count: number;
  comments_count: number;
  is_liked: boolean;
  is_retweeted: boolean;
  created_at: string;
}
```

### Comment Interface
```typescript
interface Comment {
  comment_id: number;
  user_id: number;
  user: User;
  tweet_id: number;
  content: string;
  parent_comment_id?: number;
  replies: Comment[];
  likes_count: number;
  is_liked: boolean;
  created_at: string;
}
```

## 🔄 Context APIs

### AuthContext (`src/context/authContext.tsx`)

**Provides:**
- `user` - Current authenticated user
- `isAuthenticated` - Auth status boolean
- `login(user)` - Set user and token
- `logout()` - Clear user and token
- `setUser(user)` - Update user data

**Usage:**
```typescript
const { user, isAuthenticated, login, logout } = useAuth();
```

**Features:**
- LocalStorage persistence
- Auto-restore on page refresh
- No token validation (for demo)

### RouterContext (`src/context/routerContext.tsx`)

**Provides:**
- `currentPage` - Active page name
- `navigate(page, params)` - Change page
- `pageParams` - Current page parameters
- `goBack()` - Return to previous page
- `previousPage` - Track navigation history

**Supported Pages:**
- `login` - Login page
- `signup` - Signup page
- `forgot-password` - Password reset
- `verify-otp` - OTP verification
- `home` - Main feed
- `explore` - Search & trending
- `profile` - User profile
- `notifications` - Notification center
- `post-detail` - Single tweet view

**Usage:**
```typescript
const { currentPage, navigate, pageParams } = useRouter();

// Navigate with parameters
navigate('profile', { userId: 123 });

// Access parameters
const userId = pageParams.userId;
```

## 🎨 Page Components

### LoginPage
**Route:** login  
**Purpose:** User authentication  
**State:**
- email, password, showPassword
- loading, error

**Features:**
- Form validation
- Error handling
- Forgot password link
- Signup link
- Demo mode

### SignupPage
**Route:** signup  
**Purpose:** User registration  
**State:**
- Multi-step form (2 steps)
- Form data, loading, error

**Features:**
- Email validation
- Password strength check
- Password confirmation
- Auto-login after signup

### ForgotPasswordPage
**Route:** forgot-password  
**Purpose:** Password reset initiation  
**Features:**
- Email input
- Success message
- Auto-redirect to OTP

### VerifyOtpPage
**Route:** verify-otp  
**Purpose:** OTP verification & password reset  
**State:**
- otp, newPassword, confirmPassword
- Two-step process

**Features:**
- 6-digit OTP input
- Password reset form
- Resend OTP button

### HomePage
**Route:** home  
**Purpose:** Main feed  
**State:**
- tweets (array)
- tweetContent (string)

**Features:**
- Tweet composer
- Live feed
- Real-time interactions
- Like/unlike
- Add new tweets

### ExplorePage
**Route:** explore  
**Purpose:** Search & discovery  
**State:**
- searchQuery
- selectedTab (top/latest/people)

**Features:**
- Full-text search
- Search tweets
- Search users
- Trending section
- Tabs for results

### ProfilePage
**Route:** profile (params: userId)  
**Purpose:** User profile  
**State:**
- isFollowing
- userTweets

**Features:**
- Cover image
- User stats
- Follow/Unfollow
- Tweet feed
- Tabs (Posts/Replies/Likes)

### NotificationsPage
**Route:** notifications  
**Purpose:** Notification center  
**Features:**
- Notification types (like, comment, retweet, follow)
- Unread indicator
- Navigate to profiles
- Notification icons

### PostDetailPage
**Route:** post-detail (params: tweetId)  
**Purpose:** Full tweet view  
**State:**
- comments (array)
- commentText, replyTo
- liked, likesCount, retweeted

**Features:**
- Tweet detail view
- Comments section
- Reply to tweet
- Nested replies
- Interaction stats

## 🧩 Reusable Components

### MainLayout
**Location:** `src/components/MainLayout.tsx`

**Props:**
```typescript
interface MainLayoutProps {
  children: ReactNode;
  showSidebar?: boolean; // default: true
}
```

**Features:**
- Responsive three-column layout
- Sidebar navigation
- Top navbar
- Search sidebar (desktop)
- Safe scrolling area

### Sidebar
**Location:** `src/components/Sidebar.tsx`

**Features:**
- Logo/brand button
- Navigation links
- Post button
- User menu
- Logout button

**Navigation Items:**
- Home
- Explore
- Messages
- Bookmarks
- Notifications

### Navbar
**Location:** `src/components/Navbar.tsx`

**Features:**
- Back button (when navigable)
- Page title
- Sticky positioning
- Backdrop blur

### TweetCard
**Location:** `src/components/TweetCard.tsx`

**Props:**
```typescript
interface TweetCardProps {
  tweet: Tweet;
  onLike?: (tweetId: number) => void;
}
```

**Features:**
- User info display
- Tweet content
- Media preview
- Interaction buttons
- Hover effects
- Verified badge

**Interactions:**
- Like/Unlike
- Comment counter
- Retweet counter
- Share button

## 📊 Mock Data (`src/lib/dummyData.ts`)

### dummyUsers
5 sample users with complete profiles:
- Sarah Johnson (verified)
- Alex Developer (verified)
- Emma Wilson
- Marcus Tech (verified)
- Lisa Chen

### dummyTweets
5 sample tweets with:
- User references
- Various content types
- Interaction counts
- Media support

### dummyComments
3 sample comments with:
- Nested replies
- User references
- Like counts

### Utility Functions
- `formatTimeAgo(date)` - Convert date to relative time
- `getCurrentUser()` - Get current user mock data

## 🎯 Routing Logic

The main routing is handled in `App.tsx`:

```typescript
function AppContent() {
  const { currentPage } = useRouter();
  const { isAuthenticated } = useAuth();

  // Auth pages (not authenticated)
  if (!isAuthenticated) {
    return <AuthPagesSwitch />;
  }

  // Main app pages (authenticated)
  return <AppPagesSwitch />;
}
```

**Auth Pages:**
- login (default)
- signup
- forgot-password
- verify-otp

**App Pages:**
- home (default)
- explore
- profile
- notifications
- post-detail

## 🔄 Data Flow

### Authentication Flow
```
LoginPage
  ↓
login() in AuthContext
  ↓
localStorage update
  ↓
useAuth() hook notified
  ↓
App re-renders
  ↓
navigate('home')
```

### Tweet Interaction Flow
```
TweetCard (user clicks like)
  ↓
onLike callback
  ↓
HomePage state update
  ↓
setTweets([modified tweets])
  ↓
TweetCard re-renders with updated like
```

### Navigation Flow
```
User clicks sidebar link
  ↓
navigate('profile', { userId })
  ↓
RouterContext state updates
  ↓
App.tsx re-renders
  ↓
ProfilePage displays with params
```

## 🎨 Styling Approach

### Tailwind CSS
- Utility-first CSS framework
- Dark theme by default
- Responsive design (mobile-first)
- Consistent spacing scale
- Color palette matching Twitter

### CSS Classes Pattern
```typescript
// Responsive classes
className="w-full md:w-64 lg:w-72"

// State classes
className={`px-4 py-2 ${isActive ? 'bg-blue-600' : 'bg-gray-900'}`}

// Hover & transition
className="hover:bg-gray-900 transition-colors"

// Grid & flexbox
className="flex gap-4 items-center"
```

## 🚀 Adding New Pages

### Step 1: Create Page Component
```typescript
// src/pages/NewPage.tsx
import MainLayout from '../components/MainLayout';
import { useRouter } from '../context/routerContext';

export default function NewPage() {
  const { navigate } = useRouter();

  return (
    <MainLayout>
      {/* Content */}
    </MainLayout>
  );
}
```

### Step 2: Add Route Type
```typescript
// src/context/routerContext.tsx
type Page = '...' | 'new-page';
```

### Step 3: Add to Router
```typescript
// src/App.tsx
import NewPage from './pages/NewPage';

case 'new-page':
  return <NewPage />;
```

### Step 4: Add Navigation
```typescript
// In any component
const { navigate } = useRouter();
navigate('new-page');
```

## 🧪 Testing Tips

### Component Testing
- Test with mock data from `dummyData.ts`
- Use React DevTools for state inspection
- Test responsive breakpoints

### Integration Testing
- Test navigation flows
- Test auth flows
- Test data updates

### Accessibility
- Keyboard navigation
- ARIA labels
- Color contrast

## 📦 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Output
- Optimized bundle in `dist/`
- Minified CSS and JS
- Source maps for debugging

## 🔐 Security Considerations

### Current (Demo)
- No real authentication
- Data in localStorage
- No HTTPS required

### For Production
- Implement JWT tokens
- HTTPS only
- Secure cookies
- CSRF protection
- Input sanitization
- XSS prevention

## 📈 Performance Optimizations

1. **Code Splitting**: Pages are separate components
2. **Lazy Loading**: Consider React.lazy() for pages
3. **Memoization**: Use React.memo() for TweetCard
4. **Virtual Scrolling**: For large lists
5. **Image Optimization**: Use DiceBear for avatars

---

This architecture provides a solid foundation for a Twitter-like application with room for scaling and adding new features!
