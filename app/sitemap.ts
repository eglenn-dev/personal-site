import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://ethanglenn.dev",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 1,
        },
        {
            url: "https://ethanglenn.dev/projects",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: "https://ethanglenn.dev/experience",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: "https://ethanglenn.dev/blog",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: "https://ethanglenn.dev/contact",
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        },
    ];
}
