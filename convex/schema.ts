import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  posts: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.string(),
    authorEmail: v.string(),
    imgStorageId: v.id("_storage"),
    updatedAt: v.number(),
  })
    .index("by_author", ["authorEmail"])
    .searchIndex("search_title", { searchField: "title" })
    .searchIndex("search_body", { searchField: "content" }),

  comments: defineTable({
    postId: v.id("posts"),
    authorId: v.string(),
    authorEmail: v.string(),
    body: v.string(),
  }).index("by_post_id", ["postId"]),

  postLikes: defineTable({
    postId: v.id("posts"),
    authorId: v.string(), //unique (postId,AuthorId)
    reaction: v.union(
      v.literal("heart"),
      v.literal("like"),
      v.literal("dislike"),
      v.literal("fire"),
      v.literal("shit")
    ),
  })
    .index("by_post", ["postId"])
    .index("by_post_author", ["postId", "authorId"]),
});
