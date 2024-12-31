import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/home",
                destination: "/",
            },
        ];
    },
};

export default nextConfig;
