"use client";
import { type Preloaded, usePreloadedQuery } from "convex/react";
import { MessageSquare } from "lucide-react";
import { CreateComments } from "@/components/comments/comments-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { api } from "@/convex/_generated/api";
import { formatDate } from "@/lib/utils";
import { Separator } from "../ui/separator";

interface CommentSectionProps {
  preLoadedComments: Preloaded<typeof api.comments.getCommentsByPostId>;
}

export const CommentSection = ({ preLoadedComments }: CommentSectionProps) => {
  const comments = usePreloadedQuery(preLoadedComments);

  if (!comments) {
    return <p>loadind...</p>;
  }
  const commentLen = comments?.length;
  return (
    <Card>
      <CardHeader className="mb-2 flex flex-row items-center gap-2 border-b-2">
        <MessageSquare className="size-5" />
        <h2 className="font-bold text-xl">
          {commentLen > 0 ? `${commentLen} Comment(s)` : " Comments"}
        </h2>
      </CardHeader>
      <CardContent className="space-y-8">
        <CreateComments />
        {commentLen <= 0 && <Separator />}
        <section className="space-y-6">
          {comments?.map((comment) => {
            const image = `https://avatar.vercel.sh/${comment.authorEmail}}`;
            const username = comment.authorEmail.split("@")[0];
            return (
              <div className="flex gap-4" key={comment._id}>
                <Avatar className="size-10 shrink-0">
                  <AvatarImage src={image} />
                  <AvatarFallback>
                    {comment.authorEmail.slice(0, 3)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">{username}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDate(comment._creationTime)}
                    </p>
                  </div>
                  <p className="whitespace-pre-wrap text-foreground/80 text-sm leading-relaxed">
                    {comment.body}
                  </p>
                </div>
              </div>
            );
          })}
        </section>
      </CardContent>
    </Card>
  );
};
