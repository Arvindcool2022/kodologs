import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";
import BlogCard from "./blog-card";
import { BlogGridWrapper } from "./blog-wrapper";
import { EmptyBlogs } from "./no-blogs";

export default async function BlogsGrid() {
  // await new Promise((r) => setTimeout(r, 5000)); // suspends HERE
  const data = await fetchAuthQuery(api.posts.getAllPosts);
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
