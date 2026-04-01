# Archive - Implementation Plan & Development Timeline

**Version:** 1.0  
**Date:** 2025  
**Target Launch:** 8 weeks  

---

## Overview

This document outlines the complete implementation roadmap from project initialization to public launch.

**Resources:**
- 1 full-time developer (you)
- Part-time help for design review / feedback (optional)

**Timeline:** 8 weeks to MVP launch

---

## Phase 1: Setup & Foundation (Week 1)

### Objectives
- [ ] Project initialized locally
- [ ] All services connected (Convex, Clerk, Cloudinary)
- [ ] Development environment ready
- [ ] GitHub repo set up with basic structure

### Tasks

**Monday-Tuesday: Initial Setup (Day 1-2)**

```
1. Create GitHub repository
   - Name: "archive"
   - .gitignore: Node
   - Initial README

2. Local project setup
   - npx create-next-app (with TS, Tailwind)
   - npm install convex clerk cloudinary shadcn
   - Create .env.local with placeholders

3. Push initial commit
   - git add .
   - git commit -m "Initial setup"
   - git push origin main
```

**Wednesday: Service Integration (Day 3)**

```
1. Convex setup
   - npx convex init
   - Create convex/schema.ts (copy from docs)
   - npm run convex:dev (verify)

2. Clerk setup
   - Create Clerk account
   - Get API keys
   - Add to .env.local
   - Update src/app/layout.tsx with ClerkProvider

3. Cloudinary setup
   - Create Cloudinary account
   - Get Cloud Name & API Key
   - Add to .env.local
```

**Thursday-Friday: Project Structure (Day 4-5)**

```
1. Create folder structure
   src/
   ├── app/
   │   ├── layout.tsx
   │   ├── page.tsx (landing)
   │   └── dashboard/ (empty for now)
   ├── components/
   │   ├── ui/ (shadcn components)
   │   └── common/
   ├── lib/
   │   └── utils.ts
   └── hooks/

2. Test local dev
   - npm run dev
   - npm run convex:dev
   - Verify no errors

3. Deploy to Vercel (optional, but recommended)
   - Connect GitHub repo to Vercel
   - Add environment variables
   - Test deployment
```

**Deliverables:**
- Working Next.js app running locally
- All services configured
- Empty dashboard route protected by Clerk
- README with setup instructions

---

## Phase 2: Core Frontend (Week 2-3)

### Objectives
- [ ] Landing page complete
- [ ] Sign-up/login pages functional
- [ ] Dashboard skeleton built
- [ ] Sidebar and navigation working

### Week 2: Landing Page & Auth

**Monday-Tuesday: Landing Page (Day 6-7)**

```
Build src/app/page.tsx:
- Hero section
  - Headline: "Save Everything. Organize Anything."
  - Subheading
  - CTA button: "Start Free"
- How it works (3 steps with icons)
- Features overview (6-8 features)
- Social proof (testimonials)
- CTA footer
- Responsive design

Use:
- Tailwind CSS for styling
- Shadcn Button component
- Simple layout (no fancy animations yet)

Time: 4-6 hours
```

**Wednesday: Authentication Pages (Day 8)**

```
Clerk pre-built pages:
1. Create sign-up page
   - Route: /sign-up
   - Clerk provides UI
   - Customize with logo/colors

2. Create sign-in page
   - Route: /sign-in
   - Clerk provides UI

3. Redirect routing
   - After signup → /dashboard
   - After login → /dashboard
   - Already logged in → /dashboard

Time: 2-3 hours
```

**Thursday-Friday: Dashboard Layout (Day 9-10)**

```
Build src/app/dashboard/layout.tsx:
- Two-column layout
  - Left sidebar (200px)
  - Main content area
- Sidebar contents:
  - Logo / "My Archive"
  - Search box (not functional yet)
  - "New Item" button (not functional)
  - Folder list (mock data for now)
  - Bottom: Settings, Logout
- Header bar:
  - Breadcrumb (mock)
  - User avatar (from Clerk)
  - Dropdown menu

Use:
- Responsive design (sidebar collapses on mobile)
- Protect route with Clerk auth
- Create reusable Sidebar component

Time: 4-5 hours
```

**Deliverables (Week 2):**
- Landing page (public)
- Sign-up/login pages (Clerk)
- Dashboard layout (protected, but empty)
- Navigation between pages working

### Week 3: Dashboard Features

**Monday-Tuesday: Folder Tree (Day 11-12)**

