"use client";

import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "./ui/button";

export function AuthNavButtons() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  if (isLoading) {
    return null;
  }

  return (
    <>
      {isAuthenticated ? (
        <Button onClick={() => authClient.signOut()}>Logout</Button>
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
