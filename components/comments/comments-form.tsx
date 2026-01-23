import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { Upload } from "lucide-react";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type MessageData, MessageSchema } from "@/app/schema/blog";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { RenderTextAreaField } from "../render-field";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

export const CreateComments = () => {
  console.log("rendered CreateComments");
  const { id: postId } = useParams<{ id: Id<"posts"> }>();
  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(MessageSchema),
    defaultValues: {
      body: "",
      postId,
    },
  });
  const [isSubmitting, startTransistion] = useTransition();
  const createComment = useMutation(api.comments.createComment);
  const onSubmit = (data: MessageData) => {
    startTransistion(async () => {
      try {
        console.log(data);
        await createComment(data);
        toast.success("comment posted");
        reset();
      } catch (error) {
        toast.error("failed to post the comment");
        console.error(error);
      }
    });
  };
  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <RenderTextAreaField
        control={control}
        key="body"
        name="body"
        placeholder="Share your thoughts"
        rows={4}
      />
      <Button className="ms-auto flex" disabled={isSubmitting} size={"lg"}>
        {isSubmitting ? <Spinner /> : <Upload />}
        {isSubmitting ? "Submitting..." : "Submit"}
      </Button>
    </form>
  );
};
