# Next.js Cache Components - Smart Reference Guide

## 🚀 Quick Start

### Enable Cache Components
```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

---

## 📋 Core Concepts

### What is Cache Components?
Mix **static**, **cached**, and **dynamic** content in a single route for:
- 🚀 Speed of static sites
- 🔄 Flexibility of dynamic rendering
- 📦 Partial Prerendering (PPR)

### Rendering Model
```
Build Time → Prerender → Static HTML Shell + RSC Payload
Request Time → Stream Dynamic Content
```

---

## 🎯 Content Types & Patterns

### 1️⃣ Automatically Prerendered Content
✅ **What Gets Prerendered Automatically:**
- Synchronous I/O
- Module imports
- Pure computations
- No network requests
- No runtime APIs

```typescript
// ✅ Automatically prerendered
export default async function Page() {
  const content = fs.readFileSync('./config.json', 'utf-8')
  const constants = await import('./constants.json')
  const processed = JSON.parse(content).items.map(item => item.value * 2)
  
  return <div>{/* rendered output */}</div>
}
```

---

### 2️⃣ Dynamic Content (Request-Time Streaming)

#### Pattern: Wrap with Suspense
```typescript
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      <h1>Part of static shell</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <DynamicContent />
      </Suspense>
    </>
  )
}

async function DynamicContent() {
  // Network request
  const data = await fetch('https://api.example.com/data')
  
  // Database query
  const users = await db.query('SELECT * FROM users')
  
  // Async file system
  const file = await fs.readFile('..', 'utf-8')
  
  return <div>{/* content */}</div>
}
```

**🔑 Key Points:**
- Place `<Suspense>` **as close as possible** to dynamic components
- Maximizes static shell content
- Multiple dynamic sections render in **parallel**

---

### 3️⃣ Runtime Data (Request Context)

#### APIs That Require Request Context:
- `cookies()` - User's cookie data
- `headers()` - Request headers  
- `searchParams` - URL query parameters
- `params` - Dynamic route parameters

```typescript
import { cookies, headers } from 'next/headers'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RuntimeData />
    </Suspense>
  )
}

async function RuntimeData() {
  const cookieStore = await cookies()
  const headerStore = await headers()
  
  return <div>{/* personalized content */}</div>
}
```

**💡 Pro Tip:** Use `connection()` to defer to request time without accessing runtime APIs:
```typescript
import { connection } from 'next/server'

async function Component() {
  await connection() // Explicitly defer to request time
  // Now run request-time operations
}
```

---

### 4️⃣ Non-Deterministic Operations

Operations that produce different values each time:
- `Math.random()`
- `Date.now()`
- `crypto.randomUUID()`

#### Pattern: Signal Request-Time Intent
```typescript
import { connection } from 'next/server'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <UniqueContent />
    </Suspense>
  )
}

async function UniqueContent() {
  await connection() // Signal request-time execution
  
  const random = Math.random()
  const uuid = crypto.randomUUID()
  const now = Date.now()
  
  return <div>{random} - {uuid} - {now}</div>
}
```

---

## 🎨 Using `use cache` Directive

### Basic Pattern
```typescript
'use cache'
```

Can be applied at:
- **File level** - All exports cached
- **Component level** - Component output cached
- **Function level** - Function result cached

---

### Pattern 1: Cache During Prerendering

#### When to Use:
- Data changes infrequently (product catalogs, blog posts)
- Don't need fresh data on every request
- Want to include in static HTML shell

```typescript
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('hours')
  
  const users = await db.query('SELECT * FROM users')
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

#### Built-in Cache Profiles:
- `'hours'` - Revalidate every hour
- `'days'` - Revalidate daily
- `'weeks'` - Revalidate weekly
- `'max'` - Maximum cache duration

#### Custom Cache Configuration:
```typescript
cacheLife({
  stale: 3600,      // 1 hour until stale
  revalidate: 7200, // 2 hours until revalidated
  expire: 86400,    // 1 day until expired
})
```

---

### Pattern 2: Cache With Runtime Data

#### ⚠️ Critical Rule:
**Runtime APIs and `use cache` cannot be in the same scope**

