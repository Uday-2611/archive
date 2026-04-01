# Archive - Frontend Guidelines & Design System

**Version:** 1.0  
**Date:** 2025  

---

## Design Philosophy

Archive follows a **Swiss minimalist design aesthetic** with editorial sensibility. Every pixel serves a purpose. No decoration without function.

**Core Principles:**
1. **Clarity** — Clear hierarchy, intuitive navigation
2. **Simplicity** — Remove all non-essential elements
3. **Consistency** — Same patterns everywhere
4. **Accessibility** — Works for everyone
5. **Performance** — Fast, snappy interactions

---

## Color System

### Primary Palette

**Neutral Base:**
- Off-white: `#FAFAF8` (backgrounds)
- White: `#FFFFFF` (cards, modals)
- Deep charcoal: `#2C2C2C` (text)
- Medium gray: `#7C7C8C` (secondary text)
- Light gray: `#E8E8E8` (borders)

**Brand Accent Colors:**
- Sage Green: `#9CAF88` (primary accent, buttons, links)
- Warm Taupe: `#D4C4B8` (secondary accent, highlights)
- Slate Blue: `#6B7A8E` (tertiary, info)

**Semantic Colors:**
- Success: `#10B981` (green)
- Warning: `#F59E0B` (amber)
- Error: `#EF4444` (red)
- Info: `#3B82F6` (blue)

### Usage Rules

```
Primary action buttons → Sage Green (#9CAF88)
Links → Sage Green (#9CAF88)
Hover states → Darken by 10%
Disabled → Gray (#7C7C8C) at 50% opacity
Success messages → Green (#10B981)
Errors → Red (#EF4444)
Borders → Light gray (#E8E8E8) at 0.5px
```

### Tailwind Config

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F5F7F4',
          100: '#E8EBE5',
          500: '#9CAF88',
          600: '#8FA074',
          700: '#7A8A63',
        },
        taupe: {
          50: '#F9F7F5',
          100: '#F0ECEA',
          500: '#D4C4B8',
          600: '#C4B2A4',
        },
        slate: {
          500: '#6B7A8E',
          700: '#4A556B',
        },
        charcoal: '#2C2C2C',
      },
      fontSize: {
        xs: '12px',
        sm: '13px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
    },
  },
}
```

---

## Typography

### Font Families

**Body & Headlines:** Inter (Google Fonts)
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Monospace (Code, timestamps):** Fira Code (Google Fonts)
```css
font-family: 'Fira Code', 'Courier New', monospace;
```

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| h1 | 32px | 600 | 1.2 | Page titles |
| h2 | 24px | 600 | 1.3 | Section headers |
| h3 | 20px | 600 | 1.4 | Subsection headers |
| h4 | 18px | 600 | 1.4 | Card titles |
| body | 16px | 400 | 1.6 | Body text |
| small | 13px | 400 | 1.5 | Secondary text, captions |
| xs | 12px | 400 | 1.4 | Timestamps, badges |
| mono | 14px | 400 | 1.5 | Code blocks |

### Usage Examples

```typescript
// src/components/Typography.tsx

// Page Title
<h1 className="text-3xl font-semibold text-charcoal">
  My Archive
</h1>

// Section Header
<h2 className="text-2xl font-semibold text-charcoal mt-8 mb-4">
  Collections
</h2>

// Body Text
<p className="text-base text-charcoal leading-relaxed">
  Save and organize everything from the web.
</p>

// Secondary Text
<p className="text-sm text-slate-500">
  Last updated 2 hours ago
</p>

// Badge / Small Label
<span className="text-xs font-medium text-sage-600 bg-sage-50 px-2 py-1 rounded">
  Design
</span>
```

---

## Spacing System

8px grid-based spacing (powers of 8):
- `2px` - 0.25x (hairlines, borders)
- `4px` - 0.5x (tight spacing)
- `8px` - 1x (base unit)
- `12px` - 1.5x
- `16px` - 2x (standard)
- `24px` - 3x
- `32px` - 4x
- `40px` - 5x
- `48px` - 6x (large sections)

### Tailwind Spacing

```typescript
// In tailwind config
spacing: {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
}
```

### Usage

```typescript
// Padding
<div className="p-4">p-4 (16px padding all sides)</div>
<div className="px-6 py-4">Horizontal 24px, vertical 16px</div>

// Margin
<div className="mt-8 mb-6">Top 32px, bottom 24px</div>

// Gap (flexbox)
<div className="flex gap-4">Items with 16px gap</div>
<div className="grid grid-cols-3 gap-6">Grid with 24px gap</div>
```

---

## Components & Patterns

### Buttons

**Default Button (Primary Action)**
```typescript
<button className="px-4 py-2 bg-sage-500 text-white rounded-md font-medium hover:bg-sage-600 transition-colors duration-150">
  Save
</button>
```

**Secondary Button**
```typescript
<button className="px-4 py-2 bg-white border border-gray-200 text-charcoal rounded-md font-medium hover:bg-gray-50">
  Cancel
