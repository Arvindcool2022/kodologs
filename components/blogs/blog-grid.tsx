import { fetchQuery } from "convex/nextjs";
import { cacheLife, cacheTag } from "next/cache";
import { api } from "@/convex/_generated/api";
import { getClientToken } from "@/lib/auth-server";
import BlogCard from "./blog-card";
import { BlogGridWrapper } from "./blog-wrapper";
import { EmptyBlogs } from "./no-blogs";

async function getCachedPosts(token: string | undefined) {
  "use cache";
  cacheLife("hours");
  cacheTag("blogs");

  // Use fetchQuery directly with the token passed in
  const data = await fetchQuery(api.posts.getAllPosts, {}, { token });
  return data;
}

export default async function BlogsGrid() {
  // await new Promise((r) => setTimeout(r, 5000)); // suspends HERE

  const token = await getClientToken();

  const data = await getCachedPosts(token);

  if (data.length === 0) {
    return <EmptyBlogs />;
  }

  return (
    <BlogGridWrapper>
      {data.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </BlogGridWrapper>
  );
}
