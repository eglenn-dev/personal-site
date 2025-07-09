import { getPublicPosts } from "@/posts/blog-list";
import BlogPage from "./blog";

export const metadata = {
    title: "Blog | Ethan Glenn",
    description:
        "Insights, lessons, and discoveries from my projects and interests.",
};

export default async function Page() {
    const posts = getPublicPosts();
    return <BlogPage posts={posts} />;
}
