# Backend Integration Guide

This guide explains how to connect the frontend to your Node.js backend API.

## 🔌 Environment Setup

### 1. Create `.env.local` file

```env
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=10000
```

### 2. Create API Service Layer

Create `src/services/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
};

export default api;
```

## 🔐 Authentication API Integration

### 1. Update LoginPage

Replace dummy authentication in `src/pages/LoginPage.tsx`:

```typescript
import api from '../services/api';

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    // Store token
    localStorage.setItem('token', response.token);

    // Create user object from response
    const user = {
      user_id: response.user.user_id,
      user_name: response.user.user_name,
      email: response.user.email,
      display_name: response.user.display_name,
      profile_image: response.user.profile_image,
    };

    login(user);
    navigate('home');
  } catch (error) {
    setError('Invalid email or password');
  } finally {
    setLoading(false);
  }
};
```

### 2. Update SignupPage

```typescript
const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await api('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: formData.email,
        display_name: formData.displayName,
        user_name: formData.username,
        password: formData.password,
      }),
    });

    localStorage.setItem('token', response.token);

    const user = {
      user_id: response.user.user_id,
      user_name: response.user.user_name,
      email: response.user.email,
      display_name: response.user.display_name,
      profile_image: response.user.profile_image,
    };

    login(user);
    navigate('home');
  } catch (error) {
    setError('Signup failed. Try again.');
  } finally {
    setLoading(false);
  }
};
```

### 3. Password Reset Flow

```typescript
// ForgotPasswordPage
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    await api('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    
    setSubmitted(true);
    navigate('verify-otp', { email });
  } catch (error) {
    setError('Failed to send reset code');
  }
};

// VerifyOtpPage
const handleVerifyOtp = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    await api('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email: pageParams.email, otp }),
    });
    
    setStep('password');
  } catch (error) {
    setError('Invalid OTP');
  }
};
```

## 📰 Tweets API Integration

### 1. Create Tweet Service

Create `src/services/tweetService.ts`:

```typescript
import api from './api';
import type { Tweet } from '../types';

export const tweetService = {
  // Get all tweets
  getAll: async (skip = 0, limit = 20): Promise<Tweet[]> => {
    return api(`/api/tweets?skip=${skip}&limit=${limit}`);
  },

  // Get single tweet
  getById: async (tweetId: number): Promise<Tweet> => {
    return api(`/api/tweets/${tweetId}`);
  },

  // Get user tweets
  getByUserId: async (userId: number): Promise<Tweet[]> => {
    return api(`/api/tweets/user/${userId}`);
  },

  // Create tweet
  create: async (content: string, media?: File[]): Promise<Tweet> => {
    const formData = new FormData();
    formData.append('content', content);
    
    if (media) {
      media.forEach((file) => formData.append('media', file));
    }

    return api('/api/tweets', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },

  // Update tweet
  update: async (tweetId: number, content: string): Promise<Tweet> => {
    return api(`/api/tweets/${tweetId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  },

  // Delete tweet
  delete: async (tweetId: number): Promise<void> => {
    return api(`/api/tweets/${tweetId}`, {
      method: 'DELETE',
    });
  },

  // Like tweet
  like: async (tweetId: number): Promise<void> => {
    return api(`/api/tweets/${tweetId}/like`, {
      method: 'POST',
    });
  },

  // Unlike tweet
  unlike: async (tweetId: number): Promise<void> => {
    return api(`/api/tweets/${tweetId}/like`, {
      method: 'DELETE',
    });
  },

  // Retweet
  retweet: async (tweetId: number): Promise<void> => {
    return api(`/api/tweets/${tweetId}/retweet`, {
      method: 'POST',
    });
  },

  // Remove retweet
  removeRetweet: async (tweetId: number): Promise<void> => {
    return api(`/api/tweets/${tweetId}/retweet`, {
      method: 'DELETE',
    });
  },
};
```

### 2. Update HomePage

```typescript
import { tweetService } from '../services/tweetService';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const data = await tweetService.getAll();
        setTweets(data);
      } catch (error) {
        console.error('Failed to fetch tweets');
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  const handleTweet = async () => {
    if (!tweetContent.trim()) return;

    try {
      const newTweet = await tweetService.create(tweetContent);
      setTweets([newTweet, ...tweets]);
      setTweetContent('');
    } catch (error) {
      console.error('Failed to post tweet');
    }
  };

  const handleLike = async (tweetId: number) => {
    try {
      const tweet = tweets.find((t) => t.tweet_id === tweetId);
      
      if (tweet?.is_liked) {
        await tweetService.unlike(tweetId);
      } else {
        await tweetService.like(tweetId);
      }

      // Update local state
      setTweets(
        tweets.map((t) =>
          t.tweet_id === tweetId
            ? {
                ...t,
                is_liked: !t.is_liked,
                likes_count: t.is_liked ? t.likes_count - 1 : t.likes_count + 1,
              }
            : t
        )
      );
    } catch (error) {
      console.error('Failed to like tweet');
    }
  };

  return (
    // ... existing JSX with updated handlers
  );
}
```

## 👥 User API Integration

### 1. Create User Service

Create `src/services/userService.ts`:

```typescript
import api from './api';
import type { User } from '../types';

