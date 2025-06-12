import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Obtenir le profil utilisateur
export const getProfile = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) return null;

    // Get user's posts
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return {
      ...user,
      posts,
    };
  },
});

// Mettre à jour le profil
export const updateProfile = mutation({
  args: {
    clerkId: v.string(),
    fullname: v.string(),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      fullname: args.fullname,
      bio: args.bio,
    });

    return user._id;
  },
});
