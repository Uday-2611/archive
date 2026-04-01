# Archive - Backend Schema & Database Design

**Version:** 1.0  
**Date:** 2025  
**Database:** Convex  

---

## Database Overview

Archive uses **Convex** as the complete backend solution:
- **Database:** Managed NoSQL-like data store
- **Functions:** Mutations (writes), Queries (reads), Actions (external calls)
- **Real-time:** WebSocket sync built-in
- **Auth:** Clerk integration

Total tables: **11** (3 core, 8 supporting)

---

## Complete Schema Definition

### 1. Users Table

**Purpose:** Store all user accounts, profiles, and plan information

```typescript
users: defineTable({
  // Authentication
  clerkId: v.string(),                // Clerk user ID (unique)
  email: v.string(),                  // Email (unique)
  username: v.string(),               // @username (unique)
  
  // Profile
  profilePic: v.optional(v.string()), // Cloudinary URL
  bio: v.optional(v.string()),        // 160 chars max
  interests: v.array(v.string()),     // ["F1", "Design", "Finance"]
  
  // Social
  followerCount: v.number(),          // Cached (updated on follow)
  followingCount: v.number(),         // Cached (updated on follow)
  
  // Settings
  isPublic: v.boolean(),              // Profile visibility
  allowMessages: v.boolean(),         // Allow DMs (Phase 2)
  allowFollows: v.boolean(),          // Allow following
  
  // Plan & Storage
  plan: v.union(
    v.literal("free"),
    v.literal("pro"),
    v.literal("creator")
  ),
  storageUsed: v.number(),            // Bytes
  storagePlan: v.number(),            // Bytes (5GB free, 500GB pro, 2TB creator)
  
  // Timestamps
  createdAt: v.number(),              // Unix timestamp
  updatedAt: v.number(),
})
  .index("by_clerkId", ["clerkId"])   // Auth lookup
  .index("by_username", ["username"]) // Profile lookup
  .index("by_email", ["email"])       // Email lookup
```

**Indexes:**
- `by_clerkId` — Fast auth checks
- `by_username` — Public profile lookup
- `by_email` — For password reset

**Example Document:**
```json
{
  "_id": "usr_abc123",
  "clerkId": "user_xyz789",
  "email": "uday@example.com",
  "username": "uday",
  "profilePic": "https://cloudinary.com/...",
  "bio": "Designer • Finance • F1",
  "interests": ["Design", "F1", "Finance"],
  "followerCount": 42,
  "followingCount": 28,
  "isPublic": true,
  "allowMessages": true,
  "allowFollows": true,
  "plan": "pro",
  "storageUsed": 1247483648,
  "storagePlan": 536870912000,
  "createdAt": 1709251200000,
  "updatedAt": 1709251200000
}
```

---

### 2. Folders Table

**Purpose:** Organize items into nested folder structure

```typescript
folders: defineTable({
  // Owner
  userId: v.id("users"),              // Who owns this folder
  
  // Structure
  name: v.string(),                   // "Design", "Research"
  parentFolderId: v.optional(v.id("folders")), // For nesting
  description: v.optional(v.string()),
  
  // Settings
  isPublic: v.boolean(),              // True = becomes a collection
  color: v.optional(v.string()),      // Hex color #9CAF88
  order: v.number(),                  // Sort order (0, 1, 2, ...)
  
  // Timestamps
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_userId", ["userId"])
  .index("by_parentFolderId", ["parentFolderId"])
  .index("by_userId_parentFolderId", ["userId", "parentFolderId"])
  .index("by_userId_isPublic", ["userId", "isPublic"])
```

**Hierarchy Example:**
```
Archive (root, virtual)
├── Saved (default folder)
├── Design (public)
│   ├── Color Palettes
│   ├── UI Components
│   └── Typography
├── Research (private)
└── Ideas (private)
```

