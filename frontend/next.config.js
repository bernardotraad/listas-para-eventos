/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://listas-eventos-backend.onrender.com/api',
  },
  // Remove rewrites for static export - they don't work with static export
  // API calls will be handled by the Netlify function proxy
}

module.exports = nextConfig 