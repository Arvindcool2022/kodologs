"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function NavLink({
  href,
  children,
  //   prefetch = false,
}: Readonly<{ href: string; children: string; prefetch?: boolean }>) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      className={cn(
        "mx-0.5 underline-offset-4 hover:underline md:mx-2 lg:mx-4",
        isActive && "text-primary"
      )}
      href={href}
      //   prefetch={prefetch}
    >
      {children}
    </Link>
  );
}