**Queries:**
```typescript
// Get all top-level folders for user
ctx.db.query("folders")
  .withIndex("by_userId_parentFolderId", q => 
    q.eq("userId", userId).eq("parentFolderId", undefined)
  )

// Get subfolders of a parent
ctx.db.query("folders")
  .withIndex("by_parentFolderId", q => 
    q.eq("parentFolderId", parentId)
  )

// Get all public folders (collections)
ctx.db.query("folders")
  .withIndex("by_userId_isPublic", q =>
    q.eq("userId", userId).eq("isPublic", true)
  )
```

---

### 3. Items Table (Core)

**Purpose:** Store all saved content (universal data model)

```typescript
items: defineTable({
  // Owner & Location
  userId: v.id("users"),
  folderId: v.id("folders"),
  
  // Content Type
  type: v.union(
    v.literal("link"),
    v.literal("image"),
    v.literal("video"),
    v.literal("note"),
    v.literal("article"),
    v.literal("recipe"),
    v.literal("movie"),
    v.literal("book"),
    v.literal("song"),
    v.literal("code"),
    v.literal("design"),
    v.literal("color"),
    v.literal("typography"),
    v.literal("story"),
    v.literal("journal"),
    v.literal("post")
  ),
  
  // Core Fields
  title: v.string(),                  // Always required
  description: v.optional(v.string()),
  tags: v.array(v.string()),          // ["F1", "strategy"]
  
  // Content (varies by type)
  url: v.optional(v.string()),        // For links, articles
  imageUrl: v.optional(v.string()),   // Cloudinary URL
  videoUrl: v.optional(v.string()),   // YouTube or hosted
  content: v.optional(v.string()),    // For notes, articles, stories
  author: v.optional(v.string()),     // For articles, books
  source: v.optional(v.string()),     // Domain extracted
  extractedText: v.optional(v.string()), // OCR from images
  mimeType: v.optional(v.string()),   // image/jpeg, application/pdf
  fileSize: v.optional(v.number()),   // Bytes
  
  // Social & Engagement (cached)
  likeCount: v.number(),              // Cached from likes table
  commentCount: v.number(),           // Cached from comments table
  
  // Status
  isArchived: v.boolean(),            // Soft delete
  
  // Timestamps
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_userId", ["userId"])
  .index("by_folderId", ["folderId"])
  .index("by_userId_createdAt", ["userId", "createdAt"])
  .index("by_tags", ["tags"])
  .index("by_type", ["type"])
```

**Examples by Type:**

**Link**
```json
{
  "type": "link",
  "title": "How to Write Good Code",
  "url": "https://example.com/article",
  "imageUrl": "https://cloudinary.com/...",
  "source": "example.com",
  "description": "Guide to code quality"
}
```

**Image**
```json
{
  "type": "image",
  "title": "Design System Inspiration",
  "imageUrl": "https://cloudinary.com/...",
  "fileSize": 2048576,
  "mimeType": "image/jpeg"
}
```

**Note**
```json
{
  "type": "note",
  "title": "Q3 Goals",
  "content": "1. Ship Archive MVP\n2. Reach 100 users\n3..."
}
```

**Movie**
```json
{
  "type": "movie",
  "title": "Inception",
  "author": "Christopher Nolan",
  "description": "A mind-bending thriller",
  "imageUrl": "https://tmdb.org/...",
  "url": "https://letterboxd.com/film/inception/"
}
```

**Queries:**

```typescript
// Get all items for a user
ctx.db.query("items")
  .withIndex("by_userId", q => q.eq("userId", userId))
  .filter(q => q.eq(q.field("isArchived"), false))

// Get items in a folder
ctx.db.query("items")
  .withIndex("by_folderId", q => q.eq("folderId", folderId))

// Get items by tag
ctx.db.query("items")
  .withIndex("by_tags", q => q.eq("tags", "Design"))

// Search items (full-text, Phase 2: use Meilisearch)
ctx.db.query("items")
  .withIndex("by_userId", q => q.eq("userId", userId))
  .filter(q => q.stringContains(q.field("title"), query))
```

---

### 4. Collections Table

**Purpose:** Public folders (denormalized for faster queries)

