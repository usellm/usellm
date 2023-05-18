/** @type {import('next').NextConfig} */

import { withContentlayer } from "next-contentlayer";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/llmservice",
        destination: "/api/llm",
      },
    ];
  },
};

export default withContentlayer(nextConfig);
