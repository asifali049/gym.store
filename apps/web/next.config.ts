import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.imagekit.io' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
  // Allows dev access from other devices on your LAN (e.g. phone testing at 192.168.x.x)
  allowedDevOrigins: ['192.168.1.13', 'localhost'],
};

export default nextConfig;
