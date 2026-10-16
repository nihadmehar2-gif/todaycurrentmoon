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
      {
        // Plural misspelling -> correct singular URL.
        // The actual page is /moon-calculator (singular). Google and users
        // may try /moon-calculators (plural) which 404s. Redirect to the
        // canonical /moon-calculator.
        source: "/moon-calculators",
        destination: "/moon-calculator",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
