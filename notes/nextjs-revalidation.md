# Next.js Revalidation & Cache Management

## Overview
Next.js App Router provides multiple ways to revalidate cached data. Understanding when and how to use each method is crucial for optimal performance.

---

## Server-Side Revalidation

### 1. `revalidatePath(path)`
**Location:** Server Actions, Route Handlers  
**Scope:** Invalidates cache for a specific route path  
**Use case:** When data changes affect an entire page or layout

```typescript
"use server";
import { revalidatePath } from "next/cache";

export async function createPost(data: FormData) {
  // ... create post logic
  revalidatePath("/blogs"); // Invalidate all blog listing pages
  revalidatePath("/blogs/[id]", "page"); // Invalidate specific blog page
}
```

**Options:**
- `revalidatePath("/blogs")` - Revalidates exact path
- `revalidatePath("/blogs", "layout")` - Revalidates layout and all nested pages
- `revalidatePath("/blogs", "page")` - Revalidates only the page (default)

---

### 2. `revalidateTag(tag)`
**Location:** Server Actions, Route Handlers  
**Scope:** Fine-grained invalidation based on cache tags  
**Use case:** When specific data changes (more targeted than path revalidation)

```typescript
"use server";
import { revalidateTag } from "next/cache";

export async function updateUser(userId: string) {
  // ... update user logic
  revalidateTag("user-profile"); // Only invalidate data tagged with "user-profile"
  revalidateTag(`user-${userId}`); // Tag-specific invalidation
}
```

**Adding tags to fetch requests:**
```typescript
// app/page.tsx (Server Component)
async function getData() {
  const res = await fetch("https://api.example.com/posts", {
    next: { 
      tags: ["blogs", "posts"],
      revalidate: 3600 // Optional: time-based revalidation (1 hour)
    }
  });
  return res.json();
}
```

---

## Client-Side Revalidation

### 3. `router.refresh()`
**Location:** Client Components  
**Scope:** Coarse-grained; re-runs all Server Components for current route  
**Use case:** Force a full page refresh without reloading browser

```typescript
"use client";
import { useRouter } from "next/navigation";

export default function MyComponent() {
  const router = useRouter();
  
  const handleRefresh = () => {
    router.refresh(); // Re-fetches all Server Component data
  };
  
  return <button onClick={handleRefresh}>Refresh Data</button>;
}
```

**⚠️ Limitations:**
- Cannot revalidate specific paths or tags from client
- Refreshes entire route tree
- More expensive than targeted server-side revalidation

---

## Comparison Table

| Method | Location | Granularity | Use Case |
|--------|----------|-------------|----------|
| `revalidatePath()` | Server | Route-level | Invalidate entire page/layout |
| `revalidateTag()` | Server | Data-level | Invalidate specific cached data |
| `router.refresh()` | Client | Route-level | Force re-fetch all Server Components |

---

## Best Practices

### ✅ Do:
- **Use `revalidateTag()`** for targeted updates (e.g., single user profile, specific post)
- **Use `revalidatePath()`** for broad updates (e.g., new post added to list)
- **Tag your fetches** with meaningful identifiers for granular control
- **Use `router.refresh()`** sparingly for user-triggered refreshes

### ❌ Don't:
- Don't call `router.refresh()` after every mutation (use server revalidation instead)
- Don't forget to add tags to fetch requests if using `revalidateTag()`
- Don't over-revalidate (causes unnecessary re-renders and API calls)

---

## Example: Full CRUD with Revalidation

```typescript
"use server";
import { revalidatePath, revalidateTag } from "next/cache";

// CREATE - Revalidate list page
export async function createPost(data: FormData) {
  const post = await db.posts.create(/* ... */);
  revalidatePath("/blogs");
  revalidateTag("posts-list");
  return post.id;
}

// UPDATE - Revalidate specific post
export async function updatePost(id: string, data: FormData) {
  await db.posts.update(id, /* ... */);
  revalidatePath(`/blogs/${id}`);
  revalidateTag(`post-${id}`);
}

// DELETE - Revalidate both list and detail
export async function deletePost(id: string) {
  await db.posts.delete(id);
  revalidatePath("/blogs");
  revalidatePath(`/blogs/${id}`);
  revalidateTag("posts-list");
}
```

---

## Convex vs Next.js Caching

**With Convex (Real-time subscriptions):**
- No manual revalidation needed
- Pub/Sub architecture automatically updates UI
- `router.refresh()` not required

**With Next.js Fetch (Traditional REST/GraphQL):**
- Manual revalidation required via `revalidatePath()` or `revalidateTag()`
- Must explicitly tell Next.js when data changes

```typescript
// Convex: Automatic updates ✅
const posts = useQuery(api.posts.list);

// Next.js Fetch: Manual revalidation needed ⚠️
const posts = await fetch("/api/posts");
// Must call revalidatePath() after mutations
```

---

## Additional Resources

- [Next.js Data Fetching Docs](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Caching in Next.js](https://nextjs.org/docs/app/building-your-application/caching)
- [Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
