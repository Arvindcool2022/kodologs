"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { fetchAuthMutation, isAuthenticated } from "@/lib/auth-server";
import type { BlogData } from "./schema/blog";

type ResponseType =
  | { success: false; error: string }
  | { success: true; id: Id<"posts"> };

export async function createPost(data: BlogData): Promise<ResponseType> {
  if (!(await isAuthenticated())) {
    redirect("/auth/login?redirectTo=/create");
  }

  const imageUrl = await fetchAuthMutation(api.posts.generateImgUploadUrl);

  const uploadResult = await fetch(imageUrl, {
    method: "POST",
    headers: { "Content-Type": data.image.type },
    body: data.image,
  });

  if (!uploadResult.ok) {
    return { success: false, error: "Failed to upload image" };
  }

  const { storageId } = await uploadResult.json();

  const postId = await fetchAuthMutation(api.posts.create, {
    title: data.title,
    content: data.content,
    imgStorageId: storageId,
  });

  revalidatePath("/blogs"); // remove if Convex subscription-driven
  // redirect(`/blogs/${res}`); //! dont do this in server action, handle redirect in client after toast
  return { success: true, id: postId };
}
