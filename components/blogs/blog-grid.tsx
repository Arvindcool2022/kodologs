import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";
import BlogCard from "./blog-card";
import { BlogGridWrapper } from "./blog-wrapper";
import { EmptyBlogs } from "./no-blogs";

async function getCachedPosts() {
  "use cache";
  cacheLife("hours");
  cacheTag("blogs");

  const data = await fetchAuthQuery(api.posts.getAllPosts);
  return data;
}
export default async function BlogsGrid() {
  // await new Promise((r) => setTimeout(r, 5000)); // suspends HERE
  await connection(); //note: This function allows you to indicate that you require an actual user Request before continuing
  const data = await getCachedPosts();
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
