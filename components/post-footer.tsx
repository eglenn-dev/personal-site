import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Slug } from "@/posts/blog-list";
import { RSS_PATH } from "@/lib/site-config";
import { cn, formatPostDate } from "@/lib/utils";

function AdjacentPost({
    post,
    direction,
}: {
    post: Slug;
    direction: "older" | "newer";
}) {
    const isNewer = direction === "newer";
    return (
        <Link
            href={`/blog/${post.slug}`}
            className={cn(
                "group flex flex-col gap-1 rounded-xl border bg-card p-4 transition-colors hover:border-foreground/30",
                isNewer && "sm:col-start-2 sm:items-end sm:text-right",
            )}
        >
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                {!isNewer && (
                    <ArrowLeft
                        className="size-3.5 transition-transform group-hover:-translate-x-0.5"
                        aria-hidden
                    />
                )}
                {isNewer ? "Newer post" : "Older post"}
                {isNewer && (
                    <ArrowRight
                        className="size-3.5 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                    />
                )}
            </span>
            <span className="font-display font-bold tracking-tight transition-colors group-hover:text-brand">
                {post.title}
            </span>
            <time
                dateTime={post.date}
                className="text-xs text-muted-foreground"
            >
                {formatPostDate(post.date)}
            </time>
        </Link>
    );
}

export function PostFooter({ newer, older }: { newer?: Slug; older?: Slug }) {
    const linkClassName =
        "font-medium text-foreground underline decoration-brand/40 underline-offset-4 transition-colors hover:decoration-brand";

    return (
        <footer className="mt-14 border-t pt-8">
            {(newer || older) && (
                <nav
                    aria-label="More posts"
                    className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2"
                >
                    {older && <AdjacentPost post={older} direction="older" />}
                    {newer && <AdjacentPost post={newer} direction="newer" />}
                </nav>
            )}
            <p className="text-sm leading-relaxed text-muted-foreground">
                Thanks for reading. If you have questions or want to talk about
                something I wrote,{" "}
                <Link href="/contact" className={linkClassName}>
                    get in touch
                </Link>
                . You can also browse{" "}
                <Link href="/blog" className={linkClassName}>
                    all posts
                </Link>{" "}
                or follow along via{" "}
                <a href={RSS_PATH} className={linkClassName}>
                    RSS
                </a>
                .
            </p>
        </footer>
    );
}
