"use client";
import { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import type { Slug } from "@/posts/blog-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryState } from "nuqs";
import { ArrowUpRight, Search } from "lucide-react";

function formatDate(dateString: string) {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

interface BlogPageProps {
    posts: Slug[];
}

export default function BlogPage({ posts }: BlogPageProps) {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useQueryState("search", {
        defaultValue: "",
        clearOnDefault: true,
    });

    const filteredPosts = useMemo(() => {
        const lowerSearchTerm = searchTerm?.toLowerCase();
        if (!lowerSearchTerm || lowerSearchTerm.length === 0) {
            return posts.filter((post) => post.hidden === false);
        }
        return posts.filter(
            (post) =>
                (post.title.toLowerCase().includes(lowerSearchTerm) ||
                    post.description.toLowerCase().includes(lowerSearchTerm) ||
                    post.slug.toLowerCase().includes(lowerSearchTerm)) &&
                post.hidden === false,
        );
    }, [posts, searchTerm]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                (event.ctrlKey && event.key === "f") ||
                (event.metaKey && event.key === "f")
            ) {
                event.preventDefault();
                searchInputRef.current?.focus();
            }
            if (event.key === "Escape") {
                searchInputRef.current?.blur();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-10">
            <section className="rounded-[2rem] bg-surface px-6 sm:px-12 lg:px-20 py-16 md:py-24 max-w-5xl">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-6">
                    Blog
                </p>
                <h1 className="font-display text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] mb-6">
                    Notes from
                    <br />
                    the workbench.
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                    Insights, lessons, and discoveries from my projects and
                    interests.
                </p>
            </section>

            <section className="rounded-[2rem] bg-surface p-6 sm:p-8 md:p-12">
                <div className="relative max-w-xl mb-10">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm ?? ""}
                        ref={searchInputRef}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 h-12 rounded-full bg-surface-2 border-border/40"
                    />
                </div>
                <div className="divide-y divide-border/40">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="group block py-6 first:pt-0 -mx-2 px-2 rounded-2xl hover:bg-surface-2 transition-colors"
                            >
                                <article className="grid grid-cols-[1fr_auto] items-baseline gap-6">
                                    <div>
                                        <h2 className="font-display text-2xl md:text-3xl leading-tight mb-2 group-hover:text-lime transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl">
                                            {post.description}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-3 shrink-0">
                                        <time
                                            dateTime={post.date}
                                            className="text-xs uppercase tracking-[0.12em] text-muted-foreground"
                                        >
                                            {formatDate(post.date)}
                                        </time>
                                        <ArrowUpRight
                                            size={20}
                                            className="text-muted-foreground transition-all group-hover:text-lime group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        />
                                    </div>
                                </article>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center text-muted-foreground py-16">
                            <p className="mb-6">No posts found.</p>
                            <Button
                                variant="lime"
                                size="sm"
                                onClick={() => setSearchTerm("")}
                            >
                                View all posts
                            </Button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
