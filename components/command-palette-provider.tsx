import { getProjects } from "@/lib/data";
import { getPublicPosts } from "@/posts/blog-list";
import { CommandPalette } from "./command-palette";

export function CommandPaletteProvider() {
    const posts = getPublicPosts();
    const projects = getProjects();

    return <CommandPalette posts={posts} projects={projects} />;
}
