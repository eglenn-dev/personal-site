"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Home,
    FolderOpen,
    Briefcase,
    FileText,
    Mail,
    Moon,
    Sun,
    ExternalLink,
} from "lucide-react";
import { GithubIcon, LinkedInIcon, XIcon } from "@/lib/icons";
import type { Project } from "@/lib/types";
import type { Slug } from "@/posts/blog-list";

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/projects", label: "Projects", icon: FolderOpen },
    { href: "/experience", label: "Experience", icon: Briefcase },
    { href: "/blog", label: "Blog", icon: FileText },
    { href: "/contact", label: "Contact", icon: Mail },
];

const externalLinks = [
    {
        href: "https://github.com/eglenn-dev",
        label: "GitHub",
        icon: GithubIcon,
    },
    {
        href: "https://linkedin.com/in/eglenn-dev",
        label: "LinkedIn",
        icon: LinkedInIcon,
    },
    {
        href: "https://x.com/eglenn_dev",
        label: "X",
        icon: XIcon,
    },
];

interface CommandPaletteProps {
    posts: Slug[];
    projects: Project[];
}

export function CommandPalette({ posts, projects }: CommandPaletteProps) {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleNavigate = useCallback(
        (href: string) => {
            setOpen(false);
            router.push(href);
        },
        [router],
    );

    const handleExternalLink = useCallback((href: string) => {
        setOpen(false);
        window.open(href, "_blank", "noopener,noreferrer");
    }, []);

    const handleThemeToggle = useCallback(() => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        setOpen(false);
        toast.success(`Switched to ${newTheme} mode`);
    }, [theme, setTheme]);

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="Navigation">
                    {navItems.map((item) => (
                        <CommandItem
                            key={item.href}
                            onSelect={() => handleNavigate(item.href)}
                        >
                            <item.icon className="mr-2 h-4 w-4" />
                            <span>{item.label}</span>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Blog Posts">
                    {posts.map((post) => (
                        <CommandItem
                            key={post.slug}
                            value={`blog ${post.title} ${post.description}`}
                            onSelect={() =>
                                handleNavigate(`/blog/${post.slug}`)
                            }
                        >
                            <FileText className="mr-2 h-4 w-4 shrink-0" />
                            <div className="flex flex-col overflow-hidden">
                                <span className="truncate">{post.title}</span>
                                <span className="text-xs text-muted-foreground truncate">
                                    {post.description}
                                </span>
                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Projects">
                    {projects.map((project) => (
                        <CommandItem
                            key={project.name}
                            value={`project ${project.name} ${project.description}`}
                            onSelect={() => {
                                if (project.article) {
                                    if (project.article.startsWith("/")) {
                                        handleNavigate(project.article);
                                    } else {
                                        handleExternalLink(project.article);
                                    }
                                } else if (project.link) {
                                    handleExternalLink(project.link);
                                }
                            }}
                        >
                            <FolderOpen className="mr-2 h-4 w-4 shrink-0" />
                            <div className="flex flex-col flex-1 overflow-hidden">
                                <div className="flex items-center gap-2">
                                    <span className="truncate">
                                        {project.name}
                                    </span>
                                    {project.link &&
                                        !project.article?.startsWith("/") && (
                                            <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0" />
                                        )}
                                </div>
                                <span className="text-xs text-muted-foreground truncate">
                                    {project.description}
                                </span>
                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="Actions">
                    <CommandItem onSelect={handleThemeToggle}>
                        {theme === "dark" ? (
                            <Sun className="mr-2 h-4 w-4" />
                        ) : (
                            <Moon className="mr-2 h-4 w-4" />
                        )}
                        <span>
                            Switch to {theme === "dark" ? "Light" : "Dark"} Mode
                        </span>
                    </CommandItem>
                </CommandGroup>

                <CommandSeparator />

                <CommandGroup heading="External Links">
                    {externalLinks.map((link) => (
                        <CommandItem
                            key={link.href}
                            onSelect={() => handleExternalLink(link.href)}
                        >
                            <span className="mr-2">
                                <link.icon width={16} height={16} />
                            </span>
                            <span>{link.label}</span>
                            <ExternalLink className="ml-auto h-3 w-3 text-muted-foreground" />
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
