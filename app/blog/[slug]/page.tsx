import type { Metadata } from "next";
import { getAdjacentPosts, getAllSlugs, getPost } from "@/posts/blog-list";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyUrlButton } from "@/components/copy-url-button";
import { TextHighlightButton } from "@/components/text-highlight-button";
import { BlogPostingJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import {
    TableOfContents,
    MobileTableOfContents,
} from "@/components/table-of-contents";
import { PostFooter } from "@/components/post-footer";
import { getPostHeadings, getPostReadingMinutes } from "@/lib/post-headings";
import {
    SITE_URL,
    SITE_NAME,
    TWITTER_HANDLE,
    RSS_ALTERNATE,
} from "@/lib/site-config";
import { cn } from "@/lib/utils";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const post = getPost(slug);
    if (!post) {
        notFound();
    }
    const headings = getPostHeadings(slug);
    const showTableOfContents = headings.length > 1;
    const readingMinutes = getPostReadingMinutes(slug);
    const { newer, older } = getAdjacentPosts(slug);

    return (
        <>
            <BlogPostingJsonLd
                title={post.title}
                description={post.description}
                date={post.date}
                updated={post.updated}
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
            <div
                className={cn(
                    "max-w-4xl mx-auto px-4 sm:px-6 py-8",
                    showTableOfContents &&
                        "xl:max-w-6xl xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-12",
                )}
            >
                <article className="min-w-0">
                    <div className="mb-8 flex items-center justify-between">
                        <Button
                            asChild
                            variant="outline"
                            className="group mb-1 -ml-2"
                        >
                            <Link href="/blog">
                                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                                <span>Back</span>
                            </Link>
                        </Button>
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                                <Clock className="size-3.5" aria-hidden />
                                {readingMinutes} min read
                            </span>
                            <CopyUrlButton />
                        </div>
                    </div>
                    {showTableOfContents && (
                        <div className="xl:hidden">
                            <MobileTableOfContents headings={headings} />
                        </div>
                    )}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <post.Component />
                    </div>
                    <TextHighlightButton />
                    <PostFooter newer={newer} older={older} />
                </article>
                {showTableOfContents && (
                    <aside className="hidden xl:block">
                        <TableOfContents headings={headings} />
                    </aside>
                )}
            </div>
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

    const post = getPost(slug);

    if (!post) {
        return {
            title: "Blog",
            description: "Ethan Glenn's blog",
        };
    }

    const postUrl = `/blog/${post.slug}`;
    const ogImageUrl = `/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description)}`;

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
            modifiedTime: post.updated ?? post.date,
            authors: [SITE_NAME],
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            creator: TWITTER_HANDLE,
            images: [ogImageUrl],
        },
        alternates: {
            canonical: postUrl,
            types: RSS_ALTERNATE,
        },
    };
}