#### ✅ Correct Pattern: Extract → Pass → Cache
```typescript
import { cookies } from 'next/headers'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  )
}

// Component reads runtime data (NOT cached)
async function ProfileContent() {
  const session = (await cookies()).get('session')?.value
  
  // Pass extracted value to cached component
  return <CachedContent sessionId={session} />
}

// Cached component receives data as props
async function CachedContent({ sessionId }: { sessionId: string }) {
  'use cache'
  // sessionId becomes part of cache key
  const data = await fetchUserData(sessionId)
  return <div>{data}</div>
}
```

**🔑 Cache Key:** Arguments become part of cache key, so different inputs = separate cache entries

---

## 🔑 Cache Keys vs Cache Tags - Understanding the Difference

### What is a Cache Key?
A **cache key** is automatically generated from your function's arguments and determines **which cache entry** to retrieve or store.

### What is a Cache Tag?
A **cache tag** is a **label** you manually assign to group cache entries for **invalidation purposes**.

---

### 🎯 How Cache Keys Work (Automatic)

When you create a cached function, Next.js **automatically serializes the arguments** to create a unique cache key:

```typescript
async function getCachedPosts(userId: string, category: string) {
  'use cache'
  const posts = await db.posts.get({ userId, category })
  return posts
}

// Different arguments = Different cache entries
getCachedPosts('user-123', 'tech')  // Cache Entry 1
getCachedPosts('user-123', 'news')  // Cache Entry 2
getCachedPosts('user-456', 'tech')  // Cache Entry 3
```

**Cache Keys Created:**
```
Entry 1: getCachedPosts('user-123', 'tech')
Entry 2: getCachedPosts('user-123', 'news')
Entry 3: getCachedPosts('user-456', 'tech')
```

Each combination of arguments creates a **separate cache entry**. This happens automatically - you don't need to do anything.

---

### 🏷️ How Cache Tags Work (Manual)

Cache tags let you **group related cache entries** so you can invalidate them together:

```typescript
async function getCachedPosts(userId: string, category: string) {
  'use cache'
  cacheTag('posts', `user-${userId}`)
  
  const posts = await db.posts.get({ userId, category })
  return posts
}

// Create 3 cache entries with different keys
getCachedPosts('user-123', 'tech')  // Tags: ['posts', 'user-user-123']
getCachedPosts('user-123', 'news')  // Tags: ['posts', 'user-user-123']
getCachedPosts('user-456', 'tech')  // Tags: ['posts', 'user-user-456']
```

**Now you can invalidate by tag:**
```typescript
// Invalidate ALL posts for user-123 (both 'tech' and 'news')
updateTag('user-user-123')

// Invalidate ALL posts across all users
updateTag('posts')
```

---

### 📊 Cache Key vs Cache Tag Comparison

| Aspect | Cache Key | Cache Tag |
|--------|-----------|-----------|
| **What is it?** | Unique identifier for cache entry | Label for grouping entries |
| **How it's created** | **Automatically** from function arguments | **Manually** with `cacheTag()` |
| **Purpose** | Find specific cache entry | Group entries for invalidation |
| **When it matters** | Reading from cache | Invalidating cache |
| **Uniqueness** | Must be unique per entry | Can be shared across entries |
| **Example** | `getUser('user-123')` | `cacheTag('users')` |

---

### 💡 Real-World Example: User Blog Posts

```typescript
import { cacheTag, updateTag } from 'next/cache'

// Cached function with automatic cache key + manual cache tags
async function getUserPosts(userId: string, token: string | undefined) {
  'use cache'
  cacheTag('posts', `user-${userId}`)
  
  const posts = await fetch(`/api/posts?userId=${userId}`, {
    headers: { Authorization: token ? `Bearer ${token}` : '' }
  })
  
  return posts.json()
}

// Usage creates different cache entries (automatic)
await getUserPosts('alice', 'token-abc')  // Cache Entry 1
await getUserPosts('alice', 'token-xyz')  // Cache Entry 2
await getUserPosts('bob', 'token-123')    // Cache Entry 3
await getUserPosts('bob', undefined)      // Cache Entry 4
```

