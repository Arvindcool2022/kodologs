import { ArrowBigLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <Link
        className={
          buttonVariants({ variant: "outline" }) +
          " " +
          "absolute top-10 left-10 flex gap-2 outline-2"
        }
        href="/"
      >
        <ArrowBigLeft className="h-6 w-6" />
        Back
      </Link>
      <div className="">{children}</div>
    </div>
  );
}