</button>
```

**Tertiary Button (Text-only)**
```typescript
<button className="text-sage-500 font-medium hover:underline">
  Learn more
</button>
```

**Disabled Button**
```typescript
<button disabled className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
  Disabled
</button>
```

**Danger Button (Delete)**
```typescript
<button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
  Delete
</button>
```

### Cards

**Basic Card**
```typescript
<div className="bg-white border border-gray-200 rounded-lg p-6">
  <h3 className="text-lg font-semibold text-charcoal mb-2">
    Card Title
  </h3>
  <p className="text-sm text-slate-500">
    Card content goes here
  </p>
</div>
```

**Hover Card (Clickable)**
```typescript
<div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-sage-200 cursor-pointer transition-all duration-150">
  Content
</div>
```

**Item Card (Grid)**
```typescript
<div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all">
  {/* Image */}
  <div className="aspect-square bg-gray-100 overflow-hidden">
    <img src={imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
  </div>
  
  {/* Content */}
  <div className="p-4">
    <h4 className="font-semibold text-sm text-charcoal truncate">
      Title
    </h4>
    <p className="text-xs text-slate-500 mt-1">
      Tags
    </p>
  </div>
</div>
```

### Input Fields

**Text Input**
```typescript
<input
  type="text"
  placeholder="Type something..."
  className="w-full px-4 py-2 border border-gray-200 rounded-md text-base text-charcoal placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent transition"
/>
```

**Textarea**
```typescript
<textarea
  placeholder="Write a description..."
  className="w-full px-4 py-2 border border-gray-200 rounded-md text-base text-charcoal resize-vertical focus:outline-none focus:ring-2 focus:ring-sage-500"
  rows={4}
/>
```

**Search Bar**
```typescript
<div className="relative">
  <input
    type="search"
    placeholder="Search items..."
    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-sage-500"
  />
  <svg className="absolute left-3 top-2.5 w-5 h-5 text-slate-400">
    {/* Search icon */}
  </svg>
</div>
```

### Badges & Tags

**Tag Pill**
```typescript
<span className="inline-flex items-center gap-2 px-3 py-1 bg-sage-50 text-sage-700 text-xs font-medium rounded-full">
  Design
  <button className="ml-1 hover:text-sage-900">×</button>
</span>
```

**Type Badge**
```typescript
<span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded">
  LINK
</span>
```

### Modals & Dialogs

**Modal Template**
```typescript
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
    {/* Header */}
    <div className="flex justify-between items-center p-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold text-charcoal">
        Modal Title
      </h2>
      <button className="text-slate-400 hover:text-charcoal">
        ✕
      </button>
    </div>
    
    {/* Body */}
    <div className="p-6">
      <p className="text-base text-charcoal">
        Modal content
      </p>
    </div>
    
    {/* Footer */}
    <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
      <button className="px-4 py-2 border border-gray-200 rounded-md text-charcoal hover:bg-gray-50">
        Cancel
      </button>
      <button className="px-4 py-2 bg-sage-500 text-white rounded-md hover:bg-sage-600">
        Confirm
      </button>
    </div>
  </div>
</div>
```

### Toast Notifications

**Toast Success**
```typescript
<div className="fixed bottom-6 right-6 bg-white border border-green-200 text-green-800 px-4 py-3 rounded-md shadow-lg flex items-center gap-3 z-50 animate-slide-up">
  <svg className="w-5 h-5">✓</svg>
  <span>Item saved successfully</span>
  <button className="ml-2">✕</button>
</div>
```

**Toast Error**
```typescript
<div className="fixed bottom-6 right-6 bg-white border border-red-200 text-red-800 px-4 py-3 rounded-md shadow-lg flex items-center gap-3">
  <svg className="w-5 h-5">!</svg>
  <span>Failed to save item</span>
</div>
```

### Loading States

**Skeleton Loader**
```typescript
<div className="bg-gray-200 animate-pulse rounded-lg h-48 w-full mb-4" />
<div className="bg-gray-200 animate-pulse rounded h-4 w-3/4 mb-2" />
<div className="bg-gray-200 animate-pulse rounded h-4 w-1/2" />
```

**Spinner**
```typescript
<div className="inline-block animate-spin">
  <svg className="w-6 h-6 text-sage-500" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.1" />
    <path fill="currentColor" d="..." opacity="0.7" />
  </svg>
</div>
```

---

## Layout Patterns

### Dashboard Layout

```typescript
// src/app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-200 overflow-y-auto">
        {/* Navigation */}
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          {/* Search, user menu */}
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

### Grid Layout (Items)

```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {items.map(item => (
    <ItemCard key={item._id} item={item} />
  ))}
</div>
```

**Responsive Breakpoints:**
- Mobile: 1 column (< 640px)
- Tablet: 2 columns (640px - 1024px)
- Desktop: 3 columns (1024px - 1280px)
- Large: 4 columns (> 1280px)

### Sidebar Navigation

```typescript
<nav className="space-y-1 p-4">
  <NavLink href="/dashboard">
    📁 My Archive
  </NavLink>
  
  <div className="pt-4 border-t border-gray-200">
    <p className="text-xs font-semibold text-slate-500 uppercase px-2 mb-2">
      Folders
    </p>
    {folders.map(folder => (
      <FolderNavItem key={folder._id} folder={folder} />
    ))}
  </div>
</nav>
```

---

## Interactions & Animations

### Transitions

**Duration guidelines:**
- Fast hover effects: 150ms
- Loading transitions: 200ms
- Page transitions: 300ms
- Modal animations: 200ms

```typescript
// Tailwind transition utilities
className="transition-all duration-150 hover:scale-105"
className="transition-colors duration-200 hover:bg-gray-50"
```

### Hover States

**Button Hover**
- Darken background by 10%
- Add subtle shadow (optional)

**Card Hover**
- Add shadow: `shadow-md`
- Slightly lighten border

**Link Hover**
- Underline or change color
- Maintain 150ms transition

### Focus States

**Keyboard Focus (for accessibility)**
```typescript
className="focus:outline-none focus:ring-2 focus:ring-sage-500"
```

All interactive elements must have visible focus state for keyboard navigation.

### Scroll Behavior

**Smooth scrolling (opt-in)**
```css
html {
  scroll-behavior: smooth;
}
```

---

## Responsive Design

### Breakpoints (Tailwind)

```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Mobile-First Approach

```typescript
// Default for mobile
<div className="flex flex-col gap-4">

// Tablet up
<div className="md:flex-row md:gap-6">

// Desktop up
<div className="lg:flex-row lg:gap-8">
```

### Common Responsive Patterns

**Sidebar Collapse on Mobile**
```typescript
<aside className="hidden md:block w-60">
  {/* Desktop sidebar */}
</aside>

<button className="md:hidden">
  {/* Mobile hamburger */}
</button>
```

**Grid Responsiveness**
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

---

## Accessibility

### Semantic HTML

```typescript
// Good
<nav>{navigation}</nav>
<main>{content}</main>
<article>{post}</article>
<section>
  <h2>Section Title</h2>
</section>

// Avoid
<div>Navigation here</div>
<div>Main content</div>
```

### ARIA Labels

```typescript
<button aria-label="Close modal">×</button>
<img alt="User avatar" src={avatarUrl} />
<input aria-label="Search items" placeholder="Search..." />
```

### Color Contrast

**WCAG AA Requirements:**
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 ratio

All text must meet these standards. Test with: WebAIM contrast checker

### Focus Management

```typescript
// Focus ring on buttons/links
className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sage-500"

// Visible focus for keyboard users
```

### Screen Readers

- Use semantic HTML (`<button>`, `<a>`, `<nav>`, etc.)
- Provide alt text for images
- Label form inputs with `<label>`
- Use ARIA attributes when needed

---

## Component Library Structure

```
src/components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Toast.tsx
│   └── ...
├── layout/
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── DashboardLayout.tsx
├── features/
│   ├── ItemCard.tsx
│   ├── FolderTree.tsx
│   ├── SearchBar.tsx
│   └── UploadButton.tsx
└── common/
    ├── Loading.tsx
    ├── Empty.tsx
    └── Error.tsx
```

---

## Code Examples

### Button Component (shadcn style)

```typescript
// src/components/ui/Button.tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-sage-500 text-white hover:bg-sage-600",
        outline: "border border-gray-200 hover:bg-gray-50",
        ghost: "hover:bg-gray-100",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  )
)
```

### Card Component

```typescript
// src/components/ui/Card.tsx
export const Card = ({ children, className = "" }) => (
  <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
    {children}
  </div>
)

export const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
)

export const CardContent = ({ children, className = "" }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
)

export const CardFooter = ({ children, className = "" }) => (
  <div className={`px-6 py-4 border-t border-gray-200 flex gap-3 justify-end ${className}`}>
    {children}
  </div>
)
```

---

## Performance Considerations

### Image Optimization

```typescript
import Image from 'next/image'

<Image
  src={imageUrl}
  alt="Item thumbnail"
  width={300}
  height={300}
  quality={75}
  placeholder="blur"
  className="rounded-lg"
/>
```

### Code Splitting

```typescript
import dynamic from 'next/dynamic'

const Dashboard = dynamic(() => import('@/components/Dashboard'), {
  loading: () => <Skeleton />,
  ssr: true,
})
```

### CSS Performance

- Use Tailwind purge (auto in production)
- Avoid inline styles
- Prefer CSS classes

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: Latest versions

No IE11 support.

---

## Design Tokens (Figma-ready)

All values exported as variables for design consistency:

```typescript
// src/lib/designTokens.ts
export const colors = {
  sage: '#9CAF88',
  taupe: '#D4C4B8',
  charcoal: '#2C2C2C',
  // ...
}

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  // ...
}
```

