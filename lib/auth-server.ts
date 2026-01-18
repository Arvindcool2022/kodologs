import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { publicEnv } from "./env/public";

const { NEXT_PUBLIC_CONVEX_URL, NEXT_PUBLIC_CONVEX_SITE_URL } = publicEnv;
export const {
  handler,
  preloadAuthQuery,
  isAuthenticated,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = convexBetterAuthNextJs({
  convexUrl: NEXT_PUBLIC_CONVEX_URL,
  convexSiteUrl: NEXT_PUBLIC_CONVEX_SITE_URL,
});
