/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      },
      {
        protocol: 'https',
        hostname: 'getstream.io'
      },
      {
        protocol: 'https',
        hostname: 'static.vecteezy.com'
      }
    ]
  }
};

export default nextConfig;
