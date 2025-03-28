import { getSlugs } from "@/posts/blog-list";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const { default: Post } = await import(`@/posts/${slug}.mdx`);

    return (
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="mb-6 -ml-2"
                >
                    <Link href="/blog" className="flex items-center gap-1">
                        <ChevronLeft className="h-4 w-4" />
                        Back to all posts
                    </Link>
                </Button>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
                <Post />
            </div>

            <div className="mt-12 pt-8 border-t">
                <Button asChild variant="outline">
                    <Link href="/blog">
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to all posts
                    </Link>
                </Button>
            </div>
        </article>
    );
}

export function generateStaticParams() {
    const slugs = getSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

export const dynamicParams = false;

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    // Format slug to title case for display
    const formatSlugToTitle = (slug: string) => {
        return slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    return {
        title: `${formatSlugToTitle(slug)} | Ethan Glenn`,
        description: `Read ${formatSlugToTitle(slug)} by Ethan Glenn`,
    };
}
