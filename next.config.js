/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'fastly.picsum.photos' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'api.dicebear.com' },
    ],
  },
  // Proxies API calls to the standalone Express backend so the frontend can
  // keep calling relative `/api/...` paths unchanged, in every environment:
  // local dev (BACKEND_URL defaults to localhost:5000), and production on
  // Render where frontend and backend are two separate services with no
  // shared domain. In the docker-compose+nginx setup this is a no-op in
  // practice — nginx already intercepts `/api/` at the edge before it ever
  // reaches Next.js — so enabling it unconditionally is safe there too.
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
