import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  unformatedDate: number,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }
) {
  const date = new Date(unformatedDate);
  return new Intl.DateTimeFormat("en-US", options).format(date);
}
