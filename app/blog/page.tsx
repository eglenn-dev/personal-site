import { getBlogPosts } from "@/posts/blog-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const metadata = {
    title: "Blog | Ethan Glenn",
    description: "Explore my thoughts and insights on various topics.",
};

export default async function Page() {
    const posts = getBlogPosts();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-4xl font-bold tracking-tight">
                    Blog Posts
                </h1>
                <p className="text-muted-foreground text-lg">
                    Explore my thoughts and insights on various topics.
                </p>
            </div>

            <div>
                <div className="flex flex-col gap-4">
                    {posts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="text-white"
                        >
                            <Button
                                className="flex flex-row gap-2 hover:text-gray-300"
                                variant="secondary"
                            >
                                <ArrowRight className="h-8 w-8" />
                                <div>{post.title}</div>
                                <div className="hidden sm:block">{" - "}</div>
                                <div className="hidden sm:block">
                                    {post.description}
                                </div>
                                <div className="hidden sm:block">
                                    {post.date}
                                </div>
                            </Button>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
