import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Static export cho Cloudflare Pages — build ra thư mục `out/`
  output: 'export',
  // Cloudflare Pages phục vụ tốt URL có dấu / cuối
  trailingSlash: true,
  images: {
    // Static export không hỗ trợ Next image optimizer
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
}

export default nextConfig
