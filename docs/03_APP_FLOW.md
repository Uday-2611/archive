# Archive - App Flow & User Journeys

**Version:** 1.0  
**Date:** 2025  

---

## Information Architecture (Site Map)

```
archive.app/
├── / (public - landing page)
├── /sign-up (public - signup)
├── /sign-in (public - login)
├── /pricing (public - pricing page)
├── /explore (public - discovery page)
├── /@[username] (public - user profile)
│   ├── /@[username]/collections/[collectionId] (public - collection detail)
│   └── /@[username]/settings (private - public profile settings)
│
├── /dashboard (protected - main app)
│   ├── /dashboard (main view - all items)
│   ├── /dashboard/folder/[folderId] (folder view)
│   ├── /dashboard/item/[itemId] (item detail)
│   ├── /dashboard/search?q=... (search results)
│   ├── /dashboard/collections (my collections)
│   ├── /dashboard/saved (saved from others)
│   ├── /dashboard/following (following feed)
│   ├── /dashboard/messages (DM inbox - Phase 2)
│   ├── /dashboard/profile (private profile)
│   └── /dashboard/settings (account settings)
│
└── /legal
    ├── /privacy (privacy policy)
    └── /terms (terms of service)
```

---

## User Journey 1: New User - Sign Up & First Save

**Time to First Value:** ~3 minutes

### Step 1: Land on Home (archive.app)
```
View:
- Hero section: "Save Everything. Organize Anything. Share Your Taste."
- 3-step explanation with icons
- CTA button: "Start Free"
- Social proof (testimonials)
- Footer with links

Buttons:
- "Start Free" → /sign-up
- "Learn More" → Scroll to features
```

### Step 2: Sign Up (/sign-up)
```
View:
- Clerk pre-built signup page
- "Sign up with Email" OR "Continue with Google"
- Minimal form (email, password)
- "Already have an account?" link to login

Flow:
1. User enters email
2. Clerk sends verification email
3. User verifies email
4. Redirects to /dashboard (onboarding)

Backend:
- Convex creates user record via Clerk webhook
```

### Step 3: Onboarding (First Visit to /dashboard)
```
View:
- Welcome message: "Welcome, [Name]!"
- Empty state: "You have 0 items"
- Highlighted call-to-action: "Save your first item"
- 3 options:
  1. Browse extension tutorial
  2. Paste a link manually
  3. Upload an image

Backend:
- Check if user has 0 items
- Show onboarding flow
```

### Step 4: Save First Item
```
Option A: Via Browser Extension
1. User visits article online
2. Clicks extension icon
3. Pop-up opens:
   - Auto-filled title, image, URL
   - Folder dropdown (default: "Saved")
   - Tag input
   - "Save" button
4. Toast: "Saved to Saved folder"
5. Item appears in dashboard

Option B: Via Web App
1. Click "Upload" or "New Item"
2. Modal opens:
   - Type: Link, Image, Note, Video
   - Title input
   - URL/content input
   - Tags
   - Folder selector
3. Click "Save"
4. Item appears in dashboard
```

### Step 5: Explore Dashboard
```
View:
- Sidebar: Folders tree (empty except "Saved")
- Main area: Grid view with 1 item
- Top bar: Search, View toggle (grid/list), Upload
- Stats: "1 item | 0.0 MB storage"

Actions:
- Click item → Opens detail view
- Click "Create Folder" → New folder modal
- Click folder in sidebar → Filters to that folder
```

---

## User Journey 2: Regular User - Daily Usage

**Time per session:** 5-30 minutes

### Session Start
```
1. User visits archive.app/dashboard
2. Convex checks Clerk auth token
3. Loads user's folders & recent items
4. Real-time sync updates if data changed elsewhere
```

### Daily Action: Save Multiple Items
```
1. User browses web as usual
2. Finds interesting link/image
3. Clicks extension → Auto-saves
4. Does this 2-5 times per day
```

### Weekly Action: Organize
```
1. Goes to dashboard
2. Sees 10+ items in "Saved" folder
3. Creates new folders:
   - "Research"
   - "Design"
   - "Ideas"
4. Drags items between folders
5. Adds tags: "urgent", "reference", "archive"
6. Uses search to find specific items
```

### Searching for Item
```
1. Clicks search bar
2. Types "design system"
3. Real-time search results appear
4. Filters by type (links only)
5. Clicks result → Opens item detail
6. Views item metadata, notes, tags
7. Can edit or delete
```

### Monthly Action: Clean Up
```
1. Reviews archived items
2. Deletes outdated items
3. Updates folder structure
4. Checks storage usage
```

---

## User Journey 3: Creator - Build Public Collection

**Time:** 30 minutes to 1 week

### Phase 1: Create Collection Concept
```
User decides: "I want to share my design inspiration"

Steps:
1. Creates folder: "Design Systems"
2. Adds items to it over time
3. Writes description: "Beautiful design systems I reference"
```

