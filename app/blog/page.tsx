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
        images: [
            {
                url: "/og?title=Blog&description=Insights%2C+lessons%2C+and+discoveries+from+my+projects+and+interests.",
                width: 1200,
                height: 630,
                alt: "Blog | Ethan Glenn",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog | Ethan Glenn",
        description:
            "Insights, lessons, and discoveries from my projects and interests.",
        images: [
            "/og?title=Blog&description=Insights%2C+lessons%2C+and+discoveries+from+my+projects+and+interests.",
        ],
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
