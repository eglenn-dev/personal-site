"use client";
import { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import type { Slug } from "@/posts/blog-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryState } from "nuqs";
import { ChevronRight, Search } from "lucide-react";

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
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
            <div className="mb-8">
                <h1 className="mb-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                    Blog
                </h1>
                <p className="mb-6 text-lg text-muted-foreground">
                    Insights, lessons, and discoveries from my projects and
                    interests.
                </p>
                <div className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm ?? ""}
                        ref={searchInputRef}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-11 rounded-full pl-10"
                    />
                </div>
            </div>
            {filteredPosts.length > 0 ? (
                <div className="glass divide-y divide-border overflow-hidden rounded-[28px]">
                    {filteredPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group flex items-center gap-3 px-5 py-4 transition-colors duration-200 hover:bg-foreground/4"
                        >
                            <article className="min-w-0 flex-1">
                                <div className="mb-1 flex items-baseline justify-between gap-4">
                                    <h2 className="font-semibold tracking-tight transition-colors group-hover:text-primary">
                                        {post.title}
                                    </h2>
                                    <time
                                        dateTime={post.date}
                                        className="shrink-0 text-sm text-muted-foreground"
                                    >
                                        {formatDate(post.date)}
                                    </time>
                                </div>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {post.description}
                                </p>
                            </article>
                            <ChevronRight className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="glass rounded-[28px] py-12 text-center text-muted-foreground">
                    <p>No posts found.</p>
                    <Button
                        className="mt-4"
                        variant="secondary"
                        size="sm"
                        onClick={() => setSearchTerm("")}
                    >
                        View All Posts
                    </Button>
                </div>
            )}
        </div>
    );
}