export const userService = {
  // Get current user
  getCurrentUser: async (): Promise<User> => {
    return api('/api/users/me');
  },

  // Get user by ID
  getById: async (userId: number): Promise<User> => {
    return api(`/api/users/${userId}`);
  },

  // Get user by username
  getByUsername: async (username: string): Promise<User> => {
    return api(`/api/users/username/${username}`);
  },

  // Update profile
  updateProfile: async (data: Partial<User>): Promise<User> => {
    return api('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Update profile image
  updateProfileImage: async (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('profile_image', file);

    return api('/api/users/me/profile-image', {
      method: 'PUT',
      body: formData,
      headers: {}, // Let browser set Content-Type
    });
  },

  // Search users
  search: async (query: string): Promise<User[]> => {
    return api(`/api/search/users?q=${encodeURIComponent(query)}`);
  },
};
```

### 2. Update ProfilePage

```typescript
import { userService } from '../services/userService';

export default function ProfilePage() {
  const [profileUser, setProfileUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = pageParams?.userId || user?.user_id;
        const userData = await userService.getById(userId);
        setProfileUser(userData);
      } catch (error) {
        console.error('Failed to fetch profile');
      }
    };

    fetchProfile();
  }, [pageParams?.userId, user?.user_id]);

  return (
    // ... with profileUser data
  );
}
```

## 🔔 Notifications API Integration

### 1. Create Notification Service

```typescript
import api from './api';
import type { Notification } from '../types';

