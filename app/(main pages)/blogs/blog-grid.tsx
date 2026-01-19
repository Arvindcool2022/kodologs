import { api } from "@/convex/_generated/api";
import { fetchAuthQuery } from "@/lib/auth-server";
import BlogCard from "../../../components/blog-card";

export default async function BlogsGrid() {
  await new Promise((r) => setTimeout(r, 5000)); // suspends HERE
  const data = await fetchAuthQuery(api.posts.getAllPosts);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((post) => (
        <BlogCard key={post._id} post={post} />
      ))}
    </div>
  );
}
