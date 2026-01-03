import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.ap-northeast-1.wasabisys.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.wasabisys.com",
        pathname: "/**",
      },
      // Add other Wasabi regions if needed
      {
        protocol: "https",
        hostname: "s3.us-east-1.wasabisys.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.us-east-2.wasabisys.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.us-west-1.wasabisys.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.eu-central-1.wasabisys.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.eu-west-1.wasabisys.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "s3.eu-west-2.wasabisys.com",
        pathname: "/**",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
