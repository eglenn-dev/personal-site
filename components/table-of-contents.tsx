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
        <ul className="flex flex-col gap-0.5 text-sm">
            {headings.map((heading) => (
                <li key={heading.id}>
                    <a
                        href={`#${heading.id}`}
                        className={cn(
                            "block rounded-xl px-3 py-1.5 leading-snug transition-colors duration-200",
                            heading.level === 3 && "pl-6",
                            heading.id === activeId
                                ? "bg-foreground/8 font-medium text-foreground"
                                : "text-muted-foreground hover:bg-foreground/4 hover:text-foreground",
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
        <nav
            aria-label="Table of contents"
            className="glass sticky top-20 rounded-[24px] p-3"
        >
            <p className="mb-2 px-3 pt-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                On this page
            </p>
            <div className="max-h-[calc(100vh-11rem)] overflow-y-auto">
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
        <details className="glass group mb-6 rounded-[22px] px-4 py-3">
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
