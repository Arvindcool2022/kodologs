import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";
import { headers } from "next/headers";
import { connection } from "next/server";
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

/**
 * Retrieves the authentication token from the request headers.
 *
 * This function extracts the Bearer token from the Authorization header.
 * It calls `connection()` to ensure an actual user request is present before
 * accessing dynamic data sources like headers.
 *
 * @returns {Promise<string | undefined>} The authentication token without the "Bearer " prefix,
 *                                         or undefined if no authorization header is present.
 *
 * @example
 * ```typescript
 * const token = await getClientToken();
 * const data = await fetchQuery(api.posts.getAllPosts, {}, { token });
 * ```
 *
 * @remarks
 * This function should be called outside of cached functions ("use cache") since it
 * accesses headers(), which is a dynamic data source. Pass the returned token as an
 * argument to cached functions that need authentication.
 */
export async function getClientToken(): Promise<string | undefined> {
  await connection(); //note: This function allows you to indicate that you require an actual user Request before continuing

  // Get the token OUTSIDE the cached function
  const headersList = await headers();
  const authHeader = headersList.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  return token;
}
