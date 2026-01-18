import z from "zod";

export const signupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    phoneNumber: z.string().regex(/^\d{10}$/, "Invalid phone number"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type SignUpData = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string(),
});
export type LoginData = z.infer<typeof loginSchema>;
