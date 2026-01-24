import { ProtectedRoute } from "@/components/protected";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
