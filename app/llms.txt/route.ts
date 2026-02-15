import { getPublicPosts } from "@/posts/blog-list";
import {
    SITE_URL,
    SITE_NAME,
    SITE_DESCRIPTION,
    JOB_TITLE,
    ORGANIZATION,
    SOCIAL_LINKS,
} from "@/lib/site-config";

export function GET() {
    const posts = getPublicPosts();

    const blogEntries = posts
        .map(
            (post) =>
                `- [${post.title}](${SITE_URL}/blog/${post.slug}): ${post.description}`,
        )
        .join("\n");

    const content = `# ${SITE_NAME}

> ${SITE_DESCRIPTION}

## About

${SITE_NAME} is a ${JOB_TITLE} at ${ORGANIZATION}, specializing in building efficient, scalable web applications. He has experience leading development teams and works primarily with TypeScript, React, Python, Next.js, PostgreSQL, and FastAPI.

## Links

- Website: ${SITE_URL}
- GitHub: ${SOCIAL_LINKS.github}
- LinkedIn: ${SOCIAL_LINKS.linkedin}
- X/Twitter: ${SOCIAL_LINKS.twitter}

## Pages

- [Home](${SITE_URL}): Portfolio and overview
- [Projects](${SITE_URL}/projects): List of projects worked on and contributed to
- [Experience](${SITE_URL}/experience): Work experience as a software engineer
- [Blog](${SITE_URL}/blog): Technical blog with insights on software engineering
- [Contact](${SITE_URL}/contact): Get in touch for opportunities and collaborations

## Blog Posts

${blogEntries}
`;

    return new Response(content, {
        headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
    });
}
