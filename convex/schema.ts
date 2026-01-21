import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  //better-auth

  posts: defineTable({
    title: v.string(),
    content: v.string(),
    authorEmail: v.string(),
  }).index("by_author", ["authorEmail"]),
});
