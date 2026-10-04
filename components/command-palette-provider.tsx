"use client";

import { getProjects } from "@/lib/data";
import { getPublicPosts } from "@/posts/blog-list";
import { CommandPalette } from "./command-palette";
import { CommandPaletteContextProvider } from "./command-palette-provider-context";
import type { ReactNode } from "react";

export function CommandPaletteProvider({
    children,
}: {
    children?: ReactNode;
}) {
    const posts = getPublicPosts();
    const projects = getProjects();

    return (
        <CommandPaletteContextProvider>
            <CommandPalette posts={posts} projects={projects} />
            {children}
        </CommandPaletteContextProvider>
    );
}
