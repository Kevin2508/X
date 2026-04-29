# UI Components & Design System

## 🎨 Component Library

All components are built with Tailwind CSS and follow a consistent design system inspired by Twitter/X.

## 🧩 Core Components

### 1. **TweetCard**
**Location:** `src/components/TweetCard.tsx`

**Usage:**
```tsx
<TweetCard 
  tweet={tweet} 
  onLike={(tweetId) => handleLike(tweetId)}
/>
```

**Features:**
- User avatar & info
- Verified badge
- Tweet content
- Media preview
- Interaction buttons
- Hover effects

**Styling:**
- Hover: `hover:bg-gray-900/50`
- Borders: `border-b border-gray-700`
- Rounded: `rounded-full` (buttons)

### 2. **Sidebar**
**Location:** `src/components/Sidebar.tsx`

**Features:**
- Logo/brand button
- Navigation menu
- Post button
- User profile menu
- Logout button

**Navigation Items:**
- Home
- Explore
- Messages
- Bookmarks
- Notifications

### 3. **Navbar**
**Location:** `src/components/Navbar.tsx`

**Features:**
- Back button (context-aware)
- Page title
- Sticky positioning
- Backdrop blur effect

### 4. **MainLayout**
**Location:** `src/components/MainLayout.tsx`

**Structure:**
```
┌─────────────────────────────────────────┐
│         Navbar (Sticky)                 │
├──────────────┬──────────────┬───────────┤
│              │              │           │
│   Sidebar    │   Main       │  Search   │
│              │   Content    │  Sidebar  │
│              │              │           │
│              │              │           │
└──────────────┴──────────────┴───────────┘
```

**Responsive:**
- Mobile: Sidebar hidden
- Tablet: Sidebar visible
- Desktop: All visible

## 🎨 Design Tokens

### Colors

**Backgrounds:**
- Primary: `#000000` (black)
- Secondary: `#111111` (gray-950)
- Tertiary: `#1a1a1a` (gray-900)
- Input: `#374151` (gray-700)

**Text:**
- Primary: `#ffffff` (white)
- Secondary: `#6b7280` (gray-500)
- Muted: `#4b5563` (gray-600)

**Accents:**
- Primary: `#3b82f6` (blue-600)
- Success: `#10b981` (green-500)
- Danger: `#ef4444` (red-500)
- Warning: `#f59e0b` (amber-500)

**Borders:**
- Light: `#e5e7eb` (gray-200)
- Dark: `#374151` (gray-700)
- Divider: `#1f2937` (gray-800)

### Typography

**Font Family:** 
- Primary: `ui-sans-serif, system-ui, -apple-system`
- Fallback: `Geist Variable, Segoe UI, Roboto`

**Font Sizes:**
- Display: `2rem (32px)` - Logo, main titles
- Heading: `1.5rem (24px)` - Page titles
- Title: `1.25rem (20px)` - Section titles
- Large: `1.125rem (18px)` - Card headers
- Body: `1rem (16px)` - Main text
- Small: `0.875rem (14px)` - Secondary text
- Tiny: `0.75rem (12px)` - Metadata

**Font Weights:**
- Regular: 400
- Medium: 500
- Bold: 600
- Extra Bold: 700

### Spacing

**Scale:** `4px`
- xs: `0.25rem` (4px)
- sm: `0.5rem` (8px)
- md: `1rem` (16px)
- lg: `1.5rem` (24px)
- xl: `2rem` (32px)
- 2xl: `3rem` (48px)

## 🔘 Interactive Elements

### Buttons

**Primary Button:**
```tsx
<button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full 
                   hover:bg-blue-700 transition-colors disabled:opacity-50">
  Post
</button>
```

**Secondary Button:**
```tsx
<button className="border border-gray-700 text-white font-bold py-2 px-4 
                   rounded-full hover:bg-gray-900/50 transition-colors">
  Follow
</button>
```

**Icon Button:**
```tsx
<button className="p-2 hover:bg-blue-500/10 rounded-full transition-colors text-gray-500 
                   hover:text-blue-500">
  <Heart size={18} />
</button>
```

### Input Fields

**Text Input:**
```tsx
<input 
  type="text"
  placeholder="What's happening?!"
  className="w-full bg-transparent text-white placeholder-gray-500 
             outline-none resize-none text-2xl"
/>
```

**Form Input:**
```tsx
<input
  type="email"
  placeholder="you@example.com"
  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 
             py-2.5 text-white placeholder-gray-500 focus:outline-none 
             focus:border-blue-500 transition-colors"
/>
```

### Form Validation

**Error Message:**
```tsx
<div className="bg-red-900/20 border border-red-800 rounded-lg p-3 
                text-red-400 text-sm">
  {error}
</div>
```

**Success Message:**
```tsx
<div className="bg-green-900/20 border border-green-800 rounded-lg p-3 
                text-green-400 text-sm">
  Success!
</div>
```

## 🖼️ Cards & Containers

**Tweet Card:**
```tsx
<div className="border-b border-gray-700 p-4 hover:bg-gray-900/50 
                transition-colors cursor-pointer">
  {/* Content */}
</div>
```

**Profile Card:**
```tsx
<div className="p-4 border border-gray-700 rounded-lg hover:bg-gray-900/50 
                transition-colors">
  {/* User info */}
</div>
```

