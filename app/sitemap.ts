import type { MetadataRoute } from "next";
import { getPublicPosts } from "@/posts/blog-list";

const BUILD_DATE = new Date().toISOString();

export default function sitemap(): MetadataRoute.Sitemap {
    const postSlugs = getPublicPosts();
    const blogPosts = postSlugs.map((post) => ({
        url: `https://ethanglenn.dev/blog/${post.slug}`,
        lastModified: post.date,
        changeFrequency: "monthly" as const,
        priority: 0.5,
    }));

    const main = [
        {
            url: "https://ethanglenn.dev",
            lastModified: BUILD_DATE,
            changeFrequency: "monthly" as const,
            priority: 1,
        },
        {
            url: "https://ethanglenn.dev/projects",
            lastModified: BUILD_DATE,
            changeFrequency: "monthly" as const,
            priority: 0.9,
        },
        {
            url: "https://ethanglenn.dev/experience",
            lastModified: BUILD_DATE,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        },
        {
            url: "https://ethanglenn.dev/blog",
            lastModified: BUILD_DATE,
            changeFrequency: "weekly" as const,
            priority: 0.7,
        },
        {
            url: "https://ethanglenn.dev/contact",
            lastModified: BUILD_DATE,
            changeFrequency: "monthly" as const,
            priority: 0.6,
        },
    ];

    return [...main, ...blogPosts];
}
