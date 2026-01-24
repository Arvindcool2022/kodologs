import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BlogImage } from "@/components/blogs/blog-image";
import PresenceList from "@/components/blogs/presence/post-presence";
import { CommentSection } from "@/components/comments/comments-section";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { fetchAuthQuery, preloadAuthQuery } from "@/lib/auth-server";
import { formatDate } from "@/lib/utils";

type BlogIdProps = Readonly<{ params: Promise<{ id: Id<"posts"> }> }>;

export async function generateMetaData({
  params,
}: BlogIdProps): Promise<Metadata> {
  const { id } = await params;
  const blogData = await fetchAuthQuery(api.posts.getPostById, { id });
  if (!blogData) {
    return {
      title: "Blog not found",
    };
  }

  return {
    title: blogData.title,
    description: blogData.content,
  };
}

export default async function BlogIdRoute({ params }: BlogIdProps) {
  const { id } = await params;
  const _blogData = fetchAuthQuery(api.posts.getPostById, { id });
  const _preLoadedComments = preloadAuthQuery(
    api.comments.getCommentsByPostId,
    { postId: id }
  );
  const _userId = fetchAuthQuery(api.presence.getUserId);

  const [blogData, preLoadedComments, userId] = await Promise.all([
    _blogData,
    _preLoadedComments,
    _userId,
  ]);

  if (!blogData) {
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
            src={blogData.imageUrl}
          />
        </Suspense>
      </div>
      <div className="flex flex-col gap-4" />
      <h1 className="font-bold text-4xl text-foreground tracking-tight">
        {blogData.title}
      </h1>
      <div className="mb-8 flex justify-between text-muted-foreground text-sm">
        <p>{blogData.authorEmail}</p>
        <p>{formatDate(blogData._creationTime)}</p>
        {userId && <PresenceList roomId={blogData._id} usersId={userId} />}
      </div>
      <p className="whitespace-pre-wrap text-foreground/80">
        {blogData.content}
      </p>
      <Separator />
      <CommentSection preLoadedComments={preLoadedComments} />
    </div>
  );
}
