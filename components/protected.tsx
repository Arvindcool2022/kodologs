"use client";

import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const router = useRouter();

  useEffect(() => {
    if (!(isLoading || isAuthenticated)) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse font-mono text-2xl text-muted-foreground uppercase">
          authenticating...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
/**
 * Not sufficient when:
1. You need SEO on protected pages
2. You handle sensitive data in HTML
3. You require hard server-side access control
note: create route is dynamic so it far better protected
 */
