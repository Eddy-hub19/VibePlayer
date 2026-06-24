/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      },
    ]
  },
  allowedDevOrigins: ["192.168.31.70"],
}

export default nextConfig