```typescript
collections: defineTable({
  // References
  userId: v.id("users"),              // Creator
  folderId: v.id("folders"),          // Links to public folder
  
  // Content
  name: v.string(),
  description: v.optional(v.string()),
  thumbnail: v.optional(v.string()),  // Hero image
  
  // Stats (cached)
  followerCount: v.number(),
  viewCount: v.number(),              // Page views
  likeCount: v.number(),
  
  // Timestamps
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_userId", ["userId"])
  .index("by_folderId", ["folderId"])
  .index("by_followerCount", ["followerCount"])
  .index("by_viewCount", ["viewCount"])
  .index("by_createdAt", ["createdAt"])
```

**Creation Flow:**
1. User creates folder (stored in `folders` table)
2. User clicks "Make Public"
3. Entry added to `collections` table (denormalized)
4. Folder's `isPublic` flag set to true

**Usage:**
- Trending collections query uses this table (faster than filtering folders)
- Collection detail page queries both collections + items

---

### 5. Follows Table

**Purpose:** Social graph (who follows whom)

```typescript
follows: defineTable({
  // Relationships
  followerId: v.id("users"),          // Follower
  followingId: v.id("users"),         // Person being followed
  
  // Timestamp
  createdAt: v.number(),
})
  .index("by_followerId", ["followerId"])
  .index("by_followingId", ["followingId"])
  .index("unique_follow", ["followerId", "followingId"]) // Prevent duplicates
```

**Key Constraint:**
- (followerId, followingId) unique pair — Can't follow same user twice

**Queries:**

```typescript
// Get user's followers
ctx.db.query("follows")
  .withIndex("by_followingId", q => q.eq("followingId", userId))

// Get user's following
ctx.db.query("follows")
  .withIndex("by_followerId", q => q.eq("followerId", userId))

// Check if user A follows user B
ctx.db.query("follows")
  .withIndex("unique_follow", q =>
    q.eq("followerId", userA).eq("followingId", userB)
  ).first()
```

---

### 6. Comments Table

**Purpose:** Comments on items (nested threads)

```typescript
comments: defineTable({
  // References
  itemId: v.id("items"),              // Item being commented on
  userId: v.id("users"),              // Comment author
  
  // Content
  text: v.string(),
  parentCommentId: v.optional(v.id("comments")), // For replies
  
  // Engagement
  likeCount: v.number(),
  
  // Status
  isDeleted: v.boolean(),             // Soft delete (show "[deleted]")
  
  // Timestamps
  createdAt: v.number(),
  updatedAt: v.number(),
})
  .index("by_itemId", ["itemId"])
  .index("by_userId", ["userId"])
  .index("by_itemId_createdAt", ["itemId", "createdAt"])
```

**Thread Structure:**
```
Comment 1 (root)
├── Reply 1.1 (parentCommentId = Comment 1)
├── Reply 1.2 (parentCommentId = Comment 1)
└── Comment 2 (root)
    └── Reply 2.1 (parentCommentId = Comment 2)
```

**Queries:**

```typescript
// Get all top-level comments for item
ctx.db.query("comments")
  .withIndex("by_itemId", q => q.eq("itemId", itemId))
  .filter(q => q.eq(q.field("parentCommentId"), undefined))
  .order("desc")

// Get replies to a comment
ctx.db.query("comments")
  .filter(q => q.eq(q.field("parentCommentId"), commentId))
  .order("asc")
```

---

### 7. Likes Table

**Purpose:** Like anything (items, collections, comments)

```typescript
likes: defineTable({
  // User
  userId: v.id("users"),
  
  // Likeable (exactly one should be set)
  itemId: v.optional(v.id("items")),
  collectionId: v.optional(v.id("collections")),
  commentId: v.optional(v.id("comments")),
  
  // Timestamp
  createdAt: v.number(),
})
  .index("by_userId", ["userId"])
  .index("by_itemId", ["itemId"])
  .index("by_collectionId", ["collectionId"])
  .index("unique_like_item", ["userId", "itemId"])
  .index("unique_like_collection", ["userId", "collectionId"])
  .index("unique_like_comment", ["userId", "commentId"])
```