**What got created:**

```
Cache Entry 1:
  Key:  getUserPosts('alice', 'token-abc')
  Tags: ['posts', 'user-alice']

Cache Entry 2:
  Key:  getUserPosts('alice', 'token-xyz')
  Tags: ['posts', 'user-alice']

Cache Entry 3:
  Key:  getUserPosts('bob', 'token-123')
  Tags: ['posts', 'user-bob']

Cache Entry 4:
  Key:  getUserPosts('bob', undefined)
  Tags: ['posts', 'user-bob']
```

**Invalidation scenarios:**

```typescript
// Scenario 1: Invalidate all posts for Alice (both tokens)
updateTag('user-alice')  // Invalidates Entry 1 & 2

// Scenario 2: Invalidate all posts for all users
updateTag('posts')       // Invalidates Entry 1, 2, 3, 4

// Scenario 3: Can't invalidate just Entry 1
// Cache keys don't support partial invalidation
// You'd need to add more specific tags
```

---

### 🎓 Advanced Pattern: Multiple Tags for Granular Control

```typescript
async function getPost(postId: string, userId: string) {
  'use cache'
  
  // Tag with multiple labels for different invalidation scenarios
  cacheTag(
    'posts',              // Invalidate all posts
    `post-${postId}`,     // Invalidate this specific post
    `user-${userId}`      // Invalidate all posts by this user
  )
  
  return db.posts.get(postId)
}

// Different cache entries (automatic keys)
await getPost('post-1', 'alice')  // Entry 1
await getPost('post-1', 'bob')    // Entry 2
await getPost('post-2', 'alice')  // Entry 3

// Flexible invalidation
updateTag('post-1')      // Invalidates Entry 1 & 2 (same post, different users)
updateTag('user-alice')  // Invalidates Entry 1 & 3 (same user, different posts)
updateTag('posts')       // Invalidates all 3 entries
```

---

### 🚨 Common Misconception

#### ❌ WRONG: Thinking tags affect cache lookup
```typescript
async function getPosts(category: string) {
  'use cache'
  cacheTag('posts')
  // ...
}

// These DON'T share the same cache entry!
await getPosts('tech')  // Cache Entry 1
await getPosts('news')  // Cache Entry 2

// They have the same TAG but different KEYS
// Tag doesn't affect cache lookup, only invalidation
```

#### ✅ CORRECT: Understanding keys vs tags
```typescript
// Cache KEY determines which entry to use (automatic from args)
// Cache TAG determines which entries to invalidate (manual with cacheTag)

await getPosts('tech')  
// Key:  getPosts('tech')
// Tag:  'posts'

await getPosts('news')  
// Key:  getPosts('news')  ← Different key = different entry
// Tag:  'posts'           ← Same tag = both invalidated together
```

---

### 📝 Key Takeaways

1. **Cache Keys are Automatic** - Generated from function arguments, no code needed
2. **Cache Tags are Manual** - You add them with `cacheTag()` for grouping
3. **Keys for Retrieval** - Which cache entry to use when function is called
4. **Tags for Invalidation** - Which cache entries to expire when data changes
5. **One Entry, Many Tags** - A single cache entry can have multiple tags
6. **Different Args = Different Keys** - Even if tags are the same

---

### Pattern 3: Cache Non-Deterministic Operations

#### When to Use:
Want same random values served to all users (until revalidation)

```typescript
export default async function Page() {
  'use cache'
  
  // Execute once during prerendering, cached for all
  const random = Math.random()
  const uuid = crypto.randomUUID()
  const timestamp = Date.now()
  
  return <div>{random} - {uuid} - {timestamp}</div>
}
```

**Result:** All users see the same values until cache revalidates

---

## 🏷️ Cache Tagging & Revalidation

### ⚡ updateTag vs revalidateTag: The Complete Guide

Both functions invalidate cached data, but they work **fundamentally differently**. Understanding this is crucial for choosing the right one.

---

### 🔴 updateTag - Immediate Synchronous Updates

