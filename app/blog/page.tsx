import type { Metadata } from "next";
import { getPublicPosts } from "@/posts/blog-list";
import BlogPage from "./blog";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Insights, lessons, and discoveries from my projects and interests.",
    openGraph: {
        title: "Blog",
        description:
            "Insights, lessons, and discoveries from my projects and interests.",
        url: "/blog",
        type: "website",
    },
    twitter: {
        card: "summary",
        title: "Blog | Ethan Glenn",
        description:
            "Insights, lessons, and discoveries from my projects and interests.",
    },
    alternates: {
        canonical: "/blog",
    },
};

export default async function Page() {
    const posts = getPublicPosts();
    return (
        <Suspense>
            <BlogPage posts={posts} />
        </Suspense>
    );
}
