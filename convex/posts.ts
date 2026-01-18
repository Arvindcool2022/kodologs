import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getAllPosts = query({
  args: {},
  handler: async (ctx) => {
    const rawPosts = await ctx.db.query("posts").order("desc").collect();
    return rawPosts;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { title, content }) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Unauthorized");
    }
    const id = await ctx.db.insert("posts", {
      title,
      content,
      authorId: user._id,
    });
    return id;
  },
});
