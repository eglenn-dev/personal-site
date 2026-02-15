export function PersonJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Ethan Glenn",
        url: "https://ethanglenn.dev",
        jobTitle: "Full Stack Engineer",
        worksFor: {
            "@type": "Organization",
            name: "DataThink",
        },
        sameAs: [
            "https://github.com/eglenn-dev",
            "https://www.linkedin.com/in/eglenn-dev/",
            "https://x.com/eglenn_dev",
        ],
        knowsAbout: [
            "TypeScript",
            "React",
            "Python",
            "Next.js",
            "PostgreSQL",
            "MongoDB",
            "FastAPI",
            "Tailwind CSS",
            "Full Stack Development",
            "Web Development",
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export function WebSiteJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Ethan Glenn",
        url: "https://ethanglenn.dev",
        description:
            "Full Stack Engineer specializing in TypeScript, React, and Python. I create efficient, scalable web applications and have experience leading development teams.",
        author: {
            "@type": "Person",
            name: "Ethan Glenn",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export function BlogPostingJsonLd({
    title,
    description,
    date,
    slug,
}: {
    title: string;
    description: string;
    date: string;
    slug: string;
}) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description: description,
        datePublished: date,
        dateModified: date,
        url: `https://ethanglenn.dev/blog/${slug}`,
        author: {
            "@type": "Person",
            name: "Ethan Glenn",
            url: "https://ethanglenn.dev",
        },
        publisher: {
            "@type": "Person",
            name: "Ethan Glenn",
            url: "https://ethanglenn.dev",
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://ethanglenn.dev/blog/${slug}`,
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export function BreadcrumbJsonLd({
    items,
}: {
    items: { name: string; url: string }[];
}) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
