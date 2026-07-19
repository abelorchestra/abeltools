import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/ot1", destination: "/orchtools-brsofriend", permanent: true },
      { source: "/ot2", destination: "/orchtools-kontaktcutter", permanent: true },
      { source: "/ot3", destination: "/orchtools-ot3", permanent: true },
      { source: "/pt1", destination: "/prodtools-mixerpalette", permanent: true },
      { source: "/pt2", destination: "/prodtools-pt2", permanent: true },
      { source: "/pt3", destination: "/prodtools-pt3", permanent: true },
      { source: "/mb1", destination: "/myblog-mysong", permanent: true },
      { source: "/mb2", destination: "/myblog-mytips", permanent: true },
      { source: "/mb3", destination: "/myblog-history", permanent: true },
    ];
  },
};

export default nextConfig;
