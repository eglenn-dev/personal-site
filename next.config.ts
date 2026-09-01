import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
    pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
    cacheComponents: true,
    env: {
        // Inlined at build time so <FooterSkeleton /> can render the copyright
        // year without reading the clock during prerender.
        NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()),
    },
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
