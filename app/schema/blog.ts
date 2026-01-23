import z from "zod";
import type { Id } from "@/convex/_generated/dataModel";

export const BlogSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(20),
  image: z.instanceof(File),
});

export type BlogData = z.infer<typeof BlogSchema>;

export const MessageSchema = z.object({
  body: z.string().min(3),
  postId: z.custom<Id<"posts">>(),
});

export type MessageData = z.infer<typeof MessageSchema>;
