import { getBlogPosts } from "@/posts/blog-list";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
// import { Badge } from "@/components/ui/badge";

export const metadata = {
    title: "Blog | Ethan Glenn",
    description: "Explore my thoughts and insights on various topics.",
};

export default async function Page() {
    const posts = getBlogPosts();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="space-y-4 mb-12">
                <h1 className="text-4xl font-bold tracking-tight">
                    Blog Posts
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                    Explore my thoughts and insights on various topics.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
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
                                    <h2 className="text-xl font-semibold tracking-tight group-hover:text-primary transition-colors">
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
                ))}
            </div>
        </div>
    );
}