**Modal/Dialog:**
```tsx
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
  <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-md">
    {/* Content */}
  </div>
</div>
```

## 🎭 State Variations

### Hover States
```tsx
className="hover:bg-gray-900/50 transition-colors"
```

### Active/Selected States
```tsx
className={isActive ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}
```

### Disabled States
```tsx
className="disabled:opacity-50 disabled:cursor-not-allowed"
```

### Focus States
```tsx
className="focus:outline-none focus:ring-2 focus:ring-blue-500"
```

## 📐 Layout Patterns

### Three Column Layout
```
┌──────┬──────────────┬──────┐
│ Left │   Center     │ Right│
│ 256px│  600-1000px  │ 288px│
└──────┴──────────────┴──────┘
```

### Two Column Layout
```
┌──────┬──────────────────┐
│ Left │   Center         │
│ 256px│  Full remaining  │
└──────┴──────────────────┘
```

### Full Width Single Column
```
┌──────────────────────────┐
│      Center              │
│  600px max width        │
└──────────────────────────┘
```

## ✨ Animations & Transitions

**Standard Transition:**
```tsx
className="transition-colors duration-200"
```

**Smooth Fade:**
```tsx
className="opacity-0 hover:opacity-100 transition-opacity"
```

**Slide In:**
```tsx
className="translate-x-0 transition-transform duration-300"
```

**Pulse (Loading):**
```tsx
className="animate-pulse"
```

**Bounce:**
```tsx
className="animate-bounce"
```

## 🎯 Icon Usage

**Lucide React Icons:**
```tsx
import { Heart, MessageCircle, Repeat2, Share } from 'lucide-react';

<Heart size={18} />           // Small icon
<MessageCircle size={24} />   // Medium icon
<Repeat2 size={20} />         // Standard
<Share size={16} />           // Compact
```

**Icon with Color:**
```tsx
<Heart size={18} className="text-red-500" />
<Repeat2 size={18} className="text-green-500" />
```

**Filled vs Outline:**
```tsx
<Heart size={18} />                    // Outline
<Heart size={18} fill="currentColor"/> // Filled
```

## 📱 Responsive Design

### Breakpoints

**Mobile First (Default):**
```tsx
className="text-base"           // Mobile: 16px
```

**Tablet & Up (md: 768px):**
```tsx
className="text-base md:text-lg" // Tablet+: 18px
```

**Desktop & Up (lg: 1024px):**
```tsx
className="md:block lg:w-72"    // Hidden mobile, visible desktop
```

### Responsive Hiding

**Hide on Mobile:**
```tsx
className="hidden md:flex" // Show on tablet & up
```

**Show on Mobile Only:**
```tsx
className="md:hidden" // Hide on tablet & up
```

## 🌈 Component Examples

### Tweet Card with All States
```tsx
<TweetCard
  tweet={{
    ...tweet,
    is_liked: true,              // Red like button
    is_retweeted: true,          // Green retweet
    likes_count: 100,
  }}
  onLike={handleLike}
/>
```

### Profile Card Interactive
```tsx
<div className="p-4 border-b border-gray-700 hover:bg-gray-900/50 
                cursor-pointer transition-colors"
     onClick={() => navigate('profile', { userId: user.user_id })}>
  <div className="flex items-center gap-3">
    <img src={user.profile_image} className="w-12 h-12 rounded-full" />
    <div className="flex-1">
      <h4 className="font-bold">{user.display_name}</h4>
      <p className="text-gray-500 text-sm">@{user.user_name}</p>
    </div>
  </div>
</div>
```

### Form with Validation
```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  {error && <ErrorMessage message={error} />}
  
  <div>
    <label className="block text-sm font-medium mb-2">Email</label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 
                 py-2.5 focus:border-blue-500"
    />
  </div>
  
  <button type="submit" disabled={loading}
          className="w-full bg-blue-600 py-3 rounded-full font-bold 
                     hover:bg-blue-700 disabled:opacity-50">
    {loading ? 'Loading...' : 'Submit'}
  </button>
</form>
```

## 🎨 Color Palette Reference

```
Primary Blue:     #3B82F6  (used for interactive elements)
Success Green:    #10B981  (for positive actions)
Danger Red:       #EF4444  (for destructive actions)
Warning Amber:    #F59E0B  (for warnings)

Background Black: #000000  (main background)
Gray 900:         #111111  (cards, containers)
Gray 800:         #1F2937  (borders)
Gray 700:         #374151  (inputs, secondary)
Gray 600:         #4B5563  (muted text)
Gray 500:         #6B7280  (secondary text)

White:            #FFFFFF  (primary text)
```

## 📚 Component Sizes

**Avatar:**
- Small: `w-8 h-8` (32px)
- Medium: `w-12 h-12` (48px)
- Large: `w-16 h-16` (64px)

**Buttons:**
- Compact: `py-1 px-3` (Small buttons)
- Standard: `py-2 px-4` (Normal buttons)
- Large: `py-3 px-6` (CTA buttons)

**Icons:**
- Small: `size={16}`
- Standard: `size={18}-20`
- Large: `size={24}`

---

This design system ensures consistency across all components and makes it easy to extend with new designs!
