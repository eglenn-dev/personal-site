"use client";
import { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OpenIcon, ArticleIcon } from "@/lib/icons";
import type { Project } from "@/lib/types";

interface ProjectsPageProps {
    projects: Project[];
}

export default function ProjectsPage({ projects }: ProjectsPageProps) {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [searchTerm, setSearchTerm] = useQueryState("search", {
        defaultValue: "",
        clearOnDefault: true,
    });

    const filteredProjects = useMemo(() => {
        const lowerSearchTerm = searchTerm?.toLowerCase();
        if (!lowerSearchTerm || lowerSearchTerm.length === 0) {
            return projects;
        }
        return projects.filter(
            (project) =>
                project.name.toLowerCase().includes(lowerSearchTerm) ||
                project.description.toLowerCase().includes(lowerSearchTerm) ||
                project.technologies.some((tech) =>
                    tech.toLowerCase().includes(lowerSearchTerm),
                ),
        );
    }, [projects, searchTerm]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                (event.ctrlKey && event.key === "f") ||
                (event.metaKey && event.key === "f")
            ) {
                event.preventDefault();
                searchInputRef.current?.focus();
            }
            if (event.key === "Escape") {
                searchInputRef.current?.blur();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
            <div className="mb-10">
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                    Projects
                </h1>
                <p className="text-muted-foreground mb-6">
                    Things I&apos;ve built, shipped, and tinkered with.
                </p>
                <Input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm ?? ""}
                    ref={searchInputRef}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="divide-y divide-border">
                {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                        <article
                            key={project.name}
                            className="py-5 first:pt-0"
                        >
                            <h2 className="font-semibold text-[#0077b6] dark:text-white mb-1">
                                {project.name}
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {project.description}
                            </p>
                            {project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {project.technologies.map((tech) => (
                                        <Badge
                                            key={tech}
                                            variant="secondary"
                                            className="bg-[#0077b659] hover:bg-[#0077b659] dark:bg-[#172190] hover:dark:bg-[#172190] text-xs"
                                        >
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                            {(project.link || project.article) && (
                                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm">
                                    {project.link && (
                                        <Link
                                            href={project.link}
                                            target={
                                                project.link.startsWith("http")
                                                    ? "_blank"
                                                    : "_self"
                                            }
                                            className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <OpenIcon />
                                            <span>View site</span>
                                        </Link>
                                    )}
                                    {project.article && (
                                        <Link
                                            href={project.article}
                                            target={
                                                project.article.startsWith(
                                                    "http",
                                                )
                                                    ? "_blank"
                                                    : "_self"
                                            }
                                            className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                                        >
                                            <ArticleIcon />
                                            <span>Read article</span>
                                        </Link>
                                    )}
                                </div>
                            )}
                        </article>
                    ))
                ) : (
                    <div className="text-center text-muted-foreground py-12">
                        <p>No projects found.</p>
                        <Button
                            className="mt-4"
                            variant="secondary"
                            size="sm"
                            onClick={() => setSearchTerm("")}
                        >
                            View All Projects
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
