import type { Metadata } from "next";
import { getProjects } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, FileText } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Projects",
    description: "List of projects I've worked on and contributed to",
    openGraph: {
        title: "Projects",
        description: "List of projects I've worked on and contributed to",
        url: "/projects",
        type: "website",
        images: [
            {
                url: "/og?title=Projects&description=List+of+projects+I've+worked+on+and+contributed+to",
                width: 1200,
                height: 630,
                alt: "Projects | Ethan Glenn",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Projects | Ethan Glenn",
        description: "List of projects I've worked on and contributed to",
        images: [
            "/og?title=Projects&description=List+of+projects+I've+worked+on+and+contributed+to",
        ],
    },
    alternates: {
        canonical: "/projects",
    },
};

export default function ProjectsPage() {
    const projects = getProjects();
    const featured = projects.slice(0, 2);
    const rest = projects.slice(2);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-10">
            <section className="rounded-[2rem] bg-surface px-6 sm:px-12 lg:px-20 py-16 md:py-24 max-w-5xl">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-6">
                    Projects
                </p>
                <h1 className="font-display text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] mb-6">
                    Things I&apos;ve
                    <br />
                    designed, built,
                    <br />
                    and shipped.
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                    A selection of products, side projects, and experiments from
                    the past few years.
                </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featured.map((project) => (
                    <article
                        key={project.name}
                        className="rounded-[2rem] bg-surface p-8 md:p-10 flex flex-col"
                    >
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-6">
                            Featured project
                        </p>
                        <h2 className="font-display text-4xl md:text-5xl leading-[1.02] mb-4">
                            {project.name}
                        </h2>
                        <p className="text-muted-foreground text-base leading-relaxed mb-6">
                            {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {project.technologies.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1 rounded-full text-xs font-medium bg-surface-2 text-muted-foreground border border-border/40"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                        <div className="mt-auto flex flex-wrap gap-2">
                            {project.article && (
                                <Link
                                    href={project.article}
                                    target={
                                        project.article.startsWith("http")
                                            ? "_blank"
                                            : "_self"
                                    }
                                >
                                    <Button variant="lime" size="sm" className="group">
                                        <span>Read</span>
                                        <ArrowRight
                                            size={14}
                                            className="transition-transform group-hover:translate-x-0.5"
                                        />
                                    </Button>
                                </Link>
                            )}
                            {project.link && (
                                <Link
                                    href={project.link}
                                    target={
                                        project.link.startsWith("http")
                                            ? "_blank"
                                            : "_self"
                                    }
                                >
                                    <Button variant="outline" size="sm" className="group">
                                        <span>Visit</span>
                                        <ArrowUpRight
                                            size={14}
                                            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </article>
                ))}
            </section>

            <section className="rounded-[2rem] bg-surface p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    {rest.map((project) => (
                        <article
                            key={project.name}
                            className="group p-6 rounded-2xl hover:bg-surface-2 transition-colors flex flex-col"
                        >
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <h3 className="font-display text-2xl md:text-3xl leading-tight">
                                    {project.name}
                                </h3>
                                <div className="flex items-center gap-1.5 mt-1 shrink-0">
                                    {project.article && (
                                        <Link
                                            href={project.article}
                                            target={
                                                project.article.startsWith("http")
                                                    ? "_blank"
                                                    : "_self"
                                            }
                                            aria-label={`Read about ${project.name}`}
                                            className="size-9 inline-flex items-center justify-center rounded-full bg-surface-2 border border-border/40 hover:bg-lime hover:text-lime-foreground transition-colors"
                                        >
                                            <FileText size={15} />
                                        </Link>
                                    )}
                                    {project.link && (
                                        <Link
                                            href={project.link}
                                            target={
                                                project.link.startsWith("http")
                                                    ? "_blank"
                                                    : "_self"
                                            }
                                            aria-label={`Visit ${project.name}`}
                                            className="size-9 inline-flex items-center justify-center rounded-full bg-surface-2 border border-border/40 hover:bg-lime hover:text-lime-foreground transition-colors"
                                        >
                                            <ArrowUpRight size={15} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-1.5 mt-auto">
                                {project.technologies.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-2 text-muted-foreground border border-border/40"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}
