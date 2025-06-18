import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    async redirects() {
        return [
            {
                source: "/home",
                destination: "/",
                permanent: false,
            },
        ];
    },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
