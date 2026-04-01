# Archive - Tech Stack Document

**Version:** 1.0  
**Date:** 2025  
**Status:** MVP  

---

## Technology Stack Overview

Archive is built on a modern, scalable, serverless stack optimized for rapid development and zero infrastructure management.

```
Frontend (Web UI)
     ↓
Next.js 14 (TypeScript)
     ↓
Shadcn UI Components + Tailwind CSS
     ↓
Clerk Authentication
     ↓
Convex Backend (Database + Functions)
     ↓
External Services (Cloudinary, TMDB, APIs)
```

---

## Frontend Stack

### Core Framework: Next.js 14 with TypeScript

**Why Next.js?**
- App Router (file-based routing)
- Built-in image optimization
- API routes (if needed)
- Automatic code splitting
- Serverless deployment (Vercel)
- Full TypeScript support

**Version:** 14.x (latest stable)

**Node.js:** v18 or higher

**Key Packages:**
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "react-dom": "^18.0.0",
  "typescript": "^5.0.0"
}
```

### UI Component Library: Shadcn UI

**Why Shadcn?**
- Built on Radix UI (accessible primitives)
- Customizable with Tailwind CSS
- Copy-paste components (not npm package)
- Minimal dependencies
- Perfect for minimalist design

**Components Used:**
- Button, Input, Textarea (forms)
- Card, Badge, Dialog (layout)
- DropdownMenu, Tabs, Sidebar (navigation)
- Select, Checkbox, RadioGroup (form controls)
- Toast, AlertDialog (feedback)

**Installation:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input search
```

### Styling: Tailwind CSS

**Why Tailwind?**
- Utility-first CSS
- Minimal bundle size
- Consistent design system
- Easy theming
- Works perfectly with shadcn

**Config:**
- Customize colors: sage green (#9CAF88), warm taupe (#D4C4B8)
- Font: Inter for body, monospace for code
- Spacing: 8px/12px/16px/24px grid

**Tailwind Config:**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        sage: '#9CAF88',
        taupe: '#D4C4B8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
}
```

### Authentication: Clerk

**Why Clerk?**
- Handles all auth logic (signup, login, oauth, 2FA)
- Pre-built sign-up/login pages
- JWT tokens
- Session management
- User metadata storage
- Free tier: 10k monthly active users
- Integrates with Convex

**Features Used:**
- Email/password signup
- OAuth (Google, GitHub, Apple)
- User profiles (avatar, name, email)
- Environment variables for keys

**Implementation:**
```typescript
// src/app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}

// Use in components
import { useUser } from '@clerk/nextjs'

export default function Component() {
  const { user } = useUser()
  return <div>Hello {user?.firstName}</div>
}
```

### State Management: Convex Real-Time (+ Zustand optional)

**Why Convex over Redux/Zustand?**
- Real-time data synchronization out of the box
- No need for manual state management for database queries
- Mutations auto-update UI
- Convex handles optimistic updates

**Optional: Zustand for UI State**
- For local UI state (modals, filters, sidebar toggle)
- Lightweight alternative to Redux
- Not needed for MVP

```bash
npm install zustand
```

### Routing & Navigation

**File-based routing (Next.js App Router):**
```
src/app/
  ├── page.tsx                    # Landing page (/)
  ├── sign-in/[[...index]]/       # /sign-in (Clerk)
  ├── sign-up/[[...index]]/       # /sign-up (Clerk)
  ├── dashboard/
  │   ├── layout.tsx              # Dashboard layout (protected)
  │   ├── page.tsx                # /dashboard (main)
  │   ├── [folderId]/page.tsx     # /dashboard/[folderId]
  │   └── item/[itemId]/page.tsx  # /dashboard/item/[itemId]
  ├── explore/page.tsx            # /explore
  ├── @[username]/page.tsx        # /@username (public profile)
  ├── pricing/page.tsx            # /pricing
  └── layout.tsx                  # Root layout
```

**Link Navigation:**
```typescript
import Link from 'next/link'

