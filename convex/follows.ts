import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Vérifier si l'utilisateur A suit l'utilisateur B
export const isFollowing = query({
  args: { followerId: v.string(), followingId: v.string() },
  handler: async (ctx, { followerId, followingId }) => {
    const followerUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", followerId))
      .first();

    const followingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", followingId))
      .first();

    if (!followerUser || !followingUser) return false;

    const follow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) => 
        q.eq("followerId", followerUser._id).eq("followingId", followingUser._id)
      )
      .first();

    return !!follow;
  },
});

// Suivre un utilisateur
export const followUser = mutation({
  args: { followerId: v.string(), followingId: v.string() },
  handler: async (ctx, { followerId, followingId }) => {
    // Get user IDs from clerk IDs
    const followerUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", followerId))
      .first();

    const followingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", followingId))
      .first();

    if (!followerUser || !followingUser) {
      throw new Error("User not found");
    }

    // Check if already following
    const existingFollow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) => 
        q.eq("followerId", followerUser._id).eq("followingId", followingUser._id)
      )
      .first();

    if (existingFollow) {
      throw new Error("Already following");
    }

    // Add follow record
    await ctx.db.insert("follows", {
      followerId: followerUser._id,
      followingId: followingUser._id,
    });

    // Update user stats
    await ctx.db.patch(followerUser._id, {
      following: (followerUser.following || 0) + 1
    });

    await ctx.db.patch(followingUser._id, {
      followers: (followingUser.followers || 0) + 1
    });

    // Create notification
    await ctx.db.insert("notifications", {
      receiverId: followingUser._id,
      senderId: followerUser._id,
      type: "follow",
    });

    return true;
  },
});

// Ne plus suivre un utilisateur
export const unfollowUser = mutation({
  args: { followerId: v.string(), followingId: v.string() },
  handler: async (ctx, { followerId, followingId }) => {
    // Get user IDs from clerk IDs
    const followerUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", followerId))
      .first();

    const followingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", followingId))
      .first();

    if (!followerUser || !followingUser) {
      throw new Error("User not found");
    }

    // Find and delete follow record
    const follow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) => 
        q.eq("followerId", followerUser._id).eq("followingId", followingUser._id)
      )
      .first();

    if (!follow) {
      throw new Error("Not following");
    }

    await ctx.db.delete(follow._id);

    // Update user stats
    await ctx.db.patch(followerUser._id, {
      following: Math.max(0, (followerUser.following || 1) - 1)
    });

    await ctx.db.patch(followingUser._id, {
      followers: Math.max(0, (followingUser.followers || 1) - 1)
    });

    return true;
  },
});
