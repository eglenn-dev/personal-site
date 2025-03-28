import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    async rewrites() {
        return [
            {
                source: "/home",
                destination: "/",
            },
        ];
    },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
