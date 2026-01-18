import Link from "next/link";
import { AuthNavButtons } from "./auth-nav-buttons";
import { ThemeToggle } from "./theme-toggle";
import { buttonVariants } from "./ui/button";

export function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between py-5">
      <div className="flex items-center gap-8">
        <Link href="/">
          <h1 className="font-bold text-3xl">
            Kodo <span className="text-blue-500">Logs</span>
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <Link className={buttonVariants({ variant: "link" })} href="/">
            Home
          </Link>
          <Link className={buttonVariants({ variant: "link" })} href="/blogs">
            Blogs
          </Link>
          <Link className={buttonVariants({ variant: "link" })} href="/create">
            Create
          </Link>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <AuthNavButtons />
        <ThemeToggle />
      </div>
    </nav>
  );
}
