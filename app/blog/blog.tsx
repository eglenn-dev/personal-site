"use client";
import { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import type { Slug } from "@/posts/blog-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useQueryState } from "nuqs";
import { formatPostDate } from "@/lib/utils";

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
            const target = event.target as HTMLElement | null;
            const isTyping =
                target?.isContentEditable ||
                ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "");
            if (
                event.key === "/" &&
                !isTyping &&
                !event.metaKey &&
                !event.ctrlKey &&
                !event.altKey
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="mb-10 text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-3">Blog</h1>
                <p className="text-lg text-muted-foreground mb-8">
                    Insights, lessons, and discoveries from my projects and
                    interests.
                </p>
                <div className="relative text-left">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        aria-label="Search posts"
                        placeholder="Search posts..."
                        value={searchTerm ?? ""}
                        ref={searchInputRef}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-10 pl-9"
                    />
                </div>
            </div>
            <div className="divide-y divide-border border-t">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group block py-5"
                        >
                            <article>
                                <div className="flex items-baseline justify-between gap-4 mb-1">
                                    <h2 className="text-lg font-bold tracking-tight group-hover:text-brand transition-colors">
                                        {post.title}
                                    </h2>
                                    <time
                                        dateTime={post.date}
                                        className="text-sm text-muted-foreground shrink-0"
                                    >
                                        {formatPostDate(post.date)}
                                    </time>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {post.description}
                                </p>
                            </article>
                        </Link>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-12">
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
        </div>
    );
}
