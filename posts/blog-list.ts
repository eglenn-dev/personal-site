const slugs: Slug[] = [
    {
        slug: "git-rewind",
        title: "Git Rewind",
        description:
            "A web application that provides users with a summary of their GitHub activity over the past year, including contributions, daily streaks, and more.",
        date: "2025-08-14",
        hidden: true,
    },
    {
        slug: "bible-search",
        title: "Bible Semantic Search Engine",
        description:
            "Building a semantic search engine for the Bible to search it easily, and with natural language.",
        date: "2025-07-28",
        hidden: false,
    },
    {
        slug: "my-stack",
        title: "My Stack",
        description: "A list of the tools I use to build my projects.",
        date: "2025-07-25",
        hidden: false,
    },
    {
        slug: "mckay-db-search",
        title: "McKay Library AI Database Search",
        description:
            "Building a database search tool for the McKay Library using AI.",
        date: "2025-07-21",
        hidden: true,
    },
    {
        slug: "gemini-tic-tac-toe",
        title: "Vibe Coding with Gemini",
        description:
            "Building Tic Tac Toe with The Gemini CLI, and analyzing the results.",
        date: "2025-07-16",
        hidden: false,
    },
    {
        slug: "resumly",
        title: "Resumly.pro Blog Posts",
        description: "Compilation of blog posts related to Resumly.pro",
        date: "2025-07-14",
        hidden: true,
    },
    {
        slug: "prompt-engineering-resumly",
        title: "Prompt Engineering",
        description: "What I learned building Resumly.pro",
        date: "2025-07-10",
        hidden: false,
    },
    {
        slug: "resumly-launch",
        title: "My Senior Project",
        description:
            "How I Built an AI to Help You Escape the Resume Black Hole",
        date: "2025-06-10",
        hidden: false,
    },
    {
        slug: "implementing-web-scraping",
        title: "Implementing Web Scraping: Senior Project Update",
        description: "A deep dive into the challenges of web scraping.",
        date: "2025-05-22",
        hidden: false,
    },
    {
        slug: "senior-project-update",
        title: "Senior Project Update",
        description: "An AI-Powered Resume Assistant",
        date: "2025-05-05",
        hidden: false,
    },
    {
        slug: "clipit-update",
        title: "ClipIt.one API Update",
        description: "New API features ready!",
        date: "2025-04-07",
        hidden: false,
    },
    {
        slug: "clipit-launch",
        title: "Link Shortening Made Easy",
        description: "A new easy and fast way to share links.",
        date: "2025-03-31",
        hidden: false,
    },
    {
        slug: "marknote-update",
        title: "MarkNote.one Update",
        description: "Things just keep getting better!",
        date: "2025-02-29",
        hidden: false,
    },
    {
        slug: "3d-print-queue",
        title: "3D Print Queue",
        description: "Created for the BYU-Idaho David O. McKay McKay Library",
        date: "2025-02-13",
        hidden: true,
    },
    {
        slug: "marknote-launch",
        title: "Simple Markdown Note Taking",
        description: "MarkNote.one is live!",
        date: "2025-01-28",
        hidden: false,
    },
];

export interface Slug {
    slug: string;
    title: string;
    date: string;
    description: string;
    hidden: boolean;
}

export function getAllSlugs(): string[] {
    return slugs.map(({ slug }) => slug);
}

export function getPublicSlugs(): string[] {
    return slugs.filter((slug) => !slug.hidden).map(({ slug }) => slug);
}

export function getAllPosts(): Slug[] {
    return slugs;
}

export function getPublicPosts(): Slug[] {
    const publicPosts = slugs.filter((slug) => !slug.hidden);
    return publicPosts;
}

export function getLatestPost(): Slug {
    const publicPosts = slugs.filter((slug) => !slug.hidden);
    return publicPosts[0];
}
