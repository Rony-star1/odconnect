import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const sendConnectionRequest = mutation({
  args: {
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    connectionType: v.union(
      v.literal("friendship"), 
      v.literal("dating"), 
      v.literal("casual")
    ),
  },
  handler: async (ctx, args) => {
    // Check if connection already exists
    const existingConnection = await ctx.db
      .query("connections")
      .withIndex("by_users", (q) => 
        q.eq("userId1", args.fromUserId).eq("userId2", args.toUserId)
      )
      .first();
    
    if (existingConnection) {
      throw new Error("Connection already exists");
    }
    
    // Check reverse connection
    const reverseConnection = await ctx.db
      .query("connections")
      .withIndex("by_users", (q) => 
        q.eq("userId1", args.toUserId).eq("userId2", args.fromUserId)
      )
      .first();
    
    if (reverseConnection) {
      throw new Error("Connection already exists");
    }
    
    return await ctx.db.insert("connections", {
      userId1: args.fromUserId,
      userId2: args.toUserId,
      status: "pending",
      initiatedBy: args.fromUserId,
      connectionType: args.connectionType,
    });
  },
});

export const respondToConnection = mutation({
  args: {
    connectionId: v.id("connections"),
    response: v.union(v.literal("accepted"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.connectionId, {
      status: args.response,
    });
  },
});

export const getMyConnections = query({
  args: { 
    userId: v.id("users"),
    status: v.optional(v.union(
      v.literal("pending"), 
      v.literal("accepted"), 
      v.literal("rejected"),
      v.literal("blocked")
    )),
  },
  handler: async (ctx, args) => {
    const connections1 = await ctx.db
      .query("connections")
      .withIndex("by_user1_and_status", (q) => {
        let query = q.eq("userId1", args.userId);
        if (args.status) {
          query = query.eq("status", args.status);
        }
        return query;
      })
      .collect();
    
    const connections2 = await ctx.db
      .query("connections")
      .withIndex("by_user2_and_status", (q) => {
        let query = q.eq("userId2", args.userId);
        if (args.status) {
          query = query.eq("status", args.status);
        }
        return query;
      })
      .collect();
    
    const allConnections = [...connections1, ...connections2];
    
    // Get user details for each connection
    const connectionsWithUsers = await Promise.all(
      allConnections.map(async (connection) => {
        const otherUserId = connection.userId1 === args.userId 
          ? connection.userId2 
          : connection.userId1;
        const otherUser = await ctx.db.get(otherUserId);
        
        return {
          ...connection,
          otherUser,
          isInitiatedByMe: connection.initiatedBy === args.userId,
        };
      })
    );
    
    return connectionsWithUsers;
  },
});

export const blockUser = mutation({
  args: {
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Find existing connection
    const connection = await ctx.db
      .query("connections")
      .withIndex("by_users", (q) => 
        q.eq("userId1", args.fromUserId).eq("userId2", args.toUserId)
      )
      .first() || await ctx.db
      .query("connections")
      .withIndex("by_users", (q) => 
        q.eq("userId1", args.toUserId).eq("userId2", args.fromUserId)
      )
      .first();
    
    if (connection) {
      await ctx.db.patch(connection._id, { status: "blocked" });
    } else {
      // Create new blocked connection
      await ctx.db.insert("connections", {
        userId1: args.fromUserId,
        userId2: args.toUserId,
        status: "blocked",
        initiatedBy: args.fromUserId,
        connectionType: "friendship",
      });
    }
  },
});