#### Core Behavior:
```typescript
updateTag('cart')
```

**What Happens:**
1. ✅ Cache entry **expires immediately**
2. ✅ **Next request waits** for fresh data to be fetched
3. ✅ User sees their **changes immediately** (no stale data)
4. ⚠️ No stale data served while fetching

#### When to Use:
✅ **User mutations** - Shopping carts, profiles, form submissions  
✅ **Read-your-own-writes** - User must see their changes immediately  
✅ **Within same request** - User action triggers update in same flow  
✅ **Server Actions only** - Cannot be used in Route Handlers

#### Example: Shopping Cart
```typescript
import { cacheTag, updateTag } from 'next/cache'

// Cached cart data
export async function getCart() {
  'use cache'
  cacheTag('cart')
  return await db.cart.get()
}

// Server Action
export async function addToCart(itemId: string) {
  'use server'
  
  // 1. Update database
  await db.cart.addItem(itemId)
  
  // 2. Immediately expire cache
  updateTag('cart')
  
  // 3. Next request waits for fresh data
  // User sees updated cart immediately
}
```

**Timeline:**
```
User Action → Database Update → updateTag() → Cache Expired
↓
Next Request → Wait for Fresh Fetch → Return Fresh Data
```

---

### 🟢 revalidateTag - Background Stale-While-Revalidate

#### Core Behavior:
```typescript
revalidateTag('posts', 'max')
```

**What Happens:**
1. ✅ Cache marked as **stale** (not expired)
2. ✅ **Serves stale content** immediately on next request
3. ✅ **Fetches fresh data in background**
4. ✅ Future requests get the fresh data

#### When to Use:
✅ **Static content** - Blog posts, product catalogs, documentation  
✅ **CMS updates** - Content rarely changes  
✅ **Eventual consistency** - Slight delay acceptable  
✅ **Background updates** - Don't block user  
✅ **Server Actions OR Route Handlers** - Works in both

#### Example: Blog Posts
```typescript
import { cacheTag, revalidateTag } from 'next/cache'

// Cached blog posts
export async function getPosts() {
  'use cache'
  cacheTag('posts')
  return await db.posts.getAll()
}

// Server Action
export async function createPost(post: FormData) {
  'use server'
  
  // 1. Update database
  await db.posts.create(post)
  
  // 2. Mark cache as stale
  revalidateTag('posts', 'max')
  
  // 3. Next request serves stale data
  // Fresh data fetches in background
}
```

**Timeline:**
```
Admin Action → Database Update → revalidateTag('posts', 'max')
↓
Next User Request → Serves Stale Content + Triggers Background Fetch
↓
Background Fetch Completes → Cache Updated
↓
Subsequent Requests → Serve Fresh Data
```

---

### 📊 Side-by-Side Comparison

| Feature | updateTag | revalidateTag |
|---------|-----------|---------------|
| **Cache Behavior** | Expires immediately | Marks as stale |
| **Next Request** | Waits for fresh data | Serves stale + fetches fresh |
| **User Experience** | Sees own changes immediately | May see stale data briefly |
| **Performance** | Blocking (waits for fetch) | Non-blocking (serves stale) |
| **Use Case** | User mutations | Content updates |
| **Where Used** | Server Actions ONLY | Server Actions + Route Handlers |
| **Consistency** | Immediate consistency | Eventual consistency |
| **Best For** | Shopping carts, profiles | Blog posts, CMS, catalogs |

---

### 🎯 Decision Tree

```
Need to invalidate cache?
├─ User made a change and must see it immediately?
│  └─ YES → Use updateTag
│     └─ In Server Action only
│
└─ Content updated by admin/system?
   └─ Users can see stale data briefly?
      └─ YES → Use revalidateTag with 'max'
         └─ Works in Server Actions + Route Handlers
```

---

### 💡 Real-World Scenarios

#### Scenario 1: E-commerce Cart
```typescript
// ✅ CORRECT: Use updateTag
export async function addToCart(itemId: string) {
  'use server'
  await db.cart.add(itemId)
  updateTag('cart')
  // User must see cart update immediately
}
```

