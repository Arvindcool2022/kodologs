import { Suspense } from "react";
import { BlogGridWrapper } from "@/components/blogs/blog-wrapper";
import { SkeletonCard } from "@/components/blogs/skeleton-card";
import { PageHeader } from "@/components/header-comp";
import BlogsGrid from "../../../components/blogs/blog-grid";

export default function BlogsPage() {
  return (
    <div className="py-12">
      <PageHeader description="some description will come here...">
        Our Blogs
      </PageHeader>
      <Suspense
        fallback={
          <BlogGridWrapper>
            {Array.from({ length: 6 }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: its for skeleton
              <SkeletonCard key={i} />
            ))}
          </BlogGridWrapper>
        }
      >
        <BlogsGrid />
      </Suspense>
    </div>
  );
}
