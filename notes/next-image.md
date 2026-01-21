## Note: Next/Image vs Convex Storage (why `unoptimized` is required)

* `next/image` is an **image optimization proxy**, not a drop-in `<img>` replacement.
* It fetches the remote image server-side (`/_next/image`) and expects:

  * stable bytes
  * correct `Content-Type`
  * cache headers (`ETag` / `Last-Modified`)
  * byte-range support
  * public, non-expiring URLs

**Why Pexels works**

* Static CDN
* Immutable assets
* Proper cache + range headers
* Optimizer fetch succeeds → cached → `304 Not Modified`

**Why Convex Storage fails**

* Served via `/api/storage/*` (API endpoint, not static CDN)
* Dynamic blob delivery
* Not guaranteed optimizer-compatible
* Optimizer fetch/transform fails → `/_next/image` returns 500

**Why tutorials may “work”**

* Older Next.js versions (looser optimizer)
* Dev mode only
* Different Convex infra / headers
* Small or simple images
* Relied on undefined behavior

**Correct production rule**

* Static image CDNs (Pexels, Cloudinary, Imgix, Vercel Blob) → `<Image />`
* Blob storage / signed URLs (Convex, S3, Supabase) → `<Image unoptimized />` or `<img>`

**Conclusion**

* Nothing was misconfigured
* `remotePatterns` only allow fetching; they do not guarantee optimization
* Using `unoptimized` with Convex is correct, stable, and future-proof
