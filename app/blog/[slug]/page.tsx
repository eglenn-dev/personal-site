import { getAllSlugs, getAllPosts } from "@/posts/blog-list";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyUrlButton } from "@/components/copy-url-button";
import { TextHighlightButton } from "@/components/text-highlight-button";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const validSlugs = getAllSlugs();
    if (!validSlugs.includes(slug)) {
        notFound();
    }

    const { default: Post } = await import(`@/posts/${slug}.mdx`);

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            <div className="mb-8 flex items-center justify-between">
                <Link href="/blog" className="group">
                    <Button variant="outline" className="mb-1 -ml-2">
                        <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                        <span>Back</span>
                    </Button>
                </Link>
                <CopyUrlButton />
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none">
                <Post />
            </div>
            <TextHighlightButton />
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
            title: "Blog",
            description: "Ethan Glenn's blog",
        };
    }

    return {
        title: `${post?.title}`,
        description: post?.description,
    };
}
