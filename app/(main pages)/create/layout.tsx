import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth-server";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!(await isAuthenticated())) {
    redirect("/auth/login");
  }
  return <>{children}</>;
}
