import z from "zod";

export const publicEnvSchema = z
  .object({
    NEXT_PUBLIC_CONVEX_URL: z.url(),
    NEXT_PUBLIC_CONVEX_SITE_URL: z.url(),
    NEXT_PUBLIC_SITE_URL: z.url(),
  })
  .refine(
    (env) => {
      return (
        env.NEXT_PUBLIC_CONVEX_URL.slice(0, -6) ===
        env.NEXT_PUBLIC_CONVEX_SITE_URL.slice(0, -5)
      );
    },
    {
      message:
        "NEXT_PUBLIC_CONVEX_URL must be the same as NEXT_PUBLIC_CONVEX_SITE_URL but with the .cloud and the .site suffix respextively",
      path: ["NEXT_PUBLIC_CONVEX_SITE_URL"],
    }
  );

export const publicEnv = (() => {
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_CONVEX_URL: process.env.NEXT_PUBLIC_CONVEX_URL,
    NEXT_PUBLIC_CONVEX_SITE_URL: process.env.NEXT_PUBLIC_CONVEX_SITE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });

  if (!parsed.success) {
    console.error(z.prettifyError(parsed.error));
    throw new Error("Invalid public environment variables");
  }

  return parsed.data;
})();