**Key Constraints:**
- Can't like same item twice (unique index)
- Exactly one of itemId/collectionId/commentId is set

**Queries:**

```typescript
// Check if user liked an item
ctx.db.query("likes")
  .withIndex("unique_like_item", q =>
    q.eq("userId", userId).eq("itemId", itemId)
  ).first()

// Get all users who liked an item
ctx.db.query("likes")
  .withIndex("by_itemId", q => q.eq("itemId", itemId))

// Unlike an item
const like = await ctx.db.query("likes")
  .withIndex("unique_like_item", q =>
    q.eq("userId", userId).eq("itemId", itemId)
  ).first()
await ctx.db.delete(like._id)
```

---

### 8. Messages Table (Phase 2)

**Purpose:** Direct messaging between users

```typescript
messages: defineTable({
  // Participants
  senderId: v.id("users"),
  recipientId: v.id("users"),
  
  // Content
  text: v.string(),
  
  // Status
  isRead: v.boolean(),
  
  // Timestamp
  createdAt: v.number(),
})
  .index("by_senderId", ["senderId"])
  .index("by_recipientId", ["recipientId"])
  .index("by_senderId_recipientId_createdAt", ["senderId", "recipientId", "createdAt"])
```

**Conversation Retrieval:**

```typescript
// Get conversation between two users
const messages = await ctx.db.query("messages")
  .withIndex("by_senderId_recipientId_createdAt", q =>
    q.eq("senderId", userA).eq("recipientId", userB)
  )
  .order("asc")
  .take(50)
```

---

### 9. Notifications Table (Phase 2)

**Purpose:** Activity feed notifications

```typescript
notifications: defineTable({
  // Recipient
  userId: v.id("users"),
  
  // Action Type
  type: v.union(
    v.literal("comment"),    // Someone commented on your item
    v.literal("like"),       // Someone liked your item
    v.literal("follow"),     // Someone followed you
    v.literal("message")     // New message
  ),
  
  // Actor (who triggered the notification)
  actorId: v.id("users"),
  
  // References
  itemId: v.optional(v.id("items")),
  collectionId: v.optional(v.id("collections")),
  
  // Message
  message: v.string(),       // "Alice liked your design"
  
  // Status
  isRead: v.boolean(),
  
  // Timestamp
  createdAt: v.number(),
})
  .index("by_userId", ["userId"])
  .index("by_userId_isRead", ["userId", "isRead"])
  .index("by_createdAt", ["createdAt"])
```

---

### 10. SavedCollections Table

**Purpose:** Track collections saved by users

```typescript
savedCollections: defineTable({
  // User saving the collection
  userId: v.id("users"),
  
  // Collection being saved
  collectionId: v.id("collections"),
  
  // Timestamp
  createdAt: v.number(),
})
  .index("by_userId", ["userId"])
  .index("by_collectionId", ["collectionId"])
  .index("unique_save", ["userId", "collectionId"])
```

**Use Case:**
- User sees collection, clicks "Save"
- Entry added to this table
- Collection appears in user's "Saved Collections" view

---

### 11. SearchIndex Table (Phase 2)

**Purpose:** Denormalized search index (for Meilisearch integration)

```typescript
searchIndex: defineTable({
  // References
  itemId: v.id("items"),
  userId: v.id("users"),
  
  // Searchable Fields
  title: v.string(),
  description: v.optional(v.string()),
  tags: v.array(v.string()),
  type: v.string(),
  
  // Timestamp
  createdAt: v.number(),
})
  .index("by_itemId", ["itemId"])
  .index("by_userId", ["userId"])
```

**Creation:**
When an item is created, also create searchIndex entry.

**Usage:**
Phase 2: Sync with Meilisearch for full-text search.

---

## Data Relationships Diagram