### Phase 2: Make Public
```
View: Dashboard → Collections tab

1. Clicks folder → "Make Public"
2. Modal opens:
   - Collection name (auto-filled from folder)
   - Description input
   - Featured image selector
   - Public URL preview: archive.app/@username/design-systems
   - "Make Public" button
3. Confirms
4. Collection now has public URL
5. Gets share buttons (Twitter, copy link, etc.)
```

### Phase 3: Share & Promote
```
User actions:
1. Copies collection URL
2. Shares on Twitter: "Just published my collection of design systems"
3. Shares in design communities (Reddit, Dribbble)
4. Sends to friends
5. Adds to website bio/portfolio

Real-time feedback:
- View count increases
- Followers start following
- Comments appear (Phase 2)
- Likes accumulate
```

### Phase 4: Monitor Collection
```
View: Dashboard → Collections tab

1. Clicks collection name
2. Sees stats:
   - Views: 342
   - Followers: 28
   - Likes: 156
   - Comments: 12 (Phase 2)
3. Can edit, update, or make private
```

---

## User Journey 4: Discoverer - Find & Follow Curators

**Time:** 10-20 minutes

### Step 1: Visit Explore Page (/explore)
```
View:
- Header: "Discover curators and collections"
- Search bar: Find by interest
- Sections:
  1. Trending Collections (this week)
  2. Top Curators (by followers)
  3. Collections by Interest (Design, Finance, F1, etc.)

Each collection card shows:
- Thumbnail
- Title & creator name
- Description (1 line)
- Views, likes, followers
- "View" button → Opens collection
```

### Step 2: Browse Collection
```
View: /@[creator]/collections/[id]

Content:
- Creator header: Avatar, name, bio, follow button
- Collection header: Title, description, stats
- Items grid: All items in collection
- Comments section (Phase 2)

Actions:
- View creator's full profile: Click name/avatar
- Like collection: Click heart icon
- Follow creator: Click "Follow" button
- Share collection: Click share button
```

### Step 3: Follow Curator
```
1. Click "Follow" button on collection or profile
2. Button changes to "Following"
3. Now see their activity in "Following" feed
```

### Step 4: Discover More
```
Paths:
1. Click creator name → View their profile
   - See all their public collections
   - See their stats
   - See "About" (bio, interests)
2. Click "Explore More" → Similar collections
3. Follow multiple curators
```

---

## User Journey 5: Social - Follow Feed & Comments

**Time:** 10-30 minutes

### Access Following Feed
```
View: /dashboard/following

Shows:
- Feed of activity from people you follow
- Ordered by newest first
- Card per activity:
  - Creator avatar & name
  - Action: "saved new item" or "created collection"
  - Item/collection preview
  - Timestamp: "2 hours ago"

Actions per item:
- Click to view full item/collection
- Like button
- Comment button (Phase 2)
```

### Comment on Item (Phase 2)
```
1. Click item in collection
2. Scroll to comments section
3. Type comment in text box
4. Click "Post"
5. Comment appears with user avatar, name, text
6. Other users can like or reply
```

### View User Profile
```
Click user avatar/name anywhere → /@[username]

View:
- Header: Avatar, name, bio, badges
- Tabs:
  1. Collections (all public collections)
  2. Stories (blog posts they wrote)
  3. Activity (timeline of their activity)
- Stats: Followers, Following, Items archived
- Buttons:
  - Follow (if not already)
  - Message (Phase 2)
  - Share profile
```

---

## Core Feature Flows

### Create Folder
```
1. Click "+" or "New Folder" button
2. Modal:
   - Name input: "Project X"
   - Parent folder selector (optional, for nesting)
   - Color picker (optional)
3. Click "Create"
4. Folder appears in sidebar
5. Folder is immediately selectable when saving items
```

### Create Sub-Folder
```
1. Right-click folder in sidebar → "New subfolder"
   OR
   Click folder → Click "New Subfolder"
2. Modal:
   - Name: "Phase 1"
   - Automatically nested under parent
3. Click "Create"
```

### Move Item Between Folders
```
Option A: Drag & Drop
1. Drag item from grid
2. Hover over folder in sidebar
3. Drop → Item moved

Option B: Right-click
1. Right-click item → "Move to..."
2. Select folder from modal
3. Click "Move"

Option C: Item detail
1. Open item detail
2. Click "Folder" field
3. Select new folder
4. Auto-save
```

### Add Tags to Item
```
1. Open item detail
2. Click "Tags" field
3. Type tag name
4. Tag appears as pill
5. Add more tags (unlimited)
6. Click X on tag to remove
7. Auto-save

Search uses tags:
- Click tag pill anywhere → Filters to items with that tag
- Search box recognizes tags
```

### Search Items
```
1. Click search bar (top of dashboard)
2. Start typing: "design"
3. Real-time results appear:
   - Items with "design" in title
   - Items tagged with "design"
   - Grouped by type (image, link, video, etc.)
4. Can filter by:
   - Type (dropdown)
   - Date range (calendar)
   - Folder (dropdown)
5. Click result to open item
```

### Upload Image Directly
```
1. Click "Upload" button
2. Modal / file picker:
   - Click to select image OR drag-drop
   - Image previews
3. Auto-fills title from filename
4. Select folder
5. Add tags (optional)
6. Click "Save"
7. Image uploaded to Cloudinary
8. Item created in database
```

