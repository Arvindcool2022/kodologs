"use client"; //this is better since usequery is a subscribe like query

import { useQuery } from "convex/react";
import { PageHeader } from "@/components/header-comp";
import { api } from "@/convex/_generated/api";

export default function BlogsPage() {
  const data = useQuery(api.posts.getAllPosts);
  return (
    <div className="py-12">
      <PageHeader description="some description will come here...">
        Our Blogs
      </PageHeader>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.map((post) => {
          const date = new Date(post._creationTime);
          const formattedDate = new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }).format(date);

          return (
            <div key={post._id}>
              <h2>Title: {post.title}</h2>
              <p>Content: {post.content}</p>
              <p>create at {formattedDate}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
