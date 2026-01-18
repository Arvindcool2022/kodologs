"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type LoginData, loginSchema } from "@/app/schema/auth";
import { RenderField } from "@/components/render-field";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: LoginData) => {
    await authClient.signIn.email({
      email: data.email,
      password: data.password,
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged in successfully");
          router.push("/");
        },
        onError: (error) => {
          toast.error("Login failed", {
            description:
              error instanceof Error ? error.message : "Unknown error",
          });
        },
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Log into your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="*:my-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <RenderField
            control={control}
            key={"email"}
            label="Email"
            name="email"
            placeholder="john.doe@example.com"
            type="email"
          />

          {/* password */}
          <RenderField
            control={control}
            key={"password"}
            label="Password"
            name="password"
            placeholder="●●●●●●●●●"
            type="password"
          >
            <Button className="mt-2 w-full" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : null}
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </RenderField>
        </form>
      </CardContent>
    </Card>
  );
}