export default function Nav() {
  return (
    <Link href="/dashboard">Dashboard</Link>
  )
}
```

---

## Backend Stack

### Database & Backend: Convex

**Why Convex?**
- Serverless database (no server management)
- Real-time sync (WebSocket built-in)
- Full-text search support
- Automatic scaling
- Free tier: 2GB storage, 100M function calls/month
- Type-safe TypeScript API
- Integrates with Clerk for auth

**Architecture:**
- **Tables:** 11 tables (users, items, folders, collections, follows, etc.)
- **Mutations:** Write operations (create, update, delete, like)
- **Queries:** Read operations (fetch items, search, get trending)
- **Actions:** External API calls (TMDB, Cloudinary)
- **Webhooks:** Stripe webhook handling

**Key Concepts:**

1. **Schema Definition**
```typescript
// convex/schema.ts
export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    username: v.string(),
    // ...
  }).index("by_clerkId", ["clerkId"]),
  
  items: defineTable({
    userId: v.id("users"),
    folderId: v.id("folders"),
    title: v.string(),
    // ...
  }).index("by_userId", ["userId"]),
})
```

2. **Mutations (Write)**
```typescript
// convex/items.ts
export const createItem = mutation({
  args: {
    folderId: v.id("folders"),
    title: v.string(),
    // ...
  },
  handler: async (ctx, args) => {
    // Auth, validate, write to DB
    const itemId = await ctx.db.insert("items", {
      // ...
    })
    return { itemId }
  },
})
```

3. **Queries (Read)**
```typescript
export const getItems = query({
  args: { folderId: v.id("folders") },
  handler: async (ctx, args) => {
    const items = await ctx.db
      .query("items")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .take(20)
    return items
  },
})
```

4. **Actions (External Calls)**
```typescript
export const searchMovies = action({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    const response = await fetch(
      `https://api.themoviedb.org/...?query=${args.query}`
    )
    return await response.json()
  },
})
```

**Development:**
```bash
npm install convex
npx convex init
npm run convex:dev  # Watches schema & syncs
```

### Authentication Backend: Clerk (via Convex)

**Integration:**
- Convex reads Clerk JWT tokens
- `getAuthUserId()` in Convex functions
- User identity passed from frontend to backend

```typescript
// In Convex mutations/queries
const userId = await auth.getUserId(ctx)
if (!userId) throw new Error("Not authenticated")
```

---

## External Services & APIs

### Image Storage & Optimization: Cloudinary

**Why Cloudinary?**
- Free tier: 25GB storage, 100 transformations/month
- Auto image optimization
- Responsive images
- CDN delivery
- One-click upload from frontend

**Features:**
- Upload images from browser
- Auto-generate thumbnails
- Optimize for web
- Serve from global CDN

**Implementation:**
```typescript
// src/lib/cloudinary.ts
import { CldUploadWidget } from 'next-cloudinary'

export default function ImageUpload() {
  return (
    <CldUploadWidget
      uploadPreset="archive_preset"
      onSuccess={(result) => {
        console.log(result.info.secure_url)
      }}
    >
      {({ open }) => (
        <button onClick={() => open()}>Upload Image</button>
      )}
    </CldUploadWidget>
  )
}
```

### Movie Data: TMDB API

**Why TMDB?**
- Free API (no cost)
- 500k+ movies & TV shows
- Metadata: poster, synopsis, cast, director, ratings
- Rate limit: 40 requests/10 seconds (plenty for MVP)

**Usage:**
```typescript
// In Convex action
const response = await fetch(
  `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${key}`
)
const data = await response.json()
return data.results
```

### Book Data: Open Library API

**Why Open Library?**
- 100% free
- 2M+ books
- No API key required
- Rate limit: ~100 requests/IP/second

**Usage:**
```typescript
const response = await fetch(
  `https://openlibrary.org/search.json?title=${title}`
)
```

### Music/Lyrics: Genius API

**Why Genius?**
- Song lyrics & artist info
- Free API
- Rate limit: 10 requests/second

**Usage:**
```typescript
const response = await fetch(
  `https://api.genius.com/search?q=${query}&access_token=${key}`
)
```

### Optional: Spotify API (Phase 2)

**For:**
- Sync user's Spotify listening history
- Music recommendations
- Playlist integration

**Status:** Phase 2+ (not MVP)

---

## Hosting & Deployment

### Frontend Hosting: Vercel

**Why Vercel?**
- Made by Next.js creators
- Automatic deployment from GitHub
- Edge functions
- Global CDN
- Free tier: 100GB bandwidth/month
- Environment variable management

**Deployment:**
```bash
# Just git push
git push origin main
# Vercel auto-deploys
```

### Backend Hosting: Convex (Managed)

**No additional setup needed.** Convex is managed service.

### Database: Convex (Managed)

**No additional setup needed.** Built into Convex.

---

## Development Tools

### Package Manager: npm

**Version:** 9+ (comes with Node.js 18+)

**Key Commands:**
```bash
npm install              # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm start               # Start production build
npm run convex:dev      # Sync Convex schema
```

### Version Control: Git + GitHub

**Workflow:**
```bash
git clone https://github.com/username/archive.git
cd archive
npm install
npm run dev
# Make changes
git add .
git commit -m "message"
git push origin main
```

### Environment Variables: .env.local

**Local development file (don't commit):**
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=cloud_name
CLOUDINARY_API_KEY=api_key
```

**Production (Vercel):**
- Add same variables in Vercel dashboard
- Vercel injects at build time

### Code Quality

**TypeScript:**
- Strict mode enabled
- Full type safety

**ESLint:**
- Installed with Next.js
- Catches common mistakes

