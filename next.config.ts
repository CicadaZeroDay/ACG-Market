import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'ewyuzdnqrnuktbxoofiq.supabase.co',
      },
    ],
  },
};

export default nextConfig;
