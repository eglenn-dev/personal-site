import { getProjects } from "@/lib/data";
import { getPublicPosts } from "@/posts/blog-list";
import { CommandPaletteClient } from "./command-palette-client";

export function CommandPaletteProvider({
    children,
}: {
    children?: React.ReactNode;
}) {
    const posts = getPublicPosts();
    const projects = getProjects();

    return (
        <CommandPaletteClient posts={posts} projects={projects}>
            {children}
        </CommandPaletteClient>
    );
}
