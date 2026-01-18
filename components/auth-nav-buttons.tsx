"use client";

import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export function AuthNavButtons() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { push } = useRouter();
  if (isLoading) {
    return <Skeleton className="h-10 w-50 bg-secondary" />;
  }

  return (
    <>
      {isAuthenticated ? (
        <Button
          onClick={() =>
            authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  toast.success("Logged out successfully");
                  push("/");
                },
                onError: (error) => {
                  toast.error("Logout failed", {
                    description:
                      error instanceof Error ? error.message : "Unknown error",
                  });
                },
              },
            })
          }
        >
          Logout
        </Button>
      ) : (
        <>
          <Link className={buttonVariants()} href="/auth/sign-up">
            Sign up
          </Link>
          <Link
            className={buttonVariants({ variant: "secondary" })}
            href="/auth/login"
          >
            Login
          </Link>
        </>
      )}
    </>
  );
}
