import { getPublicPosts } from "@/posts/blog-list";
import { SITE_URL, SITE_NAME, RSS_PATH } from "@/lib/site-config";

const FEED_DESCRIPTION =
    "Insights, lessons, and discoveries from my projects and interests.";

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function toRfc822(date: string): string {
    return new Date(`${date}T00:00:00Z`).toUTCString();
}

export function GET() {
    const posts = getPublicPosts();

    const items = posts
        .map((post) => {
            const url = `${SITE_URL}/blog/${post.slug}`;
            return `        <item>
            <title>${escapeXml(post.title)}</title>
            <link>${url}</link>
            <guid isPermaLink="true">${url}</guid>
            <pubDate>${toRfc822(post.date)}</pubDate>
            <description>${escapeXml(post.description)}</description>
        </item>`;
        })
        .join("\n");

    const lastBuildDate = posts
        .map((post) => post.updated ?? post.date)
        .sort()
        .at(-1);

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>${escapeXml(`${SITE_NAME}'s Blog`)}</title>
        <link>${SITE_URL}/blog</link>
        <description>${escapeXml(FEED_DESCRIPTION)}</description>
        <language>en-us</language>
        <atom:link href="${SITE_URL}${RSS_PATH}" rel="self" type="application/rss+xml" />${
            lastBuildDate
                ? `\n        <lastBuildDate>${toRfc822(lastBuildDate)}</lastBuildDate>`
                : ""
        }
${items}
    </channel>
</rss>
`;

    return new Response(feed, {
        headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
    });
}
