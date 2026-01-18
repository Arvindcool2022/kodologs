"use client";

import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import type { PropsWithChildren } from "react";
import { authClient } from "@/lib/auth-client";
import { publicEnv } from "@/lib/env/public";

const { NEXT_PUBLIC_CONVEX_URL } = publicEnv;
const convex = new ConvexReactClient(NEXT_PUBLIC_CONVEX_URL, {
  expectAuth: true,
  logger: true,
});

export function ConvexClientProvider({
  children,
  initialToken,
}: PropsWithChildren<{ initialToken?: string | null }>) {
  return (
    <ConvexBetterAuthProvider
      authClient={authClient}
      client={convex}
      initialToken={initialToken}
    >
      {children}
    </ConvexBetterAuthProvider>
  );
}