```
Build FolderTree component:
- Display mock folders
- Click folder → Highlight & show items
- Drag-drop disabled (Phase 2)
- Expandable subfolders (mock)
- "Create Folder" button

Connect to Convex:
- Query: getFolders (get user's folders)
- Create hook: useFolders()
- Real-time sync (Convex handles it)

Code structure:
src/hooks/useFolders.ts
src/components/features/FolderTree.tsx
src/components/features/FolderItem.tsx

Time: 3-4 hours
```

**Wednesday: Items Grid (Day 13)**

```
Build ItemCard component:
- Image thumbnail
- Title
- Type badge (link, image, note)
- Tags
- Metadata (date, size)

Build ItemsGrid component:
- Responsive grid (1-4 columns)
- Connect to Convex
- Query: getItems (get user's items)
- Real-time updates

For now: Mock data (5-10 items)

Time: 3-4 hours
```

**Thursday: Search Bar (Day 14)**

```
Build SearchBar component:
- Input field
- Real-time search (Convex query)
- Search results dropdown (Phase 2)
- For now: Input only, no results yet

Connect to Convex:
- Query: searchItems (full-text search)
- Debounce: 300ms

Code structure:
src/components/features/SearchBar.tsx
src/hooks/useSearch.ts

Time: 2-3 hours
```

**Friday: Empty States & Loading (Day 15)**

```
Build LoadingState component:
- Skeleton loaders for grid
- Smooth fade-in

Build EmptyState component:
- "No items yet"
- "Create your first folder"
- CTA button

Add to pages:
- Dashboard with no items
- Folder with no items
- Search with no results

Time: 1-2 hours
```

**Deliverables (Week 3):**
- Dashboard displays folders
- Dashboard displays mock items in grid
- Search bar functional (queries, but no results UI yet)
- Empty states for various scenarios
- Fully responsive (mobile, tablet, desktop)

**By end of Week 3:**
- User can sign up/login
- User sees dashboard with folders & items
- Real-time data coming from Convex
- UI matches design system

---

## Phase 3: Core Backend & Save Feature (Week 4-5)

### Objectives
- [ ] User can save items (multiple types)
- [ ] Items appear in dashboard instantly
- [ ] Folders fully functional (create, rename, delete)
- [ ] Browser extension skeleton

### Week 4: Save Item Feature

**Monday-Tuesday: Item Creation Mutations (Day 16-17)**

```
Create Convex functions (convex/items.ts):

1. createItem mutation
   - Args: title, type, url, folder, tags, etc.
   - Validate user auth
   - Validate folder ownership
   - Check storage usage
   - Insert into items table
   - Return itemId

2. updateItem mutation
   - Validate ownership
   - Update only allowed fields
   - Return updated item

3. deleteItem mutation (soft delete)
   - Mark isArchived = true
   - Return success

Create React hooks:
- useCreateItem() → mutation + loading state
- useUpdateItem()
- useDeleteItem()

File structure:
convex/items.ts
src/hooks/useItems.ts

Time: 3-4 hours
```

**Wednesday: Upload UI Component (Day 18)**

```
Build UploadButton component:
- Modal/drawer opens
- Type selector (Link, Image, Note, Video, etc.)
- Input fields based on type
- Folder selector
- Tag input
- Save button

Link/Article:
- URL input → auto-fetch preview
- Auto-fill title from metadata

Image Upload:
- File picker or drag-drop
- Preview before save
- Auto-upload to Cloudinary

Note:
- Text input
- Simple editor

Folder selector:
- Dropdown showing all user's folders
- "Create new folder" option

Time: 4-5 hours
```

**Thursday: Save Item Flow (Day 19)**

```
Integrate UploadButton with createItem:

1. User clicks "New Item"
2. Modal opens
3. Fill in details
4. Click "Save"
5. Show toast: "Saving..."
6. Upload to Cloudinary (if image)
7. Call createItem mutation
8. Item appears in grid immediately (optimistic update)
9. Toast: "Saved!"

Handle errors:
- If upload fails
- If mutation fails
- Show error toast with retry button

Time: 3-4 hours
```

**Friday: Folder CRUD (Day 20)**

```
Create Convex functions (convex/folders.ts):

1. createFolder mutation
   - Args: name, parentFolderId (optional), userId
   - Validate user auth
   - Insert into folders
   - Return folderId

2. updateFolder mutation
   - Rename, change color, etc.
   - Validate ownership

3. deleteFolder mutation
   - Cascade delete items? Or move to parent?
   - Soft delete folder

Create UI:
- "Create Folder" button
- Folder rename dialog
- Delete folder confirmation

Time: 3 hours
```

