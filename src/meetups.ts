import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const createMeetup = mutation({
  args: {
    organizerId: v.id("users"),
    title: v.string(),
    description: v.string(),
    locationName: v.string(),
    address: v.string(),
    latitude: v.number(),
    longitude: v.number(),
    dateTime: v.number(),
    maxParticipants: v.number(),
    category: v.union(
      v.literal("cultural"), 
      v.literal("food"), 
      v.literal("sports"),
      v.literal("social"),
      v.literal("religious")
    ),
    isPublic: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("meetups", {
      organizerId: args.organizerId,
      title: args.title,
      description: args.description,
      location: {
        name: args.locationName,
        address: args.address,
        coordinates: {
          latitude: args.latitude,
          longitude: args.longitude,
        },
      },
      dateTime: args.dateTime,
      maxParticipants: args.maxParticipants,
      currentParticipants: [args.organizerId],
      category: args.category,
      isPublic: args.isPublic,
      safetyVerified: false,
    });
  },
});

export const joinMeetup = mutation({
  args: {
    meetupId: v.id("meetups"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const meetup = await ctx.db.get(args.meetupId);
    if (!meetup) {
      throw new Error("Meetup not found");
    }
    
    if (meetup.currentParticipants.includes(args.userId)) {
      throw new Error("Already joined this meetup");
    }
    
    if (meetup.currentParticipants.length >= meetup.maxParticipants) {
      throw new Error("Meetup is full");
    }
    
    await ctx.db.patch(args.meetupId, {
      currentParticipants: [...meetup.currentParticipants, args.userId],
    });
  },
});

export const leaveMeetup = mutation({
  args: {
    meetupId: v.id("meetups"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const meetup = await ctx.db.get(args.meetupId);
    if (!meetup) {
      throw new Error("Meetup not found");
    }
    
    if (meetup.organizerId === args.userId) {
      throw new Error("Organizer cannot leave their own meetup");
    }
    
    await ctx.db.patch(args.meetupId, {
      currentParticipants: meetup.currentParticipants.filter(id => id !== args.userId),
    });
  },
});

export const getUpcomingMeetups = query({
  args: {
    category: v.optional(v.union(
      v.literal("cultural"), 
      v.literal("food"), 
      v.literal("sports"),
      v.literal("social"),
      v.literal("religious")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    let query = ctx.db.query("meetups");
    
    if (args.category) {
      query = query.withIndex("by_category", (q) => q.eq("category", args.category));
    } else {
      query = query.withIndex("by_date_time");
    }
    
    const meetups = await query.collect();
    
    // Filter for upcoming meetups and add organizer details
    const upcomingMeetups = await Promise.all(
      meetups
        .filter(meetup => meetup.dateTime > now && meetup.isPublic)
        .slice(0, args.limit || 20)
        .map(async (meetup) => {
          const organizer = await ctx.db.get(meetup.organizerId);
          return {
            ...meetup,
            organizer,
          };
        })
    );
    
    return upcomingMeetups.sort((a, b) => a.dateTime - b.dateTime);
  },
});

export const getMeetupDetails = query({
  args: { meetupId: v.id("meetups") },
  handler: async (ctx, args) => {
    const meetup = await ctx.db.get(args.meetupId);
    if (!meetup) return null;
    
    const organizer = await ctx.db.get(meetup.organizerId);
    const participants = await Promise.all(
      meetup.currentParticipants.map(id => ctx.db.get(id))
    );
    
    return {
      ...meetup,
      organizer,
      participants: participants.filter(Boolean),
    };
  },
});

export const getMyMeetups = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const organizedMeetups = await ctx.db
      .query("meetups")
      .withIndex("by_organizer", (q) => q.eq("organizerId", args.userId))
      .collect();
    
    const allMeetups = await ctx.db.query("meetups").collect();
    const joinedMeetups = allMeetups.filter(meetup => 
      meetup.currentParticipants.includes(args.userId) && 
      meetup.organizerId !== args.userId
    );
    
    return {
      organized: organizedMeetups,
      joined: joinedMeetups,
    };
  },
});