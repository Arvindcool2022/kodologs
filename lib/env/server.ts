import z from "zod";

export const serverEnvSchema = z.object({
  CONVEX_DEPLOYMENT: z.string().min(1),
});

export const serverEnv = (() => {
  const parsed = serverEnvSchema.safeParse({
    CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT,
  });

  if (!parsed.success) {
    console.error(
      "Server env validation failed:",
      z.prettifyError(parsed.error)
    );
    throw new Error("Invalid server environment variables");
  }

  return parsed.data;
})();
