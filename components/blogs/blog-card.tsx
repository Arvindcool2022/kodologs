import type { FunctionReturnType } from "convex/server";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { api } from "@/convex/_generated/api";
import { cn, formatDate } from "@/lib/utils";
import { BlogImage } from "./blog-image";

type Post = FunctionReturnType<typeof api.posts.getAllPosts>[number];

export default function BlogCard({ post }: Readonly<{ post: Post }>) {
  const preview =
    post.content.length > 25 ? `${post.content.slice(0, 25)}...` : post.content;

  return (
    <Card
      className="transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg"
      key={post._id}
    >
      <div className="relative h-48 w-full overflow-hidden rounded-lg">
        <BlogImage
          alt={post.title}
          className="mb-2 h-48 w-full rounded-t-lg object-cover"
          height={250}
          src={post.imageUrl}
          width={400}
        />
      </div>
      <CardContent>
        <Link href={`/blogs/${post._id}`} prefetch={true}>
          <h1 className="font-semibold text-xl tracking-tight sm:text-2xl">
            {post.title}
          </h1>
          <p className="mb-4 -pt-1 text-muted-foreground text-xs">
            {post.authorEmail} created at {formatDate(post._creationTime)}
          </p>
        </Link>
        <p>
          {preview}{" "}
          <Link
            className={cn(
              buttonVariants({ variant: "link" }),
              "inline h-auto p-0"
            )}
            href={`/blogs/${post._id}`}
            prefetch={true}
          >
            Read more
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
