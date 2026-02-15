import {
    SITE_URL,
    SITE_NAME,
    SITE_DESCRIPTION,
    JOB_TITLE,
    ORGANIZATION,
    SOCIAL_LINKS,
} from "@/lib/site-config";

export function PersonJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: SITE_NAME,
        url: SITE_URL,
        jobTitle: JOB_TITLE,
        worksFor: {
            "@type": "Organization",
            name: ORGANIZATION,
        },
        sameAs: Object.values(SOCIAL_LINKS),
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
        name: SITE_NAME,
        url: SITE_URL,
        description: SITE_DESCRIPTION,
        author: {
            "@type": "Person",
            name: SITE_NAME,
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
        datePublished: `${date}T00:00:00Z`,
        dateModified: `${date}T00:00:00Z`,
        url: `${SITE_URL}/blog/${slug}`,
        author: {
            "@type": "Person",
            name: SITE_NAME,
            url: SITE_URL,
        },
        publisher: {
            "@type": "Person",
            name: SITE_NAME,
            url: SITE_URL,
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${SITE_URL}/blog/${slug}`,
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
