import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/navbar/theme-provider";
import { ConvexClientProvider } from "./convex-context-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Basic SEO - Most Important
  title: "Kodologs - Modern Blog Platform for Tech Enthusiasts",
  description:
    "Discover insightful articles on web development, JavaScript, Next.js, and modern tech trends. Join our community of developers and tech enthusiasts.",

  // Keywords - DEPRECATED but sometimes still used
  keywords: [
    "blog",
    "tech blog",
    "web development",
    "nextjs",
    "javascript",
    "programming",
    "kodologs",
    "developer blog",
  ],

  authors: [{ name: "Arvind A", url: "https://kodologs.com/about" }],
  creator: "Arvind A",
  publisher: "Kodologs",

  // Canonical URL - Important for SEO
  metadataBase: new URL("https://kodologs.com"),
  alternates: {
    canonical: "/",
  },

  // Open Graph - Critical for social sharing SEO
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://kodologs.com",
    siteName: "Kodologs",
    title: "Kodologs - Modern Blog Platform for Tech Enthusiasts",
    description:
      "Discover insightful articles on web development, JavaScript, Next.js, and modern tech trends.",
    images: [
      {
        url: "/og-image.jpg", // 1200x630px recommended
        width: 1200,
        height: 630,
        alt: "Kodologs Blog Platform",
      },
    ],
  },

  // Twitter Card - Important for Twitter sharing
  twitter: {
    card: "summary_large_image",
    title: "Kodologs - Modern Blog Platform",
    description: "Discover insightful articles on web development and tech.",
    creator: "@kodologs", // Your Twitter handle
    images: ["/twitter-image.jpg"],
  },

  // Robots - Control indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification codes
  verification: {
    google: "your-google-search-console-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: the type is jsonLd and not user input
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
          type="application/ld+json"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <ConvexClientProvider>
            <main className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
              {children}
            </main>
            <Toaster richColors />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

// Website Schema - Add to root layout.tsx
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Kodologs",
  url: "https://kodologs.com",
  description: "A modern blog platform for tech enthusiasts",

  // Enables Google site search box in results
  potentialAction: {
    "@type": "SearchAction",
    target: "https://kodologs.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

// Organization Schema - Add to root layout.tsx (combine with WebSite or separate)
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Kodologs",
  url: "https://kodologs.com",
  logo: "https://kodologs.com/logo.png", // Min 112x112px
  sameAs: ["https://twitter.com/kodologs", "https://github.com/kodologs"],
};

// Blog Posting Schema - Add to individual blog post pages
export const blogPostJsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Your Article Title", // Max 110 chars
  description: "Article summary",
  image: "https://kodologs.com/post-image.jpg", // Min 1200x675px
  datePublished: "2025-01-23T10:00:00Z", // ISO 8601 format
  dateModified: "2025-01-23T15:30:00Z", // Update when edited

  author: {
    "@type": "Person",
    name: "Arvind A",
    url: "https://kodologs.com/author/arvind",
  },

  publisher: {
    "@type": "Organization",
    name: "Kodologs",
    logo: {
      "@type": "ImageObject",
      url: "https://kodologs.com/logo.png",
    },
  },

  // Breadcrumb trail for navigation
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://kodologs.com/posts/your-post-slug",
  },
};

// Breadcrumb Schema - Add to pages with navigation paths
export const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://kodologs.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Blog",
      item: "https://kodologs.com/blog",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Article Title",
      item: "https://kodologs.com/blog/article-slug",
    },
  ],
};
