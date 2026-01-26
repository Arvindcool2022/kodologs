"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { fetchAuthMutation, isAuthenticated } from "@/lib/auth-server";
import type { BlogData, UpdateBlogData } from "./schema/blog";

type ResponseType =
  | { success: false; error: string }
  | { success: true; id: Id<"posts"> };

export async function createPost(data: BlogData): Promise<ResponseType> {
  if (!(await isAuthenticated())) {
    redirect("/auth/login?redirectTo=/create");
  }

  let storageId: Id<"_storage">;

  try {
    storageId = await uploadImage(data.image);
  } catch (error) {
    return {
      success: false,
      error: error as string,
    };
  }

  const postId = await fetchAuthMutation(api.posts.create, {
    title: data.title,
    content: data.content,
    imgStorageId: storageId,
  });

  // revalidatePath("/blogs"); // remove if Convex subscription-driven
  // redirect(`/blogs/${res}`); //! dont do this in server action, handle redirect in client after toast
  revalidateTag("blogs", "hours"); //migration to cache components (revalidatePath not needed)
  return { success: true, id: postId };
}

export async function updatePost(data: UpdateBlogData): Promise<ResponseType> {
  if (!(await isAuthenticated())) {
    redirect("/auth/login?redirectTo=/create");
  }

  let finalImageId = data.imageId;

  if (data.image) {
    try {
      finalImageId = await uploadImage(data.image);
    } catch (error) {
      return {
        success: false,
        error: error as string,
      };
    }
  }

  if (data.image && data.imageId) {
    await fetchAuthMutation(api.posts.deleteImgById, {
      storageId: data.imageId,
    });
  }

  if (!finalImageId) {
    return {
      success: false,
      error: "final image id can't be undefined",
    };
  }

  // Update post
  const postId = await fetchAuthMutation(api.posts.update, {
    id: data.id,
    title: data.title,
    content: data.content,
    imgStorageId: finalImageId,
  });

  revalidateTag("blogs", "hours");

  return { success: true, id: postId };
}

//helper
type FileType = Pick<BlogData, "image">["image"];

async function uploadImage(image: FileType): Promise<Id<"_storage">> {
  const uploadUrl = await fetchAuthMutation(api.posts.generateImgUploadUrl);
  const uploadResult = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Type": image.type,
    },
    body: image,
  });

  if (!uploadResult.ok) {
    throw new Error("image upload failed");
  }

  const { storageId } = await uploadResult.json();
  return storageId as Id<"_storage">;
}
