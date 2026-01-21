import z from "zod";

export const BlogSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(20),
  image: z.instanceof(File),
});

export type BlogData = z.infer<typeof BlogSchema>;
