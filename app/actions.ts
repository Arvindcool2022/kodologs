"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import { fetchAuthMutation, isAuthenticated } from "@/lib/auth-server";
import type { BlogData } from "./schema/blog";
//import { fetchMutation } from 'convex/nextjs' for non auth version

export async function createPost(data: BlogData): Promise<string> {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    redirect("/auth/login?redirectTo=/create");
  }
  const res = await fetchAuthMutation(api.posts.create, {
    title: data.title,
    content: data.content,
  });
  revalidatePath("/blogs");
  // redirect(`/blogs/${res}`); //! dont do this in server action, handle redirect in client after toast
  return res;
}
