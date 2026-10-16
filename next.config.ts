import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  async redirects() {
    return [
      {
        // Old URL -> new canonical URL.
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
      {
        // Common singular misspelling -> correct plural URL.
        // Google discovered /moon-phase (singular) which 404s. Redirect
        // to the canonical /moon-phases so it gets indexed correctly.
        source: "/moon-phase",
        destination: "/moon-phases",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