```
users
├── folders (1-many via userId)
├── items (1-many via userId)
├── collections (1-many via userId)
├── follows (1-many via followerId, followingId)
├── comments (1-many via userId)
├── likes (1-many via userId)
├── messages (1-many via senderId, recipientId)
└── notifications (1-many via userId)

folders
├── items (1-many via folderId)
├── collections (1-1 when isPublic=true)
└── subfolders (self-referential via parentFolderId)

items
├── comments (1-many via itemId)
├── likes (1-many via itemId)
└── searchIndex (1-1 via itemId)

collections
├── likes (1-many via collectionId)
├── savedCollections (1-many via collectionId)
└── notifications (1-many via collectionId)

comments
├── likes (1-many via commentId)
├── comments (self-referential via parentCommentId)
└── notifications (1-many via commentId)
```

---

## Indexing Strategy

### Query Performance Targets
- Basic lookups: < 10ms
- Complex queries: < 100ms
- Search: < 500ms

### Index Coverage

| Table | Indexes | Rationale |
|-------|---------|-----------|
| users | by_clerkId, by_username, by_email | Auth, profile lookup, password reset |
| folders | by_userId, by_parentFolderId, by_userId_parentFolderId, by_userId_isPublic | Folder tree, collections |
| items | by_userId, by_folderId, by_userId_createdAt, by_tags, by_type | Dashboard view, tag filtering, type filtering |
| collections | by_userId, by_folderId, by_followerCount, by_viewCount, by_createdAt | Trending queries |
| follows | by_followerId, by_followingId, unique_follow | Social graph |
| comments | by_itemId, by_userId, by_itemId_createdAt | Comment threads |
| likes | by_userId, by_itemId, by_collectionId, unique_like_* | Like checks |
| messages | by_senderId, by_recipientId, by_senderId_recipientId_createdAt | Conversation threads |
| notifications | by_userId, by_userId_isRead, by_createdAt | Notification feed |

---

## Caching Strategy

### What Gets Cached

**Cached on the User Record:**
- `followerCount` — Incremented/decremented on follow/unfollow
- `followingCount` — Same
- `storageUsed` — Updated when item uploaded

**Cached on Items:**
- `likeCount` — Incremented on like
- `commentCount` — Incremented on comment

**Cached on Collections:**
- `viewCount` — Incremented on page view
- `likeCount` — Incremented on like
- `followerCount` — Incremented on follow

### Cache Invalidation

**When to invalidate:**
```typescript
// User follows someone
1. Insert into follows table
2. Increment followingId.followerCount
3. Increment followerId.followingCount
4. Invalidate profile cache for both users

// User likes item
1. Insert into likes table
2. Increment item.likeCount
3. Invalidate item detail cache
4. Invalidate feed cache for followers

// User makes folder public
1. Set folder.isPublic = true
2. Insert into collections table
3. Invalidate trending collections cache (rebuild top 20)
```

---

## Soft Delete Pattern

**Never physically delete data.** Mark as deleted instead:

```typescript
// In items
isArchived: boolean  // true = soft deleted

// In comments
isDeleted: boolean   // true = soft deleted

// In queries, filter out deleted items
.filter(q => q.eq(q.field("isArchived"), false))

// In UI, show "[deleted]" for deleted comments
{comment.isDeleted ? "[deleted]" : comment.text}
```

**Why?**
- Data recovery possible
- Maintain referential integrity
- Preserve activity history

---

## Growth Projections

### Data Volume Estimates

**At 1,000 users:**
- Items: 50,000 (50 per user avg)
- Collections: 500 public folders
- Comments: 5,000
- Total size: ~200MB

**At 10,000 users:**
- Items: 500,000
- Collections: 5,000
- Comments: 50,000
- Total size: ~2GB (within Convex free tier)

**At 100,000 users:**
- Items: 5,000,000
- Total size: ~20GB
- **Action:** Upgrade to Convex paid plan

---

## Migration Notes (If Applicable)

**From other databases:**
1. Export data from old database
2. Transform to Convex format
3. Import via Convex CLI
4. Verify data integrity
5. Update frontend queries

**Timestamp conversion:**
- Store all timestamps as Unix milliseconds (JavaScript standard)
- Convert from other formats on import

