import { Suspense } from "react";
import { PageHeader } from "@/components/header-comp";
import BlogsGrid from "./blog-grid";

export default function BlogsPage() {
  return (
    <div className="py-12">
      <PageHeader description="some description will come here...">
        Our Blogs
      </PageHeader>
      <Suspense
        fallback={
          <div className="text-center text-2xl text-amber-400">
            Loading blogs...
          </div>
        }
      >
        <BlogsGrid />
      </Suspense>
    </div>
  );
}