**Deliverables (Week 4):**
- Users can save items (via upload modal)
- Items appear instantly in dashboard
- Users can create/rename/delete folders
- All data persists in Convex
- Error handling for all operations
- Loading states working

### Week 5: Refine Save, Collections

**Monday-Tuesday: Item Detail Page (Day 21-22)**

```
Build src/app/dashboard/item/[itemId]/page.tsx:
- Large image preview
- Title (editable)
- Description
- Type, URL, metadata
- Tags (editable)
- Like count
- Like button
- Delete button
- Back button

Connect to Convex:
- getItemDetail(itemId)
- updateItem mutation
- deleteItem mutation

Time: 3-4 hours
```

**Wednesday: Browser Extension (Day 23)**

```
Create browser extension:
manifest.json:
- Permissions: activeTab, scripting, storage
- Popup: popup.html, popup.js
- Icon

popup.html:
- Title input (auto-filled)
- Folder selector
- Tag input
- Save button

popup.js:
- Get page title, URL, favicon
- Call Convex createItem
- Show success/error

Time: 3-4 hours
```

**Thursday: Make Collections Public (Day 24)**

```
Create Convex function:
- makeCollectionPublic(folderId)
- Verify folder ownership
- Set folder.isPublic = true
- Create entry in collections table
- Return public URL

UI:
- Folder right-click menu → "Make Public"
- Or folder detail page → "Make Public" button
- Show public URL

Time: 2 hours
```

**Friday: Test & Polish (Day 25)**

```
Testing:
- Save item through UI
- Save item through extension
- Create/delete folders
- Make folder public
- All error cases
- Mobile responsiveness

Fixes:
- UI bugs
- Performance issues
- Error messages
- Loading states

Time: 3-4 hours
```

**Deliverables (Week 5):**
- Save feature fully working
- Browser extension saves items
- Folders can be made public
- Item detail pages working
- All CRUD operations tested

---

## Phase 4: Social Features (Week 6-7)

### Objectives
- [ ] Public profiles visible
- [ ] Collections shareable & viewable
- [ ] Follow system working
- [ ] Explore page functional

### Week 6: Social Core

**Monday-Tuesday: Public Profile Page (Day 26-27)**

```
Build src/app/@[username]/page.tsx:
- Profile header:
  - Avatar
  - Username
  - Bio
  - Follower/following counts
  - Follow button (if not self)
- Tabs:
  1. Collections (public folders)
  2. About (interests, stats)

Connect to Convex:
- getPublicProfile(username)
- getUserCollections(userId)
- followUser mutation
- unfollowUser mutation

Time: 3-4 hours
```

**Wednesday: Collection Detail Page (Day 28)**

```
Build src/app/@[username]/collection/[id]/page.tsx:
- Collection header:
  - Thumbnail image
  - Title, description
  - Creator info (avatar, name, follow button)
  - Stats (views, likes, followers)
- Items grid (all items in collection)
- Like button, Follow collection button
- Share buttons

Connect to Convex:
- getPublicCollection(collectionId)
- getCollectionItems(collectionId)
- likeCollection mutation
- incrementViewCount mutation

Time: 3-4 hours
```

**Thursday: Follow System (Day 29)**

```
Implement follows:

Convex functions:
- followUser(userId) → insert into follows
- unfollowUser(userId) → delete from follows
- getFollowerCount(userId)
- getFollowingCount(userId)

UI:
- Follow button (on profiles, in collections)
- Show "Following" state
- Disable if self

Time: 2 hours
```

**Friday: Explore Page (Day 30)**

```
Build src/app/explore/page.tsx:

Sections:
1. Trending Collections
   - Sort by viewCount desc
   - Take top 10
   - Show cards

2. Top Curators
   - Sort by followerCount desc
   - Show user cards

3. Collections by Interest
   - Show by tags (Design, Finance, F1, etc.)
   - Let users filter

Connect to Convex:
- getTrendingCollections()
- getTopCurators()
- getCollectionsByTag(tag)

Time: 3-4 hours
```

**Deliverables (Week 6):**
- Public profile pages visible
- Collection detail pages sharable
- Follow system working
- Explore page showing trending content
- Share URLs working on social media

### Week 7: Likes, Comments, Feed

