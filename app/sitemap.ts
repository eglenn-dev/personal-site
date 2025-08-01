import type { MetadataRoute } from "next";
import { getAllPosts } from "@/posts/blog-list";

export default function sitemap(): MetadataRoute.Sitemap {
    const postSlugs = getAllPosts();
    const blogPosts = postSlugs.map((post) => ({
        url: `https://ethanglenn.dev/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.5,
    }));
    const main = [
        {
            url: "https://ethanglenn.dev",
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 1,
        },
        {
            url: "https://ethanglenn.dev/projects",
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.9,
        },
        {
            url: "https://ethanglenn.dev/experience",
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.8,
        },
        {
            url: "https://ethanglenn.dev/blog",
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        },
        {
            url: "https://ethanglenn.dev/contact",
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        },
    ];

    return [...main, ...blogPosts];
}
