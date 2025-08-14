import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    age: v.number(),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    location: v.object({
      district: v.string(),
      city: v.string(),
      coordinates: v.optional(v.object({
        latitude: v.number(),
        longitude: v.number(),
      })),
    }),
    bio: v.string(),
    interests: v.array(v.string()),
    lookingFor: v.union(
      v.literal("friendship"), 
      v.literal("dating"), 
      v.literal("casual"), 
      v.literal("serious")
    ),
    photos: v.array(v.id("_storage")),
    profilePhoto: v.optional(v.id("_storage")),
    language: v.union(v.literal("odia"), v.literal("english"), v.literal("both")),
    isVerified: v.boolean(),
    isOnline: v.boolean(),
    lastSeen: v.number(),
    safetySettings: v.object({
      shareLocation: v.boolean(),
      allowMessages: v.boolean(),
      requireVerification: v.boolean(),
    }),
    reportCount: v.number(),
    isBlocked: v.boolean(),
  })
    .index("by_location_district", ["location.district"])
    .index("by_gender_and_looking_for", ["gender", "lookingFor"])
    .index("by_age", ["age"])
    .index("by_is_online", ["isOnline"])
    .searchIndex("search_name_bio", {
      searchField: "name",
      filterFields: ["location.district", "gender", "lookingFor"]
    }),

  connections: defineTable({
    userId1: v.id("users"),
    userId2: v.id("users"),
    status: v.union(
      v.literal("pending"), 
      v.literal("accepted"), 
      v.literal("rejected"),
      v.literal("blocked")
    ),
    initiatedBy: v.id("users"),
    connectionType: v.union(
      v.literal("friendship"), 
      v.literal("dating"), 
      v.literal("casual")
    ),
  })
    .index("by_user1_and_status", ["userId1", "status"])
    .index("by_user2_and_status", ["userId2", "status"])
    .index("by_users", ["userId1", "userId2"]),

  messages: defineTable({
    conversationId: v.string(),
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
    isRead: v.boolean(),
    language: v.union(v.literal("odia"), v.literal("english")),
  })
    .index("by_conversation_id", ["conversationId"])
    .index("by_receiver_and_read", ["receiverId", "isRead"]),

  meetups: defineTable({
    organizerId: v.id("users"),
    title: v.string(),
    description: v.string(),
    location: v.object({
      name: v.string(),
      address: v.string(),
      coordinates: v.object({
        latitude: v.number(),
        longitude: v.number(),
      }),
    }),
    dateTime: v.number(),
    maxParticipants: v.number(),
    currentParticipants: v.array(v.id("users")),
    category: v.union(
      v.literal("cultural"), 
      v.literal("food"), 
      v.literal("sports"),
      v.literal("social"),
      v.literal("religious")
    ),
    isPublic: v.boolean(),
    safetyVerified: v.boolean(),
  })
    .index("by_date_time", ["dateTime"])
    .index("by_category", ["category"])
    .index("by_organizer", ["organizerId"]),

  reports: defineTable({
    reporterId: v.id("users"),
    reportedUserId: v.id("users"),
    reason: v.union(
      v.literal("inappropriate_content"),
      v.literal("harassment"),
      v.literal("fake_profile"),
      v.literal("safety_concern"),
      v.literal("spam")
    ),
    description: v.string(),
    status: v.union(v.literal("pending"), v.literal("reviewed"), v.literal("resolved")),
    evidence: v.optional(v.array(v.id("_storage"))),
  })
    .index("by_reported_user", ["reportedUserId"])
    .index("by_status", ["status"]),

  verifications: defineTable({
    userId: v.id("users"),
    verificationType: v.union(
      v.literal("phone"), 
      v.literal("government_id"), 
      v.literal("social_media")
    ),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    documentId: v.optional(v.id("_storage")),
    verifiedAt: v.optional(v.number()),
  })
    .index("by_user_id", ["userId"])
    .index("by_status", ["status"]),
});