#### Scenario 2: Blog Post Publication
```typescript
// ✅ CORRECT: Use revalidateTag
export async function publishPost(postId: string) {
  'use server'
  await db.posts.publish(postId)
  revalidateTag('posts', 'max')
  // Other users can see stale list briefly
}
```

#### Scenario 3: User Profile Update
```typescript
// ✅ CORRECT: Use updateTag
export async function updateProfile(data: FormData) {
  'use server'
  await db.profile.update(data)
  updateTag('profile')
  // User must see their profile changes immediately
}
```

#### Scenario 4: Product Inventory Update (Admin)
```typescript
// ✅ CORRECT: Use revalidateTag
export async function updateInventory(productId: string, quantity: number) {
  'use server'
  await db.products.updateQuantity(productId, quantity)
  revalidateTag('products', 'max')
  // Customers can see old inventory briefly
}
```

#### Scenario 5: Webhook from External Service
```typescript
// ✅ CORRECT: Use revalidateTag in Route Handler
export async function POST(request: Request) {
  const { productId } = await request.json()
  
  // Update database
  await db.products.sync(productId)
  
  // Can't use updateTag in Route Handlers!
  revalidateTag('products', 'max')
  
  return Response.json({ success: true })
}
```

---

### ⚠️ Common Mistakes

#### ❌ WRONG: Using updateTag in Route Handler
```typescript
// ERROR: This will throw
export async function POST() {
  updateTag('posts')
  // Error: updateTag can only be called from within a Server Action
}
```

#### ❌ WRONG: Using revalidateTag for user mutations
```typescript
// BAD: User won't see their changes immediately
export async function addToCart(itemId: string) {
  'use server'
  await db.cart.add(itemId)
  revalidateTag('cart', 'max') // User sees OLD cart on next request!
}
```

#### ✅ CORRECT: Using revalidateTag with 'max' profile
```typescript
// GOOD: Stale-while-revalidate semantics
export async function updatePost(postId: string) {
  'use server'
  await db.posts.update(postId)
  revalidateTag('posts', 'max')
}
```

#### ⚠️ DEPRECATED: Using revalidateTag without profile
```typescript
// DEPRECATED: This is now equivalent to updateTag
revalidateTag('posts') // Don't use without second argument
```

---

### 🔧 Advanced: Custom Cache Profiles

You can use custom profiles with revalidateTag:

```typescript
// Use any defined cache life profile
revalidateTag('analytics', 'hours')
revalidateTag('reports', 'days')

// Or custom expiration
revalidateTag('data', { expire: 3600 })
```

---

### Pattern 1: Immediate Update (updateTag)

#### When to Use:
- Need immediate cache refresh
- User mutations (cart updates, form submissions)
- Within same request cycle

```typescript
import { cacheTag, updateTag } from 'next/cache'

// Cached function
export async function getCart() {
  'use cache'
  cacheTag('cart')
  // fetch cart data
}

// Server Action - immediate update
export async function updateCart(itemId: string) {
  'use server'
  // write data
  await db.updateCart(itemId)
  
  // Immediately expire and refresh
  updateTag('cart')
}
```

---

### Pattern 2: Eventual Consistency (revalidateTag)

#### When to Use:
- Static content updates (blog posts, CMS)
- Eventual consistency acceptable
- Background revalidation preferred

```typescript
import { cacheTag, revalidateTag } from 'next/cache'

// Cached function
export async function getPosts() {
  'use cache'
  cacheTag('posts')
  // fetch posts
}

// Server Action - mark for revalidation
export async function createPost(post: FormData) {
  'use server'
  await db.insertPost(post)
  
  // Mark for revalidation (stale-while-revalidate)
  revalidateTag('posts', 'max')
}
```

**Difference:**
- `updateTag` → Expire + refresh immediately (same request)
- `revalidateTag` → Mark stale, revalidate in background

---

## 🎓 Complete Real-World Example

