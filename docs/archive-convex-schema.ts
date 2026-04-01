// convex/schema.ts
// Archive Database Schema - Complete TypeScript Definition

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ============ USERS ============
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    username: v.string(),
    profilePic: v.optional(v.string()), // Cloudinary URL
    bio: v.optional(v.string()), // 160 chars max
    interests: v.array(v.string()), // ["F1", "Finance", "Fashion"]
    followerCount: v.number(),
    followingCount: v.number(),
    isPublic: v.boolean(), // Profile visibility
    allowMessages: v.boolean(),
    allowFollows: v.boolean(),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("creator")),
    storageUsed: v.number(), // bytes
    storagePlan: v.number(), // 5GB, 500GB, 2TB
    createdAt: v.number(), // timestamp
    updatedAt: v.number(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_username", ["username"])
    .index("by_email", ["email"]),

  // ============ FOLDERS (Nested Tree Structure) ============
  folders: defineTable({
    userId: v.id("users"),
    name: v.string(),
    parentFolderId: v.optional(v.id("folders")), // For nested structure
    description: v.optional(v.string()),
    isPublic: v.boolean(), // When true, creates a collection
    color: v.optional(v.string()), // Hex color #9CAF88
    order: v.number(), // For sorting
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_parentFolderId", ["parentFolderId"])
    .index("by_userId_parentFolderId", ["userId", "parentFolderId"])
    .index("by_userId_isPublic", ["userId", "isPublic"]),

  // ============ ITEMS (Core Content) ============
  items: defineTable({
    userId: v.id("users"),
    folderId: v.id("folders"),
    
    // Basic info
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
    title: v.string(),
    description: v.optional(v.string()),
    tags: v.array(v.string()), // ["F1", "strategy", "analysis"]

    // Media/Content (optional based on type)
    url: v.optional(v.string()), // For links, articles
    imageUrl: v.optional(v.string()), // Cloudinary URL
    videoUrl: v.optional(v.string()), // YouTube or hosted video
    content: v.optional(v.string()), // For notes, articles, stories
    author: v.optional(v.string()), // For articles, books
    source: v.optional(v.string()), // Domain from URL
    extractedText: v.optional(v.string()), // OCR from images
    mimeType: v.optional(v.string()), // image/jpeg, application/pdf
    fileSize: v.optional(v.number()), // bytes

    // Social & Engagement (cached for performance)
    likeCount: v.number(), // Cached from likes table
    commentCount: v.number(), // Cached from comments table
    
    // Soft delete
    isArchived: v.boolean(),
    
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_folderId", ["folderId"])
    .index("by_userId_createdAt", ["userId", "createdAt"])
    .index("by_tags", ["tags"])
    .index("by_type", ["type"]),

  // ============ COLLECTIONS (Public Folders) ============
  collections: defineTable({
    userId: v.id("users"),
    folderId: v.id("folders"), // Links to public folder
    name: v.string(),
    description: v.optional(v.string()),
    thumbnail: v.optional(v.string()), // Cloudinary URL
    followerCount: v.number(),
    viewCount: v.number(),
    likeCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_folderId", ["folderId"])
    .index("by_followerCount", ["followerCount"])
    .index("by_viewCount", ["viewCount"])
    .index("by_createdAt", ["createdAt"]),

  // ============ FOLLOWS (Social Graph) ============
  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_followerId", ["followerId"])
    .index("by_followingId", ["followingId"])
    .index("unique_follow", ["followerId", "followingId"]), // Prevent duplicates

  // ============ COMMENTS ============
  comments: defineTable({
    itemId: v.id("items"),
    userId: v.id("users"),
    text: v.string(),
    parentCommentId: v.optional(v.id("comments")), // For nested replies
    likeCount: v.number(),
    isDeleted: v.boolean(), // Soft delete
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_itemId", ["itemId"])
    .index("by_userId", ["userId"])
    .index("by_itemId_createdAt", ["itemId", "createdAt"]),

  // ============ LIKES ============
  likes: defineTable({
    userId: v.id("users"),
    itemId: v.optional(v.id("items")), // Like on item
    collectionId: v.optional(v.id("collections")), // Like on collection
    commentId: v.optional(v.id("comments")), // Like on comment
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_itemId", ["itemId"])
    .index("by_collectionId", ["collectionId"])
    .index("unique_like_item", ["userId", "itemId"]) // Prevent duplicate likes
    .index("unique_like_collection", ["userId", "collectionId"])
    .index("unique_like_comment", ["userId", "commentId"]),

  // ============ MESSAGES (Phase 2) ============
  messages: defineTable({
    senderId: v.id("users"),
    recipientId: v.id("users"),
    text: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_senderId", ["senderId"])
    .index("by_recipientId", ["recipientId"])
    .index("by_senderId_recipientId_createdAt", ["senderId", "recipientId", "createdAt"]),

  // ============ NOTIFICATIONS (Phase 2) ============
  notifications: defineTable({
    userId: v.id("users"),
    type: v.union(
      v.literal("comment"),
      v.literal("like"),
      v.literal("follow"),
      v.literal("message")
    ),
    actorId: v.id("users"), // Who triggered it
    itemId: v.optional(v.id("items")),
    collectionId: v.optional(v.id("collections")),
    message: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_isRead", ["userId", "isRead"])
    .index("by_createdAt", ["createdAt"]),

  // ============ SAVED COLLECTIONS ============
  savedCollections: defineTable({
    userId: v.id("users"), // User saving
    collectionId: v.id("collections"), // Collection being saved
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_collectionId", ["collectionId"])
    .index("unique_save", ["userId", "collectionId"]),

  // ============ SEARCH INDEX (Phase 2 - for Meilisearch) ============
  // This table stores denormalized search data for faster queries
  searchIndex: defineTable({
    itemId: v.id("items"),
    userId: v.id("users"),
    title: v.string(),
    description: v.optional(v.string()),
    tags: v.array(v.string()),
    type: v.string(),
    createdAt: v.number(),
  })
    .index("by_itemId", ["itemId"])
    .index("by_userId", ["userId"]),

  // ============ STRIPE WEBHOOK LOGS ============
  stripeEvents: defineTable({
    eventId: v.string(), // Stripe event ID
    type: v.string(), // Event type (charge.succeeded, etc)
    userId: v.optional(v.id("users")),
    data: v.any(), // Raw event data
    processed: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_eventId", ["eventId"])
    .index("by_userId", ["userId"]),
});

// ============ TYPES FOR FRONTEND ============
// Export types for use in frontend
export type User = {
  _id: string;
  clerkId: string;
  email: string;
  username: string;
  profilePic?: string;
  bio?: string;
  interests: string[];
  plan: "free" | "pro" | "creator";
};

export type Item = {
  _id: string;
  userId: string;
  folderId: string;
  title: string;
  type: string;
  url?: string;
  imageUrl?: string;
  tags: string[];
  likeCount: number;
  commentCount: number;
  createdAt: number;
};

export type Folder = {
  _id: string;
  userId: string;
  name: string;
  parentFolderId?: string;
  isPublic: boolean;
  createdAt: number;
};

export type Collection = {
  _id: string;
  userId: string;
  name: string;
  description?: string;
  followerCount: number;
  viewCount: number;
  createdAt: number;
};
