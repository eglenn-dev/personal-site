const slugs: Slug[] = [
    {
        slug: "senior-project-update",
        title: "Senior Project Update",
        description: "An AI-Powered Resume Assistant",
        date: "2025-05-05",
    },
    {
        slug: "clipit-update",
        title: "ClipIt.one API Update",
        description: "New API features ready!",
        date: "2025-04-07",
    },
    {
        slug: "clipit-launch",
        title: "Link Shortening Made Easy",
        description: "A new easy and fast way to share links.",
        date: "2025-03-31",
    },
    {
        slug: "marknote-update",
        title: "MarkNote.one Update",
        description: "Things just keep getting better!",
        date: "2025-02-29",
    },
    {
        slug: "marknote-launch",
        title: "Simple Markdown Note Taking",
        description: "MarkNote.one is live!",
        date: "2025-01-28",
    },
];

interface Slug {
    slug: string;
    title: string;
    date: string;
    description: string;
}

export function getSlugs() {
    return slugs.map(({ slug }) => slug);
}

export function getBlogPosts() {
    return slugs;
}

export function getLatestBlogPost() {
    return slugs[0];
}
