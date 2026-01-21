import { ArrowUpRightIcon, FolderIcon } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EmptyBlogs() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>No posts yet</EmptyTitle>
        <EmptyDescription>No content published yet.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Link className={buttonVariants({ variant: "default" })} href="/create">
          Create Post
        </Link>
      </EmptyContent>
      <Button
        asChild
        className="text-muted-foreground"
        size="sm"
        variant="link"
      >
        <Link href="/">
          Home <ArrowUpRightIcon />
        </Link>
      </Button>
    </Empty>
  );
}
