/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
  // Domain configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ]
  },
  // Custom domain redirects and rewrites
  async redirects() {
    return [
      // Redirect www to non-www for custom domains
      {
        source: '/(.*)',
        has: [
          {
            type: 'host',
            value: 'www.(?<domain>.*)',
          },
        ],
        destination: 'https://:domain/:path*',
        permanent: true,
      },
    ]
  },
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  // Image configuration for custom domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'googleusercontent.com',
        pathname: '/**',
      },
    ],
    domains: [
      // Add your custom domains here when you get them
      // Example: 'routineos.com', 'www.routineos.com'
      // When you have your domain, uncomment and update:
      ...(process.env.NEXT_PUBLIC_DOMAIN ? [
        process.env.NEXT_PUBLIC_DOMAIN,
        `www.${process.env.NEXT_PUBLIC_DOMAIN}`
      ] : [])
    ],
  },
  // Security and performance
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
}

module.exports = nextConfig