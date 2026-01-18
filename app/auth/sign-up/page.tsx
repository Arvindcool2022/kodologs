"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type SignUpData, signupSchema } from "@/app/schema/auth";
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

export default function SignUpPage() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      confirmPassword: "",
      email: "",
      name: "",
      password: "",
      phoneNumber: "",
    },
  });

  const router = useRouter();
  const onSubmit = async (data: SignUpData) => {
    console.log(data);
    try {
      const res = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        phoneNumber: data.phoneNumber,
        // fetchOptions: {
        //   onSuccess: () => {
        //     toast.success("Account created successfully");
        //     router.push("/");
        //   },
        //   onError: (error) => {
        //     toast.error("Sign up failed", {
        //       description:
        //         error instanceof Error ? error.message : "Unknown error",
        //     });
        //   },
        // },
      });
      if (res.error) {
        throw new Error(res.error.message);
      }
      toast.success("Account created successfully");
      router.push("/");
    } catch (error) {
      toast.error("Sign up failed", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Sign up</CardTitle>
        <CardDescription>Create an account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="*:my-5" onSubmit={handleSubmit(onSubmit)}>
          {/* FullName */}
          <RenderField
            control={control}
            key={"name"}
            label="FullName"
            name="name"
            placeholder="John Doe"
            type="text"
          />
          {/* Email */}
          <RenderField
            control={control}
            key={"email"}
            label="Email"
            name="email"
            placeholder="john.doe@example.com"
            type="email"
          />
          {/* phonenumber */}
          <RenderField
            control={control}
            key={"phoneNumber"}
            label="Phone Number"
            name="phoneNumber"
            placeholder="1234567890"
            type="tel"
          />
          {/* password */}
          <RenderField
            control={control}
            key={"password"}
            label="Password"
            name="password"
            placeholder="●●●●●●●●●"
            type="password"
          />
          {/* confirm password */}
          <RenderField
            control={control}
            key={"confirmPassword"}
            label="Confirm Password"
            name="confirmPassword"
            type="password"
          >
            <Button className="mt-2 w-full" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : null}
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </Button>
          </RenderField>
        </form>
      </CardContent>
    </Card>
  );
}
