"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import type { Slug } from "@/posts/blog-list";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BlogPageProps {
    posts: Slug[];
}

export default function BlogPage({ posts }: BlogPageProps) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredPosts, setFilteredPosts] = useState<Slug[]>(posts);
    const [isFocused, setIsFocused] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        const results = posts.filter(
            (post) =>
                (post.title.toLowerCase().includes(lowerSearchTerm) ||
                    post.description.toLowerCase().includes(lowerSearchTerm) ||
                    post.slug.toLowerCase().includes(lowerSearchTerm)) &&
                post.hidden === false
        );
        setFilteredPosts(results);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-4 mb-12">
                <h1 className="text-4xl font-bold tracking-tight">
                    Blog Posts
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Insights, lessons, and discoveries from my projects and
                    interests.
                </p>
                <div
                    className={`flex flex-row items-center w-[500px] max-w-full cursor-pointer transition-all ${
                        isFocused
                            ? "border border-primary shadow-md"
                            : "border border-input"
                    } rounded-md p-1`}
                    onClick={() => searchInputRef.current?.focus()}
                >
                    <Input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        ref={searchInputRef}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none bg-transparent"
                    />
                    <span className="mr-2 text-muted-foreground hidden md:inline-block">
                        Ctrl + F
                    </span>
                </div>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group block"
                        >
                            <article className="h-full overflow-hidden rounded-lg border bg-card transition-all duration-200 hover:shadow-md">
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4" />
                                        <time dateTime={post.date}>
                                            {post.date}
                                        </time>
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-lg text-[#0077b6] dark:text-white font-semibold tracking-tight group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h2>
                                        <p className="text-muted-foreground line-clamp-2">
                                            {post.description}
                                        </p>
                                    </div>
                                    <div className="pt-2 flex justify-between items-center">
                                        <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Read more{" "}
                                            <ArrowRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center text-muted-foreground">
                        <p className="text-lg">No posts found.</p>
                        <p className="text-sm">
                            Try adjusting your search term.
                        </p>
                        <Button
                            className="mt-4"
                            variant="secondary"
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
