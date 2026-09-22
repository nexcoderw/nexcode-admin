import type {
  NextConfig,
} from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "res.cloudinary.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",

        headers: [
          {
            key:
              "X-Robots-Tag",
            value:
              "noindex, nofollow, noarchive",
          },
        ],
      },
    ];
  },
};

export default nextConfig;