import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 py-6">
      <Skeleton className="h-50 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-62.5" />
        <Skeleton className="mb-4 h-2.5 w-25" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-50" />
      </div>
    </div>
  );
}
