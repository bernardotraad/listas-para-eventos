/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://listas-eventos-backend.onrender.com/api',
  },
  // Configure for Vercel deployment
  experimental: {
    serverComponentsExternalPackages: [],
  },
}

module.exports = nextConfig 