import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

export default function BlogCard({ post }: Readonly<{ post: Doc<"posts"> }>) {
  const date = new Date(post._creationTime);
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
  const preview =
    post.content.length > 25 ? `${post.content.slice(0, 25)}...` : post.content;

  return (
    <Card
      className="transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg"
      key={post._id}
    >
      <div className="relative h-48 w-full overflow-hidden rounded-lg">
        <Image
          alt={post.title}
          className="mb-2 h-48 w-full object-cover"
          height={250}
          src="https://images.pexels.com/photos/399161/pexels-photo-399161.jpeg?_gl=1*jl33s6*_ga*MTgzNTU3MTc0Ni4xNzUxMzQ2MDEx*_ga_8JE65Q40S6*czE3Njg4MjkzNDYkbzckZzEkdDE3Njg4MjkzNzIkajM0JGwwJGgw"
          width={400}
        />
      </div>
      <CardContent>
        <Link href={`/blogs/${post._id}`} prefetch={true}>
          <h1 className="font-semibold text-xl tracking-tight sm:text-2xl">
            {post.title}
          </h1>
          <p className="mb-4 -pt-1 text-muted-foreground text-xs">
            created at {formattedDate}
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