export const notificationService = {
  // Get notifications
  getAll: async (): Promise<Notification[]> => {
    return api('/api/notifications');
  },

  // Mark as read
  markAsRead: async (notificationId: number): Promise<void> => {
    return api(`/api/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },
};
```

### 2. Update NotificationsPage

```typescript
import { notificationService } from '../services/notificationService';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getAll();
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications');
      }
    };

    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    // ... with notifications data
  );
}
```

## 👥 Follow API Integration

### 1. Create Follow Service

```typescript
import api from './api';

export const followService = {
  // Follow user
  follow: async (userId: number): Promise<void> => {
    return api(`/api/follows/${userId}`, {
      method: 'POST',
    });
  },

  // Unfollow user
  unfollow: async (userId: number): Promise<void> => {
    return api(`/api/follows/${userId}`, {
      method: 'DELETE',
    });
  },

  // Get followers
  getFollowers: async (userId: number) => {
    return api(`/api/follows/${userId}/followers`);
  },

  // Get following
  getFollowing: async (userId: number) => {
    return api(`/api/follows/${userId}/following`);
  },

  // Check if following
  isFollowing: async (userId: number): Promise<boolean> => {
    const response = await api(`/api/follows/check/${userId}`);
    return response.is_following;
  },
};
```

### 2. Update ProfilePage

```typescript
const handleFollow = async () => {
  try {
    if (isFollowing) {
      await followService.unfollow(profileUser.user_id);
    } else {
      await followService.follow(profileUser.user_id);
    }
    
    setIsFollowing(!isFollowing);
  } catch (error) {
    console.error('Failed to follow/unfollow');
  }
};
```

## 💬 Comments API Integration

### 1. Create Comment Service

```typescript
import api from './api';
import type { Comment } from '../types';

export const commentService = {
  // Get comments for tweet
  getByTweetId: async (tweetId: number): Promise<Comment[]> => {
    return api(`/api/tweets/${tweetId}/comments`);
  },

  // Create comment
  create: async (tweetId: number, content: string): Promise<Comment> => {
    return api(`/api/tweets/${tweetId}/comment`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  // Delete comment
  delete: async (commentId: number): Promise<void> => {
    return api(`/api/comments/${commentId}`, {
      method: 'DELETE',
    });
  },

  // Like comment
  like: async (commentId: number): Promise<void> => {
    return api(`/api/comments/${commentId}/like`, {
      method: 'POST',
    });
  },

  // Unlike comment
  unlike: async (commentId: number): Promise<void> => {
    return api(`/api/comments/${commentId}/like`, {
      method: 'DELETE',
    });
  },
};
```

### 2. Update PostDetailPage

```typescript
import { commentService } from '../services/commentService';

const handleAddComment = async () => {
  if (!commentText.trim()) return;

  try {
    const newComment = await commentService.create(tweet.tweet_id, commentText);
    setComments([...comments, newComment]);
    setCommentText('');
  } catch (error) {
    console.error('Failed to post comment');
  }
};
```

## ⚠️ Error Handling

### Create Global Error Handler

```typescript
// src/services/api.ts
const api = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      // ... options
    });

    if (response.status === 401) {
      // Token expired - logout user
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `Error ${response.status}`);
    }

    return response.json();
  } catch (error) {
    // Log error, show toast, etc
    console.error('API Error:', error);
    throw error;
  }
};
```

## 🔄 Real-time Updates with WebSocket

### Add WebSocket Support

```typescript
// src/services/websocket.ts
class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(url: string, token: string) {
    this.ws = new WebSocket(url);
    
    this.ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      this.emit(type, data);
    };
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach((cb) => cb(data));
  }

  disconnect() {
    this.ws?.close();
  }
}

export default new WebSocketService();
```

### Use in App

```typescript
useEffect(() => {
  const token = localStorage.getItem('token');
  
  if (token && isAuthenticated) {
    wsService.connect('ws://localhost:5000', token);
    
    // Listen for new tweets
    wsService.on('new-tweet', (tweet) => {
      setTweets([tweet, ...tweets]);
    });

    // Listen for notifications
    wsService.on('notification', (notification) => {
      setNotifications([notification, ...notifications]);
    });
  }

  return () => wsService.disconnect();
}, [isAuthenticated]);
```

## 📝 Testing API Integration

### Use Postman or cURL

```bash
# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Get tweets
curl http://localhost:5000/api/tweets \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create tweet
curl -X POST http://localhost:5000/api/tweets \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"Hello World!"}'
```

## ✅ Checklist for Full Integration

- [ ] Set up `.env.local` with API URL
- [ ] Create API service files
- [ ] Update authentication flow
- [ ] Implement tweet CRUD operations
- [ ] Add user profile integration
- [ ] Implement follow/unfollow
- [ ] Add notifications
- [ ] Implement comments
- [ ] Set up error handling
- [ ] Add loading states
- [ ] Implement pagination
- [ ] Add real-time updates (WebSocket)
- [ ] Test all endpoints
- [ ] Implement refresh token logic
- [ ] Add proper error messages

---

Once integrated with the backend, remove all mock data usage and the app will be fully functional!