**Monday-Tuesday: Like System (Day 31-32)**

```
Implement likes:

Convex functions:
- likeItem(itemId) → insert into likes table
- unlikeItem(itemId) → delete
- getLikeCount(itemId) [cached on item]
- hasUserLiked(itemId) → check if current user liked

UI:
- Like button on item cards
- Like button on item detail
- Like count displayed
- Toggle liked/unliked state

Time: 2-3 hours
```

**Wednesday: Comments (Simple Version) (Day 33)**

```
Implement comments (no nesting for MVP):

Convex functions:
- addComment(itemId, text)
- deleteComment(commentId)
- getComments(itemId) → top level only

UI:
- Comment section on item detail page
- List of comments
- Add comment box
- Delete button (only for own comments)
- No nested replies (Phase 2)

Time: 2-3 hours
```

**Thursday: Following Feed (Day 34)**

```
Build src/app/dashboard/following/page.tsx:
- Activity feed from followed users
- Show: "User saved new item", "User created collection"
- Sort by newest first
- Link to item/collection

Convex function:
- getFollowingFeed(userId)
  - Get all users this user follows
  - Get their recent items/collections
  - Return paginated list

Time: 3 hours
```

**Friday: Settings & Profile (Day 35)**

```
Build src/app/dashboard/profile/page.tsx:
- Edit profile:
  - Avatar (upload)
  - Username (read-only)
  - Bio
  - Interests (multi-select)
  - Public/Private profile toggle

Build src/app/dashboard/settings/page.tsx:
- Account:
  - Email (read-only, from Clerk)
  - Change password (via Clerk)
- Notifications (mock for now)
- Privacy settings
- Logout button

Connect to Convex:
- updateUserProfile(data)

Time: 2-3 hours
```

**Deliverables (Week 7):**
- Like system fully working
- Comment system working
- Following feed shows activity
- User settings pages functional
- Profile customization working

---

## Phase 5: Polish & Testing (Week 8)

### Objectives
- [ ] All features working without bugs
- [ ] Performance optimized
- [ ] Mobile responsive
- [ ] Ready for launch

### Week 8: Final Push

**Monday: Cross-Browser Testing**

```
Test on:
- Chrome (desktop & mobile)
- Firefox
- Safari
- Edge

Check:
- All buttons working
- Forms submit correctly
- Images load
- Mobile layout correct
- No console errors

Time: 2-3 hours
Fixes: 1-2 hours
```

**Tuesday: Performance Optimization**

```
Optimize:
1. Image loading
   - Use Image component
   - Add lazy loading
   - Optimize Cloudinary URLs (quality, size)

2. Code splitting
   - Dynamic imports for large components

3. Database queries
   - Check Convex indexes
   - Add pagination for large lists

Measure:
- Lighthouse score (target: 80+)
- Page load time (target: < 2s)

Time: 2-3 hours
```

**Wednesday: Documentation & README**

```
Create:
1. README.md
   - What is Archive
   - How to use
   - Features
   - Roadmap

2. SETUP.md
   - How to run locally
   - Environment variables
   - Database setup

3. CONTRIBUTING.md (optional)
   - How to contribute
   - Code style
   - PR process

4. Changelog
   - Version 1.0
   - Features in MVP

Time: 2 hours
```

**Thursday: Bug Fixes & Edge Cases**

```
Test edge cases:
- Save very large file
- Very long title/description
- Special characters in input
- Network disconnection
- Concurrent requests (two tabs)
- Login while already logged in

Fix issues:
- Error messages clear
- App doesn't crash
- Data stays consistent

Time: 3-4 hours
```

**Friday: Final Preparations & Launch**

```
1. Deploy to Vercel
   - Verify production works
   - Check all features
   - Test on mobile

2. Set up privacy/terms pages
   - Privacy Policy
   - Terms of Service

3. Create public landing page
   - About section
   - Contact
   - Feedback form

4. Prepare launch:
   - Social media posts
   - ProductHunt submission
   - HackerNews post
   - Reddit posts

Time: 3-4 hours
```

**Deliverables (Week 8):**
- ✅ All features working perfectly
- ✅ No critical bugs
- ✅ Mobile-friendly
- ✅ Fast performance
- ✅ Documentation complete
- ✅ Ready for public launch

---

## Development Checklist

### Week 1: Foundation
- [ ] GitHub repo created
- [ ] Next.js project initialized
- [ ] Convex setup complete
- [ ] Clerk integrated
- [ ] Cloudinary configured
- [ ] Dev environment working
- [ ] Deployed to Vercel