```typescript
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife } from 'next/cache'
import Link from 'next/link'

export default function BlogPage() {
  return (
    <>
      {/* ✅ Static content - automatically prerendered */}
      <header>
        <h1>Our Blog</h1>
        <nav>
          <Link href="/">Home</Link> | <Link href="/about">About</Link>
        </nav>
      </header>

      {/* ✅ Cached dynamic - included in static shell */}
      <BlogPosts />

      {/* ✅ Runtime dynamic - streams at request time */}
      <Suspense fallback={<p>Loading preferences...</p>}>
        <UserPreferences />
      </Suspense>
    </>
  )
}

// Everyone sees same posts (revalidated hourly)
async function BlogPosts() {
  'use cache'
  cacheLife('hours')
  
  const res = await fetch('https://api.vercel.app/blog')
  const posts = await res.json()
  
  return (
    <section>
      <h2>Latest Posts</h2>
      <ul>
        {posts.slice(0, 5).map((post: any) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>By {post.author} on {post.date}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

// Personalized per user
async function UserPreferences() {
  const theme = (await cookies()).get('theme')?.value || 'light'
  const category = (await cookies()).get('category')?.value
  
  return (
    <aside>
      <p>Theme: {theme}</p>
      {category && <p>Category: {category}</p>}
    </aside>
  )
}
```

**What happens:**
1. User visits → sees static shell instantly (header + cached blog posts)
2. User preferences stream in (personalized based on cookies)
3. Result: Fast initial load + personalized content

---

## 🚨 Common Errors & Solutions

### Error: "Uncached data was accessed outside of <Suspense>"

**Cause:** Dynamic/runtime data not wrapped in Suspense or cached

**Solutions:**
1. Wrap with `<Suspense>`
2. Add `'use cache'` if data doesn't change often
3. Use `connection()` to explicitly defer

---

### Error: Build Hangs (Cache Timeout)

**Cause:** Accessing Promises to runtime data created outside `use cache` boundary

**Example Problem:**
```typescript
// ❌ BAD: Passing runtime Promise as prop
async function Dynamic() {
  const cookieStore = cookies() // Promise
  return <Cached promise={cookieStore} />
}

async function Cached({ promise }: { promise: Promise<unknown> }) {
  'use cache'
  const data = await promise // Waits for runtime data during build!
  return <p>...</p>
}
```

**Solution:**
```typescript
// ✅ GOOD: Await runtime data, pass value
async function Dynamic() {
  const cookieStore = await cookies()
  const value = cookieStore.get('key')?.value
  return <Cached value={value} />
}

async function Cached({ value }: { value: string }) {
  'use cache'
  return <p>{value}</p>
}
```

---

## 🔧 Debug Tools

### Enable Verbose Logging
```bash
NEXT_PRIVATE_DEBUG_CACHE=1 npm run dev
# or for production
NEXT_PRIVATE_DEBUG_CACHE=1 npm run start
```

### Verify Prerendering
- Check build output summary
- View page source in browser
- Look for static HTML content

---

## 📊 Decision Matrix

| Content Type | Pattern | When to Use |
|--------------|---------|-------------|
| **Static** | No directive | Pure computations, module imports |
| **Cached Dynamic** | `use cache` + `cacheLife` | Data changes infrequently, no runtime data |
| **Streaming Dynamic** | `<Suspense>` | Fresh data every request, runtime APIs |
| **Cached + Runtime** | Extract → Pass → Cache | Personalized cached content |
| **Non-deterministic** | `use cache` or `connection()` | Same/different random values per request |

---

## 🔄 Migration Guide

### From `dynamic = "force-dynamic"`
```typescript
// Before
export const dynamic = 'force-dynamic'

// After - Just remove it (dynamic by default)
```

### From `dynamic = "force-static"`
```typescript
// Before
export const dynamic = 'force-static'
export default async function Page() {
  const data = await fetch('https://api.example.com/data')
  return <div>...</div>
}

// After
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('max')
  const data = await fetch('https://api.example.com/data')
  return <div>...</div>
}
```

### From `revalidate`
```typescript
// Before
export const revalidate = 3600

// After
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('hours')
  return <div>...</div>
}
```

