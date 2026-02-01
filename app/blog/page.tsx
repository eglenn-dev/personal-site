import { getPublicPosts } from "@/posts/blog-list";
import BlogPage from "./blog";
import { Suspense } from "react";

export const metadata = {
    title: "Blog",
    description:
        "Insights, lessons, and discoveries from my projects and interests.",
};

export default async function Page() {
    const posts = getPublicPosts();
    return (
        <Suspense>
            <BlogPage posts={posts} />
        </Suspense>
    );
}
