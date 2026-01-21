import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authComponent } from "./auth";

export const getAllPosts = query({
  args: {},
  handler: async (ctx) => {
    const fallbackUrl = "https://picsum.photos/500.webp?blur";
    const rawPosts = await ctx.db.query("posts").order("desc").collect();
    return await Promise.all(
      rawPosts.map(async (post) => {
        const resolvedImageUrl = post.imgStorageId
          ? ((await ctx.storage.getUrl(post.imgStorageId)) ?? fallbackUrl)
          : fallbackUrl;
        return { ...post, imageUrl: resolvedImageUrl };
      })
    );
  },
});

export const getPostById = query({
  args: { id: v.id("posts") },
  handler: async (ctx, { id }) => {
    const rawPost = await ctx.db.get("posts", id);
    if (!rawPost) {
      return;
    }
    const fallbackUrl = "https://picsum.photos/500.webp?blur";

    const resolvedImageUrl = rawPost.imgStorageId
      ? ((await ctx.storage.getUrl(rawPost.imgStorageId)) ?? fallbackUrl)
      : fallbackUrl;
    return { ...rawPost, imageUrl: resolvedImageUrl };
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    imgStorageId: v.id("_storage"),
  },
  handler: async (ctx, { title, content, imgStorageId }) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Unauthorized");
    }
    const id = await ctx.db.insert("posts", {
      title,
      content,
      imgStorageId,
      authorId: user._id,
      authorEmail: user.email,
    });
    return id;
  },
});

export const generateImgUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.storage.generateUploadUrl();
  },
});
