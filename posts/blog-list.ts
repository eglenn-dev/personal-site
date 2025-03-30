const slugs: Slug[] = [
    {
        slug: "clipit-launch",
        title: "Link Shortening Made Easy",
        description: "A new easy and fast way to share links.",
        date: "2025-04-02",
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