### View Item Detail
```
Click item in grid → Opens detail view

Shows:
- Large preview (image/video/link preview)
- Title (editable)
- Description (editable)
- Type badge (Link, Image, Video, etc.)
- Date created
- Folder path
- Tags (editable)
- Like count & button
- Comment section (Phase 2)

Actions:
- Edit button → Edit mode
- Delete button → Confirm delete
- Share button → Share modal
- Move button → Select folder
- Download button (if image)
```

---

## Navigation Patterns

### Sidebar Navigation (Dashboard)
```
Persistent sidebar (left, 200px):
├── Archive Logo & "My Archive"
├── Search box
├── "New Item" button
├── Folder tree (collapsible):
│   ├── Saved
│   ├── Design (has children)
│   │   ├── Color Palettes
│   │   └── UI Components
│   ├── Research
│   └── Ideas
├── Collections (link to /dashboard/collections)
├── Following (link to /dashboard/following)
├── Saved (link to /dashboard/saved)
├── Messages (link to /dashboard/messages) - Phase 2
├── Settings (link to /dashboard/settings)
└── Logout (in user menu)
```

### Top Navigation (All Pages)
```
├── Logo/Brand (links to /)
├── Search bar (desktop only)
├── User avatar → Dropdown:
│   ├── Profile
│   ├── Settings
│   ├── Feedback
│   └── Logout
```

### Breadcrumb (Folder View)
```
Example: My Archive > Research > AI > Papers

- Shows path to current location
- Each part is clickable
- Updates when navigating
```

---

## State & Loading Flows

### Initial Load (Dashboard)
```
1. User navigates to /dashboard
2. Check auth (Clerk)
3. If not authenticated → Redirect to /sign-in
4. If authenticated:
   - Skeleton loaders appear (cards/sidebar)
   - Fetch folders (Convex query)
   - Fetch recent items (Convex query)
   - Real-time sync connects
5. Content appears
6. User can interact immediately
```

### Search
```
1. User types in search box
2. Debounce: Wait 300ms after last keystroke
3. Show loading state: "Searching..."
4. Execute Convex query
5. Results appear instantly (< 500ms)
6. No need for loading spinner if fast enough
```

### Saving Item
```
1. Click "Save"
2. Show toast: "Saving..."
3. Upload to Cloudinary (if image)
4. Create item in Convex
5. Toast: "Saved successfully" ✓
6. Item appears in grid immediately (optimistic update)
```

### Deleting Item
```
1. Click delete
2. Confirmation modal: "Are you sure?"
3. Click "Delete"
4. Item disappears immediately (optimistic)
5. Toast: "Deleted"
6. If undo needed: Show "Undo" button (Phase 2)
```

---

## Error Handling Flows

### Network Error
```
Scenario: User offline, try to save item

1. Item save fails
2. Toast: "Connection error. Retrying..."
3. Auto-retry every 5 seconds
4. When online, toast: "Saved"
5. Item appears

If persistent error:
- Toast: "Failed to save. Check connection and try again"
- Button: "Retry"
- User can try again
```

### Authentication Error
```
Scenario: Clerk session expired

1. User tries to perform action
2. Get 401 from Convex
3. Redirect to /sign-in
4. Toast: "Session expired. Please log in again"
5. After login, redirect back to previous page
```

### Storage Limit Exceeded
```
Scenario: User on free tier (5GB), tries to upload 2GB video

1. File selected
2. Validation check: File size > remaining storage
3. Toast: "Insufficient storage. Upgrade to Pro"
4. Button: "Upgrade Now"
5. Directs to /pricing
```

---

## Mobile Experience (Responsive)

### Sidebar
- On desktop: Fixed sidebar (200px)
- On mobile: Collapsible hamburger menu (toggle sidebar)
- Tablet: Can swipe to open/close

### Grid Layout
- Desktop: 4 columns
- Tablet: 3 columns
- Mobile: 2 columns (then 1 on very small screens)

### Search Bar
- Desktop: Top navbar
- Mobile: Hidden by default, click search icon to focus

### Item Detail
- Desktop: Side-by-side (image left, info right)
- Mobile: Stacked (image full-width, then info below)

---

## Keyboard Shortcuts (Phase 2+)

```
/ - Focus search
C - Create new item
F - Create new folder
K - Command palette (open any action)
Esc - Close modals
```

---

## Analytics Events (Phase 2+)

```
Events to track:
- User signed up
- User saved first item
- User created first folder
- User made first collection public
- User followed someone
- User liked item
- User viewed collection
- User upgraded plan
```

---

## Accessibility Flow

### Keyboard Navigation
```
- Tab through all buttons/links
- Enter/Space activates
- Esc closes modals
- Arrow keys in lists (Phase 2)
```

### Screen Readers
```
- All images have alt text
- Buttons have aria-labels
- Form inputs have labels
- Headings are semantic (h1, h2, h3)
```

### Color Contrast
```
- All text meets WCAG AA standard (4.5:1)
- Color-coding not the only way to distinguish (also use icons/labels)
```

