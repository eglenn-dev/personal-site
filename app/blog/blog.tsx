"use client";
import { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import type { Slug } from "@/posts/blog-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQueryState } from "nuqs";

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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Blog</h1>
                <p className="text-muted-foreground mb-6">
                    Insights, lessons, and discoveries from my projects and
                    interests.
                </p>
                <Input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm ?? ""}
                    ref={searchInputRef}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="divide-y divide-border">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group block py-5 first:pt-0"
                        >
                            <article>
                                <div className="flex items-baseline justify-between gap-4 mb-1">
                                    <h2 className="font-medium group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h2>
                                    <time
                                        dateTime={post.date}
                                        className="text-sm text-muted-foreground shrink-0"
                                    >
                                        {formatDate(post.date)}
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
