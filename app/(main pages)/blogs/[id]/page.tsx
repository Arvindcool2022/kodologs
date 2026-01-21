import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { BlogImage } from "@/components/blogs/blog-image";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { fetchAuthQuery } from "@/lib/auth-server";
import { formatDate } from "@/lib/utils";

type BlogIdProps = Readonly<{ params: Promise<{ id: Id<"posts"> }> }>;

export default async function Page({ params }: BlogIdProps) {
  const { id } = await params;
  const data = await fetchAuthQuery(api.posts.getPostById, { id });
  if (!data) {
    return null;
  }
  return (
    <div className="fade-in relative mx-auto max-w-3xl animate-in px-4 py-8 duration-500">
      <Link
        className={buttonVariants({ variant: "ghost", className: "mb-4" })}
        href={"/blogs"}
      >
        <ArrowLeft className="size-4" />
        Back to blogs
      </Link>
      <div className="relative mb-8 h-100 w-full overflow-hidden rounded-xl shadow-sm">
        <Suspense fallback={<Skeleton className="" />}>
          <BlogImage
            alt="cover image"
            className="rounded-t-lg object-cover transition-transform duration-300 hover:scale-105"
            fill
            src={data.imageUrl}
          />
        </Suspense>
      </div>
      <div className="flex flex-col gap-4" />
      <h1 className="font-bold text-4xl text-foreground tracking-tight">
        {data.title}
      </h1>
      <div className="mb-8 flex justify-between text-muted-foreground text-sm">
        <p>{data.authorEmail}</p>
        <p>{formatDate(data._creationTime)}</p>
      </div>
      <p className="whitespace-pre-wrap text-foreground/80">{data.content}</p>
      <Separator />
    </div>
  );
}
