import { getAllSlugs, getAllPosts } from "@/posts/blog-list";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyUrlButton } from "@/components/copy-url-button";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const { default: Post } = await import(`@/posts/${slug}.mdx`);

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8 flex items-center justify-between">
                <Link href="/blog" className="group">
                    <Button variant="outline" className="mb-1 -ml-2">
                        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to all posts
                    </Button>
                </Link>
                <CopyUrlButton />
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <Post />
            </div>
            <div className="mt-12 pt-8 border-t">
                <Link href="/blog" className="group">
                    <Button variant="outline">
                        <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to all posts
                    </Button>
                </Link>
            </div>
        </article>
    );
}

export function generateStaticParams() {
    const slugs = getAllSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const posts = getAllPosts();
    const post = posts.find((post) => post.slug === slug);

    if (!post) {
        return {
            title: "Blog | Ethan Glenn",
            description: "Ethan Glenn's blog",
        };
    }

    return {
        title: `${post?.title} | Ethan Glenn`,
        description: post?.description,
    };
}
