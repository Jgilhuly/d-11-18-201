import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Custom i18n configuration for dynamic locale support
   * 
   * Note: We're NOT using Next.js built-in i18n routing because:
   * 1. Our locale system is dynamic (can detect locales at runtime)
   * 2. Built-in i18n requires static locale configuration at build time
   * 3. Our custom middleware provides more flexibility for locale detection
   * 
   * Instead, we handle routing via middleware.ts and LocaleContext
   */
  
  // Ensure trailing slashes are consistent for locale routing
  trailingSlash: false,
  
  // Skip trailing slash redirect to avoid conflicts with locale middleware
  skipTrailingSlashRedirect: true,
  
  // Enable experimental features if needed for better i18n support
  experimental: {
    // Future i18n features can be enabled here as Next.js evolves
  },
  
  // Image configuration for Next.js Image component
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
    ],
  },
  
  // Headers for locale detection support
  async headers() {
    return [
      {
        // Apply locale headers to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Accept-Language',
            value: 'en, es, fr, de, it, pt, ja, ko, zh, ar',
          },
        ],
      },
    ]
  },
  
  // Rewrites to support locale-prefixed routes
  async rewrites() {
    return [
      // These rewrites help ensure our middleware can properly handle
      // locale detection without conflicting with Next.js internal routing
      {
        source: '/health',
        destination: '/api/health',
      },
    ]
  },
};

export default nextConfig;
