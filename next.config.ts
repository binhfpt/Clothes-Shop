import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // cho phép tất cả đường dẫn từ Cloudinary
      },
    ],
  },
};

export default nextConfig;