**Optional: Prettier**
```bash
npm install -D prettier
```

---

## Testing (Optional, Phase 2+)

**For MVP:** Manual testing is fine

**Phase 2+ suggestions:**
- Jest + React Testing Library (unit tests)
- Playwright (E2E tests)
- Vitest (faster than Jest)

```bash
npm install -D jest @testing-library/react
```

---

## Performance Optimization

### Image Optimization (Vercel + Cloudinary)

```typescript
import Image from 'next/image'

export default function ItemImage({ url }) {
  return (
    <Image
      src={url}
      alt="Item"
      width={300}
      height={300}
      placeholder="blur"
    />
  )
}
```

### Code Splitting (Next.js automatic)

**Dynamic imports for large components:**
```typescript
import dynamic from 'next/dynamic'

const Dashboard = dynamic(() => import('@/components/Dashboard'), {
  loading: () => <p>Loading...</p>,
})
```

### Database Indexing (Convex)

```typescript
// In schema.ts
items: defineTable({
  userId: v.id("users"),
  // ...
}).index("by_userId", ["userId"])  // Index for fast queries
```

---

## Security

### HTTPS / TLS

**Automatic with Vercel** (Let's Encrypt)

### Environment Variables

**Never commit secrets:**
```
.env.local (local development)
Vercel dashboard (production)
```

### Authentication

**Clerk handles:**
- Password hashing
- Session tokens
- OAuth security
- 2FA

### Database Authorization

**In Convex functions:**
```typescript
const userId = await auth.getUserId(ctx)
if (!userId) throw new Error("Not authenticated")
if (item.userId !== userId) throw new Error("Not authorized")
```

---

## Scaling Considerations

### Database

Current schema supports:
- 100k+ users
- 1TB+ data
- Real-time sync for 1000+ concurrent users

**When to scale:**
- At 10k+ users: Consider caching layer
- At 100k+ users: Database read replicas (Phase 3)

### Storage

Cloudinary free tier:
- 25GB storage
- 100 transformations/month

**When to upgrade:**
- At 25GB: Upgrade to paid tier ($50-500/month)

### Frontend

Vercel scales automatically:
- Edge functions at 250+ regions
- Automatic load balancing
- No additional config needed

### API Rate Limits

- TMDB: 40 requests/10 seconds ✅
- Open Library: 100 requests/second ✅
- Genius: 10 requests/second ✅

All well within MVP needs.

---

## Technology Decisions & Rationale

| Component | Choice | Alternative | Why |
|-----------|--------|-------------|-----|
| Frontend | Next.js | React SPA | Better SEO, faster initial load |
| UI Kit | Shadcn | Material-UI | More minimalist, customizable |
| Backend | Convex | Firebase | Real-time, type-safe, free tier |
| Auth | Clerk | Auth0 | Pre-built UI, easier integration |
| Images | Cloudinary | AWS S3 | Optimization included, CDN |
| Hosting | Vercel | AWS | Automatic deployments, cheaper |
| Styling | Tailwind | CSS-in-JS | Minimal bundle, utility-first |

---

## Cost Breakdown (Monthly, MVP Phase)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | 100GB bandwidth | $0 |
| Convex | 2GB storage, 100M calls | $0 |
| Cloudinary | 25GB storage | $0 |
| Clerk | 10k MAU | $0 |
| TMDB | 40 req/10s | $0 |
| Open Library | Unlimited | $0 |
| Genius | 10 req/s | $0 |
| Domain | - | ~$15 |
| **TOTAL** | | **~$15/month** |

**After 10k users:**
- Vercel: $20-50/month (additional bandwidth)
- Convex: $0-50/month (depends on usage)
- Cloudinary: $0-100/month (if using paid features)
- Domain: $15/month
- **Total: ~$50-200/month**

---

## Dependencies Summary

```json
{
  "core": [
    "next@14.x",
    "react@18.x",
    "typescript@5.x"
  ],
  "ui": [
    "tailwindcss@3.x",
    "shadcn-ui",
    "@radix-ui/react-*"
  ],
  "auth": [
    "@clerk/nextjs"
  ],
  "backend": [
    "convex"
  ],
  "cloud": [
    "next-cloudinary"
  ],
  "optional": [
    "zustand (state management)"
  ]
}
```

---

## Development Checklist

- [ ] Node.js v18+ installed
- [ ] GitHub repo created
- [ ] Next.js project initialized
- [ ] Convex initialized & schema added
- [ ] Clerk keys in .env.local
- [ ] Cloudinary keys in .env.local
- [ ] Tailwind configured
- [ ] shadcn components installed
- [ ] Root layout set up (ClerkProvider)
- [ ] Local dev server working (`npm run dev`)
- [ ] Vercel connected to GitHub
- [ ] Environment variables in Vercel
- [ ] Production deployment working

