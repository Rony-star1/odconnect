import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    age: v.number(),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    district: v.string(),
    city: v.string(),
    bio: v.string(),
    interests: v.array(v.string()),
    lookingFor: v.union(
      v.literal("friendship"), 
      v.literal("dating"), 
      v.literal("casual"), 
      v.literal("serious")
    ),
    language: v.union(v.literal("odia"), v.literal("english"), v.literal("both")),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      age: args.age,
      gender: args.gender,
      location: {
        district: args.district,
        city: args.city,
      },
      bio: args.bio,
      interests: args.interests,
      lookingFor: args.lookingFor,
      photos: [],
      language: args.language,
      isVerified: false,
      isOnline: true,
      lastSeen: Date.now(),
      safetySettings: {
        shareLocation: false,
        allowMessages: true,
        requireVerification: true,
      },
      reportCount: 0,
      isBlocked: false,
    });
    return userId;
  },
});

export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

export const updateProfile = mutation({
  args: {
    userId: v.id("users"),
    bio: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
    lookingFor: v.optional(v.union(
      v.literal("friendship"), 
      v.literal("dating"), 
      v.literal("casual"), 
      v.literal("serious")
    )),
    safetySettings: v.optional(v.object({
      shareLocation: v.boolean(),
      allowMessages: v.boolean(),
      requireVerification: v.boolean(),
    })),
  },
  handler: async (ctx, args) => {
    const { userId, ...updates } = args;
    const filteredUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    
    await ctx.db.patch(userId, filteredUpdates);
  },
});

export const updateOnlineStatus = mutation({
  args: {
    userId: v.id("users"),
    isOnline: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      isOnline: args.isOnline,
      lastSeen: Date.now(),
    });
  },
});

export const discoverUsers = query({
  args: {
    currentUserId: v.id("users"),
    district: v.optional(v.string()),
    ageRange: v.optional(v.object({
      min: v.number(),
      max: v.number(),
    })),
    lookingFor: v.optional(v.union(
      v.literal("friendship"), 
      v.literal("dating"), 
      v.literal("casual"), 
      v.literal("serious")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("users");
    
    if (args.district) {
      query = query.withIndex("by_location_district", (q) => 
        q.eq("location.district", args.district)
      );
    }
    
    const users = await query.collect();
    
    // Filter out current user, blocked users, and apply filters
    return users
      .filter(user => 
        user._id !== args.currentUserId &&
        !user.isBlocked &&
        (!args.ageRange || (user.age >= args.ageRange.min && user.age <= args.ageRange.max)) &&
        (!args.lookingFor || user.lookingFor === args.lookingFor)
      )
      .slice(0, args.limit || 20);
  },
});

export const searchUsers = query({
  args: {
    searchTerm: v.string(),
    district: v.optional(v.string()),
    currentUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const results = await ctx.db
      .query("users")
      .withSearchIndex("search_name_bio", (q) => {
        let search = q.search("name", args.searchTerm);
        if (args.district) {
          search = search.eq("location.district", args.district);
        }
        return search;
      })
      .take(10);
    
    return results.filter(user => 
      user._id !== args.currentUserId && !user.isBlocked
    );
  },
});