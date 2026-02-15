import { getPublicPosts } from "@/posts/blog-list";

export function GET() {
    const posts = getPublicPosts();

    const blogEntries = posts
        .map(
            (post) =>
                `- [${post.title}](https://ethanglenn.dev/blog/${post.slug}): ${post.description}`,
        )
        .join("\n");

    const content = `# Ethan Glenn

> Full Stack Engineer specializing in TypeScript, React, and Python

## About

Ethan Glenn is a Full Stack Engineer at DataThink, specializing in building efficient, scalable web applications. He has experience leading development teams and works primarily with TypeScript, React, Python, Next.js, PostgreSQL, and FastAPI.

## Links

- Website: https://ethanglenn.dev
- GitHub: https://github.com/eglenn-dev
- LinkedIn: https://www.linkedin.com/in/eglenn-dev/
- X/Twitter: https://x.com/eglenn_dev

## Pages

- [Home](https://ethanglenn.dev): Portfolio and overview
- [Projects](https://ethanglenn.dev/projects): List of projects worked on and contributed to
- [Experience](https://ethanglenn.dev/experience): Work experience as a software engineer
- [Blog](https://ethanglenn.dev/blog): Technical blog with insights on software engineering
- [Contact](https://ethanglenn.dev/contact): Get in touch for opportunities and collaborations

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
