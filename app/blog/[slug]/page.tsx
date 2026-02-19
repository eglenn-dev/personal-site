import type { Metadata } from "next";
import { getAllSlugs, getAllPosts } from "@/posts/blog-list";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyUrlButton } from "@/components/copy-url-button";
import { TextHighlightButton } from "@/components/text-highlight-button";
import { BlogPostingJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { SITE_URL, SITE_NAME, TWITTER_HANDLE } from "@/lib/site-config";

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

    const posts = getAllPosts();
    const post = posts.find((p) => p.slug === slug);
    if (!post) {
        notFound();
    }
    const { default: Post } = await import(`@/posts/${slug}.mdx`);

    return (
        <>
            <BlogPostingJsonLd
                title={post.title}
                description={post.description}
                date={post.date}
                slug={post.slug}
            />
            <BreadcrumbJsonLd
                items={[
                    { name: "Home", url: SITE_URL },
                    { name: "Blog", url: `${SITE_URL}/blog` },
                    {
                        name: post.title,
                        url: `${SITE_URL}/blog/${post.slug}`,
                    },
                ]}
            />
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
        </>
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
}): Promise<Metadata> {
    const { slug } = await params;

    const posts = getAllPosts();
    const post = posts.find((post) => post.slug === slug);

    if (!post) {
        return {
            title: "Blog",
            description: "Ethan Glenn's blog",
        };
    }

    const postUrl = `/blog/${post.slug}`;

    return {
        title: post.title,
        description: post.description,
        authors: [{ name: SITE_NAME, url: SITE_URL }],
        openGraph: {
            type: "article",
            title: post.title,
            description: post.description,
            url: postUrl,
            siteName: SITE_NAME,
            publishedTime: post.date,
            modifiedTime: post.date,
            authors: [SITE_NAME],
        },
        twitter: {
            card: "summary",
            title: post.title,
            description: post.description,
            creator: TWITTER_HANDLE,
        },
        alternates: {
            canonical: postUrl,
        },
    };
}
