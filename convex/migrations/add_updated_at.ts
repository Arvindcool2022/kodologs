/** biome-ignore-all lint/style/useFilenamingConvention: its a convex thing */

import { mutation } from "../_generated/server";

export const addUpdatedAt = mutation(async (ctx) => {
  const posts = await ctx.db.query("posts").collect();

  for (const post of posts) {
    if (post.updatedAt === undefined) {
      await ctx.db.patch(post._id, {
        updatedAt: post._creationTime,
      });
    }
  }
});
