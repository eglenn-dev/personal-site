"use client";
import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import type { PostHeading } from "@/lib/post-headings";
import { cn } from "@/lib/utils";

function HeadingLinks({
    headings,
    activeId,
}: {
    headings: PostHeading[];
    activeId?: string;
}) {
    return (
        <ul className="flex flex-col border-l text-sm">
            {headings.map((heading) => (
                <li key={heading.id}>
                    <a
                        href={`#${heading.id}`}
                        className={cn(
                            "-ml-px block border-l py-1 pl-3 leading-snug transition-colors",
                            heading.level === 3 && "pl-6",
                            heading.id === activeId
                                ? "border-foreground text-foreground"
                                : "border-transparent text-muted-foreground hover:text-foreground",
                        )}
                    >
                        {heading.text}
                    </a>
                </li>
            ))}
        </ul>
    );
}

export function TableOfContents({ headings }: { headings: PostHeading[] }) {
    const [activeId, setActiveId] = useState<string>();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntry = entries.find(
                    (entry) => entry.isIntersecting,
                );
                if (visibleEntry) setActiveId(visibleEntry.target.id);
            },
            { rootMargin: "-80px 0px -70% 0px" },
        );

        for (const heading of headings) {
            const element = document.getElementById(heading.id);
            if (element) observer.observe(element);
        }

        return () => observer.disconnect();
    }, [headings]);

    return (
        <nav aria-label="Table of contents" className="sticky top-24">
            <p className="mb-3 text-sm font-medium">On this page</p>
            <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
                <HeadingLinks headings={headings} activeId={activeId} />
            </div>
        </nav>
    );
}

export function MobileTableOfContents({
    headings,
}: {
    headings: PostHeading[];
}) {
    return (
        <details className="group mb-6 rounded-xl border px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-medium select-none [&::-webkit-details-marker]:hidden">
                <ChevronRight className="size-4 transition-transform group-open:rotate-90" />
                On this page
            </summary>
            <div className="mt-3">
                <HeadingLinks headings={headings} />
            </div>
        </details>
    );
}
