import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const reportUser = mutation({
  args: {
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
    evidence: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    // Create report
    const reportId = await ctx.db.insert("reports", {
      reporterId: args.reporterId,
      reportedUserId: args.reportedUserId,
      reason: args.reason,
      description: args.description,
      status: "pending",
      evidence: args.evidence,
    });
    
    // Increment report count for reported user
    const reportedUser = await ctx.db.get(args.reportedUserId);
    if (reportedUser) {
      await ctx.db.patch(args.reportedUserId, {
        reportCount: reportedUser.reportCount + 1,
      });
      
      // Auto-block if too many reports
      if (reportedUser.reportCount >= 5) {
        await ctx.db.patch(args.reportedUserId, {
          isBlocked: true,
        });
      }
    }
    
    return reportId;
  },
});

export const submitVerification = mutation({
  args: {
    userId: v.id("users"),
    verificationType: v.union(
      v.literal("phone"), 
      v.literal("government_id"), 
      v.literal("social_media")
    ),
    documentId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("verifications", {
      userId: args.userId,
      verificationType: args.verificationType,
      status: "pending",
      documentId: args.documentId,
    });
  },
});

export const getVerificationStatus = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const verifications = await ctx.db
      .query("verifications")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();
    
    return verifications;
  },
});

export const getSafetyTips = query({
  args: {},
  handler: async (ctx, args) => {
    return [
      {
        id: "1",
        title: "Meet in Public Places",
        description: "Always meet new connections in public, well-lit areas with other people around.",
        titleOdia: "ସାର୍ବଜନୀନ ସ୍ଥାନରେ ସାକ୍ଷାତ କରନ୍ତୁ",
        descriptionOdia: "ନୂତନ ସଂଯୋଗ ସହିତ ସର୍ବଦା ସାର୍ବଜନୀନ, ଆଲୋକିତ ସ୍ଥାନରେ ସାକ୍ଷାତ କରନ୍ତୁ।",
      },
      {
        id: "2",
        title: "Tell Someone Your Plans",
        description: "Inform a trusted friend or family member about your meeting plans.",
        titleOdia: "ଆପଣଙ୍କ ଯୋଜନା କାହାକୁ କୁହନ୍ତୁ",
        descriptionOdia: "ଆପଣଙ୍କ ସାକ୍ଷାତ ଯୋଜନା ବିଷୟରେ ଜଣେ ବିଶ୍ୱସ୍ତ ବନ୍ଧୁ କିମ୍ବା ପରିବାର ସଦସ୍ୟଙ୍କୁ ଜଣାନ୍ତୁ।",
      },
      {
        id: "3",
        title: "Trust Your Instincts",
        description: "If something feels wrong, trust your gut and leave the situation.",
        titleOdia: "ଆପଣଙ୍କ ଅନୁଭବକୁ ବିଶ୍ୱାସ କରନ୍ତୁ",
        descriptionOdia: "ଯଦି କିଛି ଭୁଲ ଲାଗୁଛି, ଆପଣଙ୍କ ଅନୁଭବକୁ ବିଶ୍ୱାସ କରନ୍ତୁ ଏବଂ ସେହି ପରିସ୍ଥିତି ଛାଡ଼ନ୍ତୁ।",
      },
      {
        id: "4",
        title: "Verify Identity",
        description: "Use our verification features to ensure you're talking to real people.",
        titleOdia: "ପରିଚୟ ଯାଞ୍ଚ କରନ୍ତୁ",
        descriptionOdia: "ଆମର ଯାଞ୍ଚ ବୈଶିଷ୍ଟ୍ୟ ବ୍ୟବହାର କରି ନିଶ୍ଚିତ କରନ୍ତୁ ଯେ ଆପଣ ପ୍ରକୃତ ଲୋକଙ୍କ ସହିତ କଥା ହେଉଛନ୍ତି।",
      },
      {
        id: "5",
        title: "Respect Cultural Values",
        description: "Honor Odia traditions and cultural values in all interactions.",
        titleOdia: "ସାଂସ୍କୃତିକ ମୂଲ୍ୟବୋଧକୁ ସମ୍ମାନ କରନ୍ତୁ",
        descriptionOdia: "ସମସ୍ତ ଯୋଗାଯୋଗରେ ଓଡ଼ିଆ ପରମ୍ପରା ଏବଂ ସାଂସ୍କୃତିକ ମୂଲ୍ୟବୋଧକୁ ସମ୍ମାନ କରନ୍ତୁ।",
      },
    ];
  },
});

export const getEmergencyContacts = query({
  args: {},
  handler: async (ctx, args) => {
    return [
      {
        name: "Police",
        nameOdia: "ପୋଲିସ",
        number: "100",
        type: "emergency",
      },
      {
        name: "Women Helpline",
        nameOdia: "ମହିଳା ହେଲ୍ପଲାଇନ",
        number: "181",
        type: "safety",
      },
      {
        name: "Odisha Police Cyber Crime",
        nameOdia: "ଓଡ଼ିଶା ପୋଲିସ ସାଇବର କ୍ରାଇମ",
        number: "1930",
        type: "cyber",
      },
    ];
  },
});