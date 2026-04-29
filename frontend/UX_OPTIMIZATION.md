# Frontend UX & Developer Guide

## 🎮 User Experience Enhancements

### Keyboard Shortcuts to Add

Consider adding these keyboard shortcuts for better UX:

```typescript
// In HomePage.tsx or MainLayout.tsx
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Ctrl/Cmd + Enter: Post tweet
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleTweet();
    }
    
    // Ctrl/Cmd + K: Focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInputRef.current?.focus();
    }
    
    // Escape: Close modals
    if (e.key === 'Escape') {
      closeModal();
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

### Loading States

Add skeleton loaders for better perceived performance:

```typescript
// src/components/TweetSkeleton.tsx
export const TweetSkeleton = () => (
  <div className="border-b border-gray-700 p-4 animate-pulse">
    <div className="flex gap-3">
      <div className="w-12 h-12 bg-gray-900 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-gray-900 rounded w-1/3 mb-2" />
        <div className="h-4 bg-gray-900 rounded w-2/3 mb-3" />
        <div className="h-12 bg-gray-900 rounded w-full" />
      </div>
    </div>
  </div>
);
```

### Toast Notifications

Add success/error messages:

```typescript
// src/components/Toast.tsx
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

export const Toast = ({ message, type, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      // Remove toast
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  const colors = {
    success: 'bg-green-900 text-green-200',
    error: 'bg-red-900 text-red-200',
    info: 'bg-blue-900 text-blue-200',
  };

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg ${colors[type]}`}>
      {message}
    </div>
  );
};
```

## 🎯 Performance Optimization

### Code Splitting

Add lazy loading for pages:

```typescript
// src/App.tsx
import { lazy, Suspense } from 'react';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const HomePage = lazy(() => import('./pages/HomePage'));

function AppContent() {
  return (
    <Suspense fallback={<Splash />}>
      {/* Routes */}
    </Suspense>
  );
}
```

### Memoization

Prevent unnecessary re-renders:

```typescript
// src/components/TweetCard.tsx
import { memo } from 'react';

const TweetCard = memo(({ tweet, onLike }: TweetCardProps) => {
  // Component
}, (prev, next) => {
  // Custom comparison
  return prev.tweet.tweet_id === next.tweet.tweet_id;
});

export default TweetCard;
```

### Virtual Scrolling

For large tweet lists:

```typescript
import { FixedSizeList } from 'react-window';

export const TweetList = ({ tweets }: { tweets: Tweet[] }) => {
  const Row = ({ index, style }: any) => (
    <div style={style}>
      <TweetCard tweet={tweets[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={tweets.length}
      itemSize={120}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
};
```

## 🌙 Theme Support

### Dark/Light Mode

```typescript
// src/context/themeContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('dark');

  const toggleTheme = () => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
    localStorage.setItem('theme', theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === 'dark' ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be within ThemeProvider');
  return context;
};
```

## 📱 Mobile Optimizations

### Mobile Menu

```typescript
// src/components/MobileMenu.tsx
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button 
        className="md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      
      {open && (
        <div className="fixed inset-0 bg-black z-50">
          {/* Mobile navigation */}
        </div>
      )}
    </>
  );
};
```

### Touch Optimizations

```typescript
// Increase touch targets on mobile
className="p-3 md:p-2" // Larger padding on mobile

// Prevent zoom on input focus
<input
  type="text"
  style={{ fontSize: '16px' }} // Prevents auto-zoom on iOS
/>
```

## ♿ Accessibility Improvements

### ARIA Labels

```typescript
// Add to all interactive elements
<button
  aria-label="Like tweet"
  aria-pressed={isLiked}
  onClick={handleLike}
>
  <Heart />
</button>

// Add to images
<img 
  src={user.profile_image}
  alt={`${user.display_name} profile picture`}
/>
```

### Keyboard Navigation

```typescript
// Make everything keyboard accessible
<button
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAction();
    }
  }}
>
  Action
</button>
```

### Focus Management

```typescript
// Visible focus rings
className="focus:outline-none focus:ring-2 focus:ring-blue-500"

// Focus trap in modals
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      // Keep focus within modal
    }
  };
  
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

## 🔍 SEO Considerations

### Meta Tags

```typescript
// public/index.html
<meta name="description" content="Connect with friends on X" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta property="og:title" content="X Clone" />
<meta property="og:description" content="Share your thoughts" />
```

### Open Graph Images

```typescript
<meta property="og:image" content="/og-image.png" />
<meta property="og:type" content="website" />
```

## 📊 Analytics Integration

```typescript
// src/utils/analytics.ts
export const trackEvent = (event: string, data?: Record<string, any>) => {
  // Send to analytics service
  if (window.gtag) {
    window.gtag('event', event, data);
  }
};

// Usage in components
const handleTweet = async () => {
  await tweetService.create(content);
  trackEvent('tweet_created', { characterCount: content.length });
};
```

## 🧪 Testing Setup

### Install Testing Libraries

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest
```

### Example Test

```typescript
// src/components/__tests__/TweetCard.test.tsx
import { render, screen } from '@testing-library/react';
import TweetCard from '../TweetCard';
import { dummyTweets } from '../../lib/dummyData';

describe('TweetCard', () => {
  it('renders tweet content', () => {
    render(<TweetCard tweet={dummyTweets[0]} />);
    
    expect(screen.getByText(dummyTweets[0].content)).toBeInTheDocument();
  });

  it('displays user info', () => {
    render(<TweetCard tweet={dummyTweets[0]} />);
    
    expect(screen.getByText(dummyTweets[0].user.display_name)).toBeInTheDocument();
  });
});
```

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] All TypeScript errors fixed
- [ ] ESLint warnings addressed
- [ ] No console errors
- [ ] Test all pages
- [ ] Test all interactions
- [ ] Mobile responsive check
- [ ] Performance audit
- [ ] Accessibility audit
- [ ] Remove console.logs
- [ ] Update environment variables

### Build Process
```bash
# Build for production
npm run build

# Preview before deploying
npm run preview

# Test optimized build
npm run build && npm run preview
```

### Deployment Platforms

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm run build
# Drag dist folder to Netlify
```

#### GitHub Pages
```bash
npm run build
# Push dist to gh-pages branch
```

## 🔒 Security Best Practices

### XSS Prevention
```typescript
// Always use text content, not dangerouslySetInnerHTML
<p>{userInput}</p> // Safe

// Never use:
<p dangerouslySetInnerHTML={{ __html: userInput }} /> // Unsafe
```

### CSRF Protection
```typescript
// Include CSRF token in API calls
const api = async (endpoint: string, options: RequestInit = {}) => {
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  
  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(csrfToken && { 'X-CSRF-Token': csrfToken }),
      ...options.headers,
    },
  });
};
```

## 🐛 Debugging Tips

### React DevTools
- Inspect component props
- Track state changes
- Profile performance
- Search components

### Redux DevTools
For future state management upgrades

### Network Tab
- Check API responses
- Monitor network timing
- Debug failed requests

### Console Tips
```typescript
// Log component renders
useEffect(() => {
  console.log('Component mounted');
  return () => console.log('Component unmounted');
}, []);

// Log prop changes
useEffect(() => {
  console.log('Props changed:', { tweet, onLike });
}, [tweet, onLike]);
```

## 📈 Monitoring & Analytics

### Error Tracking
```typescript
// Integrate with Sentry
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring
```typescript
// Use Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

---

Use these enhancements to make your application more robust and user-friendly!