### From `fetchCache`
```typescript
// Before
export const fetchCache = 'force-cache'

// After - use cache controls all fetching
export default async function Page() {
  'use cache'
  // All fetches here are cached
  return <div>...</div>
}
```

---

## ⚡ Best Practices

### 1. **Place Suspense Boundaries Close**
```typescript
// ✅ GOOD - Maximizes static shell
<div>
  <StaticHeader />
  <Suspense fallback={<Spinner />}>
    <DynamicSection />
  </Suspense>
  <StaticFooter />
</div>

// ❌ BAD - Entire page becomes dynamic
<Suspense fallback={<Spinner />}>
  <div>
    <StaticHeader />
    <DynamicSection />
    <StaticFooter />
  </div>
</Suspense>
```

### 2. **Extract Runtime Data Early**
```typescript
// ✅ GOOD
async function Parent() {
  const session = (await cookies()).get('session')?.value
  return <CachedChild sessionId={session} />
}

// ❌ BAD - Can't cache
async function Parent() {
  const cookieStore = await cookies()
  'use cache' // Error!
  return <div>...</div>
}
```

### 3. **Use Tags for Related Data**
```typescript
// Tag related data together
export async function getUser(id: string) {
  'use cache'
  cacheTag('user', `user-${id}`)
  return db.getUser(id)
}

export async function getUserPosts(userId: string) {
  'use cache'
  cacheTag('posts', `user-${userId}`)
  return db.getPosts(userId)
}

// Invalidate all user data at once
export async function deleteUser(id: string) {
  'use server'
  await db.deleteUser(id)
  updateTag(`user-${id}`) // Invalidates both functions
}
```

### 4. **Choose Right Revalidation Strategy**

**Use `updateTag` for:**
- Shopping carts
- User profiles
- Real-time data
- Immediate consistency needed

**Use `revalidateTag` for:**
- Blog posts
- Product catalogs
- Marketing content
- Eventual consistency acceptable

### 5. **Profile Your Cache Lifetimes**
```typescript
// Short-lived data
cacheLife('minutes') // or custom: { stale: 60 }

// Medium-lived data
cacheLife('hours')   // or custom: { stale: 3600 }

// Long-lived data
cacheLife('days')    // or custom: { stale: 86400 }

// Static data
cacheLife('max')     // Maximum duration
```

---

## 🎯 Quick Reference Cheatsheet

```typescript
// ═══════════════════════════════════════════════════════
// STATIC CONTENT (automatic)
// ═══════════════════════════════════════════════════════
const data = fs.readFileSync('file.json')
const config = await import('./config.json')

// ═══════════════════════════════════════════════════════
// CACHED CONTENT
// ═══════════════════════════════════════════════════════
'use cache'
cacheLife('hours')
const data = await fetch('https://api.example.com/data')

// ═══════════════════════════════════════════════════════
// DYNAMIC CONTENT
// ═══════════════════════════════════════════════════════
<Suspense fallback={<Loading />}>
  <DynamicComponent />
</Suspense>

// ═══════════════════════════════════════════════════════
// RUNTIME DATA
// ═══════════════════════════════════════════════════════
const cookieStore = await cookies()
const headerStore = await headers()
const { searchParams } = props
const { params } = props

// ═══════════════════════════════════════════════════════
// CACHE INVALIDATION
// ═══════════════════════════════════════════════════════
cacheTag('tag-name')           // Tag cache entry
updateTag('tag-name')          // Immediate invalidation
revalidateTag('tag-name')      // Background revalidation

// ═══════════════════════════════════════════════════════
// DEFER TO REQUEST TIME
// ═══════════════════════════════════════════════════════
await connection()             // Without accessing runtime APIs
```

---

## 📚 Additional Resources

- [use cache API Reference](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [cacheLife API Reference](https://nextjs.org/docs/app/api-reference/functions/cacheLife)
- [cacheTag API Reference](https://nextjs.org/docs/app/api-reference/functions/cacheTag)
- [Partial Prerendering Video](https://www.youtube.com/watch?v=MTcPrTIBkpA)

---

**Last Updated:** January 2026  
**Next.js Version:** 16.x