### Week 2-3: Frontend
- [ ] Landing page built
- [ ] Auth pages (sign-up/login)
- [ ] Dashboard layout
- [ ] Folder tree navigation
- [ ] Items grid
- [ ] Search bar component
- [ ] Responsive design tested

### Week 4-5: Core Features
- [ ] Save item modal
- [ ] Folder CRUD
- [ ] Item detail pages
- [ ] Browser extension
- [ ] Make public (collections)
- [ ] All mutations working

### Week 6-7: Social
- [ ] Public profiles
- [ ] Collection detail pages
- [ ] Follow system
- [ ] Explore page
- [ ] Like system
- [ ] Comments
- [ ] Following feed

### Week 8: Polish
- [ ] Cross-browser testing
- [ ] Performance optimized
- [ ] Mobile fully responsive
- [ ] Documentation complete
- [ ] Edge cases handled
- [ ] Ready to ship

---

## Testing Strategy

### Manual Testing (Priority 1)

**Critical user journeys:**
1. Sign up → Save item → See in dashboard
2. Create folder → Add items to it → Make public
3. Visit public collection → Follow creator
4. Search for item → Find it
5. Delete item → Confirm soft delete

**Edge cases:**
- Very long titles/descriptions
- Special characters in input
- Large file uploads
- Network disconnection
- Concurrent requests

### Automated Testing (Phase 2+)

**For MVP:** Manual testing sufficient

**Later:**
- Jest + React Testing Library (unit tests)
- Playwright (E2E tests)

---

## Deployment Checklist

### Pre-Launch
- [ ] All environment variables set in Vercel
- [ ] Database fully populated (test data)
- [ ] Backups configured
- [ ] Error tracking (Sentry) set up
- [ ] Uptime monitoring configured
- [ ] Analytics (optional) configured
- [ ] Privacy policy/terms published
- [ ] Email address for support

### Launch Day
- [ ] Final deployment to Vercel
- [ ] Smoke test (all features work)
- [ ] Monitor error logs
- [ ] Monitor performance
- [ ] Respond to early user feedback

### Post-Launch
- [ ] Gather user feedback
- [ ] Fix bugs quickly
- [ ] Monitor metrics (DAU, retention)
- [ ] Plan Phase 2 features

---

## Risk & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Feature too ambitious | Miss launch date | Cut Phase 2 features early |
| Database schema wrong | Refactor later | Test schema with data first |
| Performance issues | Slow app | Profile & optimize in week 8 |
| Browser extension bugs | Save feature broken | Test thoroughly on main browsers |
| Security vulnerability | Data breach | Do security audit in week 8 |
| Team member unavailable | Delay launch | Focus on MVP core features |

---

## Post-MVP Roadmap (Phase 2+)

### Phase 2: Monetization & Analytics (Weeks 9-12)
- [ ] Stripe integration
- [ ] Pro/Creator tiers
- [ ] Analytics dashboard
- [ ] Affiliate links in collections
- [ ] Two-factor authentication
- [ ] Audit logging

### Phase 3: Advanced Features (Weeks 13-16)
- [ ] End-to-end encryption for journals
- [ ] Direct messaging (Phase 2 feature)
- [ ] Advanced search (Meilisearch)
- [ ] Mobile app (React Native)
- [ ] API for developers
- [ ] Marketplace for collections

### Phase 4: Scale (Months 5+)
- [ ] Marketing & growth
- [ ] Paid partnerships
- [ ] Featured curator program
- [ ] Community building
- [ ] Premium features rollout
- [ ] International expansion

---

## Success Metrics (Launch Day)

**MVP Launch Goals:**
- 50+ signups in first week
- 30%+ daily active users (of signups)
- Average 10+ items per user
- Zero critical bugs
- < 2 second page load
- Positive user feedback

---

## Daily Standup Format

Keep it brief:
```
What I did yesterday:
- [Feature/task]

What I'm doing today:
- [Feature/task]

Blockers:
- [Any issues]
```

Spend 15 min max.

---

## Conclusion

**This plan is achievable in 8 weeks with:**
- Focused development
- Clear priorities
- Regular testing
- Ruthless scope management

**Keys to success:**
1. Build core features first, polish later
2. Ship by deadline, iterate after
3. Test as you go (don't debug at the end)
4. Get user feedback early
5. Stay flexible on Phase 2 features

**Let's build Archive! 🚀**

