"use client";

import type { ImageProps } from "next/image";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

export function BlogImage(props: ImageProps) {
  const [retryKey, setRetryKey] = useState(0);
  const [_hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      {isLoading && <Skeleton className="absolute inset-0" />}

      <Image
        {...props}
        key={retryKey}
        onError={() => {
          setHasError(true);
          setTimeout(() => {
            setRetryKey((prev) => prev + 1);
            setHasError(false);
          }, 5000);
          toast.info("retrying to fetch image");
        }}
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
}
