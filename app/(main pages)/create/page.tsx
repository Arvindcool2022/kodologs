"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { createPost } from "@/app/actions";
import { type BlogData, BlogSchema } from "@/app/schema/blog";
import { PageHeader } from "@/components/header-comp";
import { RenderField, RenderTextAreaField } from "@/components/render-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

export default function CreatePage() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(BlogSchema),
    defaultValues: { content: "", title: "" },
  });
  const router = useRouter();

  const onSubmit = async (data: BlogData) => {
    console.log("Form Data:", data);
    try {
      const blogId = await createPost(data);
      console.log("Post created with ID:", blogId);
      toast.success("Blog post created successfully!", {
        description: ` Your blog ID is ${blogId}`,
      });
      router.push(`/blogs/${blogId}`); //! handle redirect in client after toast
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create blog post", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <div className="py-12">
      <PageHeader description="Share your thoughts with the world on Kodologs">
        Write on Kodologs
      </PageHeader>
      <div className="sm:py-20">
        <Card className="mx-auto w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-2xl">Create a New Article</CardTitle>
            <CardDescription>
              Publish your ideas, stories, and insights for the Kodologs
              community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <RenderField
                control={control}
                key="title"
                label="Title"
                name="title"
                placeholder="a short title"
                type="text"
              />
              <RenderTextAreaField
                control={control}
                key="content"
                label="Content"
                name="content"
                placeholder="paste your content here"
                rows={10}
              >
                <Button className="mt-2 w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Spinner /> : null}
                  {isSubmitting ? "Creating your blog..." : "Submit Blog"}
                </Button>
              </RenderTextAreaField>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
