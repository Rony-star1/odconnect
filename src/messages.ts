import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: {
    senderId: v.id("users"),
    receiverId: v.id("users"),
    content: v.string(),
    messageType: v.union(
      v.literal("text"), 
      v.literal("voice"), 
      v.literal("image"),
      v.literal("location")
    ),
    fileId: v.optional(v.id("_storage")),
    language: v.union(v.literal("odia"), v.literal("english")),
  },
  handler: async (ctx, args) => {
    // Check if users are connected
    const connection = await ctx.db
      .query("connections")
      .withIndex("by_users", (q) => 
        q.eq("userId1", args.senderId).eq("userId2", args.receiverId)
      )
      .first() || await ctx.db
      .query("connections")
      .withIndex("by_users", (q) => 
        q.eq("userId1", args.receiverId).eq("userId2", args.senderId)
      )
      .first();
    
    if (!connection || connection.status !== "accepted") {
      throw new Error("Users are not connected");
    }
    
    // Create conversation ID (consistent ordering)
    const conversationId = [args.senderId, args.receiverId].sort().join("-");
    
    return await ctx.db.insert("messages", {
      conversationId,
      senderId: args.senderId,
      receiverId: args.receiverId,
      content: args.content,
      messageType: args.messageType,
      fileId: args.fileId,
      isRead: false,
      language: args.language,
    });
  },
});

export const getConversation = query({
  args: {
    userId1: v.id("users"),
    userId2: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const conversationId = [args.userId1, args.userId2].sort().join("-");
    
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversation_id", (q) => 
        q.eq("conversationId", conversationId)
      )
      .order("desc")
      .take(args.limit || 50);
    
    return messages.reverse(); // Return in chronological order
  },
});

export const markMessagesAsRead = mutation({
  args: {
    conversationId: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_conversation_id", (q) => 
        q.eq("conversationId", args.conversationId)
      )
      .filter((q) => 
        q.and(
          q.eq(q.field("receiverId"), args.userId),
          q.eq(q.field("isRead"), false)
        )
      )
      .collect();
    
    for (const message of unreadMessages) {
      await ctx.db.patch(message._id, { isRead: true });
    }
  },
});

export const getUnreadCount = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unreadMessages = await ctx.db
      .query("messages")
      .withIndex("by_receiver_and_read", (q) => 
        q.eq("receiverId", args.userId).eq("isRead", false)
      )
      .collect();
    
    return unreadMessages.length;
  },
});

export const getConversationsList = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Get all messages where user is sender or receiver
    const allMessages = await ctx.db
      .query("messages")
      .collect();
    
    const userMessages = allMessages.filter(msg => 
      msg.senderId === args.userId || msg.receiverId === args.userId
    );
    
    // Group by conversation and get latest message for each
    const conversationMap = new Map();
    
    for (const message of userMessages) {
      const otherUserId = message.senderId === args.userId 
        ? message.receiverId 
        : message.senderId;
      
      const existing = conversationMap.get(otherUserId);
      if (!existing || message._creationTime > existing._creationTime) {
        conversationMap.set(otherUserId, {
          ...message,
          otherUserId,
        });
      }
    }
    
    // Get user details for each conversation
    const conversations = await Promise.all(
      Array.from(conversationMap.values()).map(async (conv) => {
        const otherUser = await ctx.db.get(conv.otherUserId);
        const unreadCount = userMessages.filter(msg => 
          msg.receiverId === args.userId && 
          !msg.isRead &&
          (msg.senderId === conv.otherUserId)
        ).length;
        
        return {
          ...conv,
          otherUser,
          unreadCount,
        };
      })
    );
    
    return conversations.sort((a, b) => b._creationTime - a._creationTime);
  },
});