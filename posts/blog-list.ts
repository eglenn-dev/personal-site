const slugs: Slug[] = [
    {
        slug: "welcome",
        title: "Welcome Post",
        description: "My first post",
        date: "2025-03-28",
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
