import { Suspense } from "react";
import { BlogGridWrapper } from "@/components/blogs/blog-wrapper";
import { SkeletonCard } from "@/components/blogs/skeleton-card";
import { PageHeader } from "@/components/header-comp";
import BlogsGrid from "../../../components/blogs/blog-grid";

// export const dynamic = "force-static";
//note: 30 * 60 is invalid. why?
// export const revalidate = 1800; //*in seconds
/**
 *  NOTE:
 * isAuthenticated() and getToken() rely on request cookies to resolve the session.
 * Static pages (force-static / ISR / build-time render) run without a request context,
 * so cookies and headers are unavailable.
 *
 * On static routes:
 *   - isAuthenticated() always returns false
 *   - getToken() always returns undefined
 *
 * These helpers only work on dynamic, per-request rendered pages/layouts.
 * Do not use them inside statically rendered routes.
 */

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
