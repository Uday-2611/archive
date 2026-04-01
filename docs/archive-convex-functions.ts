// convex/items.ts
// Convex Mutations and Queries for Items

import { mutation, query } from "./_generated";
import { v } from "convex/values";
import { getAuthUserId } from "./auth";

// ============ MUTATIONS (Write Operations) ============

/**
 * Create a new item (save something)
 */
export const createItem = mutation({
  args: {
    folderId: v.id("folders"),
    title: v.string(),
    type: v.string(), // "link", "image", "note", etc
    url: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    content: v.optional(v.string()),
    tags: v.array(v.string()),
    description: v.optional(v.string()),
  },
  async handler(ctx, args) {
    // Get authenticated user
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify folder belongs to this user
    const folder = await ctx.db.get(args.folderId);
    if (!folder || folder.userId !== userId) {
      throw new Error("Not authorized");
    }

    // Check storage usage (simple check)
    const user = await ctx.db.get(userId);
    const estimatedSize = (args.imageUrl?.length || 0) + (args.content?.length || 0);
    if (user.storageUsed + estimatedSize > user.storagePlan) {
      throw new Error("Storage limit exceeded");
    }

    // Create item
    const itemId = await ctx.db.insert("items", {
      userId,
      folderId: args.folderId,
      type: args.type,
      title: args.title,
      description: args.description,
      url: args.url,
      imageUrl: args.imageUrl,
      content: args.content,
      tags: args.tags,
      likeCount: 0,
      commentCount: 0,
      isArchived: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update user storage
    await ctx.db.patch(userId, {
      storageUsed: user.storageUsed + estimatedSize,
      updatedAt: Date.now(),
    });

    // Add to search index
    await ctx.db.insert("searchIndex", {
      itemId,
      userId,
      title: args.title,
      description: args.description,
      tags: args.tags,
      type: args.type,
      createdAt: Date.now(),
    });

    return { success: true, itemId };
  },
});

/**
 * Update an existing item
 */
export const updateItem = mutation({
  args: {
    itemId: v.id("items"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    folderId: v.optional(v.id("folders")),
  },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const item = await ctx.db.get(args.itemId);
    if (!item || item.userId !== userId) {
      throw new Error("Not authorized");
    }

    // Update item
    const updates: any = { updatedAt: Date.now() };
    if (args.title) updates.title = args.title;
    if (args.description) updates.description = args.description;
    if (args.tags) updates.tags = args.tags;
    if (args.folderId) {
      // Verify target folder belongs to user
      const targetFolder = await ctx.db.get(args.folderId);
      if (!targetFolder || targetFolder.userId !== userId) {
        throw new Error("Target folder not found");
      }
      updates.folderId = args.folderId;
    }

    await ctx.db.patch(args.itemId, updates);

    // Update search index
    if (args.title || args.tags || args.description) {
      await ctx.db.patch(item._id, {
        title: args.title || item.title,
        tags: args.tags || item.tags,
        description: args.description || item.description,
      });
    }

    return { success: true };
  },
});

/**
 * Delete an item (soft delete)
 */
export const deleteItem = mutation({
  args: { itemId: v.id("items") },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const item = await ctx.db.get(args.itemId);
    if (!item || item.userId !== userId) {
      throw new Error("Not authorized");
    }

    // Soft delete
    await ctx.db.patch(args.itemId, {
      isArchived: true,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Like an item
 */
export const likeItem = mutation({
  args: { itemId: v.id("items") },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Item not found");

    // Check if already liked
    const existing = await ctx.db
      .query("likes")
      .withIndex("unique_like_item", (q) =>
        q.eq("userId", userId).eq("itemId", args.itemId)
      )
      .first();

    if (existing) {
      throw new Error("Already liked");
    }

    // Add like
    await ctx.db.insert("likes", {
      userId,
      itemId: args.itemId,
      collectionId: undefined,
      commentId: undefined,
      createdAt: Date.now(),
    });

    // Increment like count on item
    await ctx.db.patch(args.itemId, {
      likeCount: item.likeCount + 1,
    });

    return { success: true };
  },
});

/**
 * Unlike an item
 */
export const unlikeItem = mutation({
  args: { itemId: v.id("items") },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Find like
    const like = await ctx.db
      .query("likes")
      .withIndex("unique_like_item", (q) =>
        q.eq("userId", userId).eq("itemId", args.itemId)
      )
      .first();

    if (!like) {
      throw new Error("Not liked");
    }

    // Delete like
    await ctx.db.delete(like._id);

    // Decrement like count
    const item = await ctx.db.get(args.itemId);
    await ctx.db.patch(args.itemId, {
      likeCount: Math.max(0, item.likeCount - 1),
    });

    return { success: true };
  },
});

// ============ QUERIES (Read Operations) ============

/**
 * Get all items for authenticated user (dashboard)
 */
export const getMyItems = query({
  args: {
    folderId: v.optional(v.id("folders")),
    limit: v.number(),
    cursor: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    let query = ctx.db
      .query("items")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false));

    // Filter by folder if specified
    if (args.folderId) {
      query = query.filter((q) =>
        q.eq(q.field("folderId"), args.folderId)
      );
    }

    // Get items ordered by newest first
    const items = await query
      .order("desc")
      .take(args.limit);

    return items;
  },
});

/**
 * Search items by title/tags
 */
export const searchItems = query({
  args: {
    query: v.string(),
    limit: v.number(),
  },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Simple search by title (Phase 2: use Meilisearch for better results)
    const results = await ctx.db
      .query("items")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.or(
          q.stringContains(q.field("title"), args.query),
          q.arrayContains(q.field("tags"), args.query)
        )
      )
      .take(args.limit);

    return results;
  },
});

/**
 * Get public items from a collection
 */
export const getPublicCollectionItems = query({
  args: {
    collectionId: v.id("collections"),
    limit: v.number(),
  },
  async handler(ctx, args) {
    const collection = await ctx.db.get(args.collectionId);
    if (!collection) throw new Error("Collection not found");

    // Get folder (to ensure it's public)
    const folder = await ctx.db.get(collection.folderId);
    if (!folder || !folder.isPublic) {
      throw new Error("Collection not public");
    }

    // Get items in this folder
    const items = await ctx.db
      .query("items")
      .withIndex("by_folderId", (q) => q.eq("folderId", folder._id))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .take(args.limit);

    return items;
  },
});

/**
 * Get trending collections (cached query)
 */
export const getTrendingCollections = query({
  args: { limit: v.number() },
  async handler(ctx, args) {
    const collections = await ctx.db
      .query("collections")
      .withIndex("by_viewCount", (q) => q.gt("viewCount", 0))
      .order("desc")
      .take(args.limit);

    return collections;
  },
});

/**
 * Get a specific item with comments
 */
export const getItemDetail = query({
  args: { itemId: v.id("items") },
  async handler(ctx, args) {
    const item = await ctx.db.get(args.itemId);
    if (!item) throw new Error("Item not found");

    // Get comments
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_itemId", (q) => q.eq("itemId", args.itemId))
      .order("desc")
      .take(20);

    // Get user info
    const user = await ctx.db.get(item.userId);

    return {
      item,
      comments,
      creator: {
        _id: user._id,
        username: user.username,
        profilePic: user.profilePic,
      },
    };
  },
});
