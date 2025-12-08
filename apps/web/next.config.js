/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "avatars.steamstatic.com",
      },
    ],
  },
};

export default nextConfig;
