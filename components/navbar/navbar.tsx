import Link from "next/link";
import { NavLink } from "../ui/nav-link";
import { AuthNavButtons } from "./auth-nav-buttons";
import { SearchInput } from "./search-input";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  return (
    <nav className="flex w-full items-center justify-between py-5">
      <div className="flex w-full items-center justify-between gap-8 md:w-auto md:justify-start">
        <Link href="/">
          <h1 className="font-bold text-3xl">
            Kodo<span className="text-primary">Logs</span>
          </h1>
        </Link>
        <div className="flex items-center gap-2">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/blogs">Blogs</NavLink>
          <NavLink href="/create">Create</NavLink>
        </div>
      </div>
      <div className="hidden items-center gap-2 md:flex">
        <div className="mr-2 hidden md:block">
          <SearchInput />
        </div>
        <AuthNavButtons />
        <ThemeToggle />
      </div>
    </nav>
  );
}
