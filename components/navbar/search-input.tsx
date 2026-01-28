"use client";
import { useQuery } from "convex/react";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/convex/_generated/api";
import { Input } from "../ui/input";

export const SearchInput = () => {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const result = useQuery(
    api.posts.searchPosts,
    term.length >= 2 ? { limit: 5, term } : "skip"
  );
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
    setOpen(true);
  };

  const handleNavigated = () => {
    setTerm("");
    setOpen(false);
  };
  let content: React.ReactNode;

  if (!result) {
    content = (
      <div className="flex items-center justify-center p-4 text-muted-foreground text-sm">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Searching...
      </div>
    );
  } else if (result.length === 0) {
    content = (
      <p className="p-4 text-center text-muted-foreground text-sm">
        No results found!
      </p>
    );
  } else {
    content = result.map((post) => (
      <div className="border-b py-1" key={post._id}>
        <Link
          className="flex cursor-pointer flex-col px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
          href={`/blogs/${post._id}`}
          onNavigate={handleNavigated}
        >
          <p className="truncate font-medium">{post.title}</p>
          <p>{post.content.substring(0, 30)}...</p>
        </Link>
      </div>
    ));
  }

  return (
    <div className="relative z-50 w-full max-w-sm">
      <div className="relative">
        <Search className="absolute top-2.5 left-2.5 size-4 text-muted-foreground" />
        <Input
          className="w-full bg-background pl-8"
          onChange={handleInputChange}
          placeholder="Search Blogs"
          type="search"
          value={term}
        />
      </div>
      {open && term.length > 2 && (
        <div className="fade-in-0 zoom-in-95 absolute top-full mt-2 animate-in rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
          {content}
        </div>
      )}
    </div>
  );
};
