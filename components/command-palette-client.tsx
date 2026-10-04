"use client";

import { CommandPalette } from "./command-palette";
import { CommandPaletteContextProvider } from "./command-palette-provider-context";
import type { ReactNode } from "react";
import type { Project } from "@/lib/types";
import type { Slug } from "@/posts/blog-list";

interface CommandPaletteClientProps {
    posts: Slug[];
    projects: Project[];
    children?: ReactNode;
}

export function CommandPaletteClient({
    posts,
    projects,
    children,
}: CommandPaletteClientProps) {
    return (
        <CommandPaletteContextProvider>
            <CommandPalette posts={posts} projects={projects} />
            {children}
        </CommandPaletteContextProvider>
    );
}
