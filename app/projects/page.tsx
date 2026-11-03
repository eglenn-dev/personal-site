import type { Metadata } from "next";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { getProjects } from "@/lib/data";
import { OpenIcon, ArticleIcon, techIcons } from "@/lib/icons";
import { Button } from "@/components/ui/button";
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

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-10">My Projects</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((project, index) => (
                    <Card
                        key={index}
                        className="transition-colors duration-150 hover:border-foreground/25"
                    >
                        <CardHeader>
                            <CardTitle className="text-xl font-bold mb-1">
                                {project.name}
                            </CardTitle>
                            <CardDescription className="text-foreground/80 leading-relaxed">
                                {project.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.technologies.map((tech) => {
                                    const Icon = techIcons[tech];
                                    return (
                                        <div
                                            key={tech}
                                            role="img"
                                            aria-label={tech}
                                            title={tech}
                                        >
                                            <Icon width={20} height={20} />
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex flex-row gap-2 justify-end">
                                {project.article && (
                                    <Link
                                        href={project.article}
                                        target={
                                            project.article.startsWith("http")
                                                ? "_blank"
                                                : "_self"
                                        }
                                    >
                                        <Button variant="outline">
                                            <span>Read</span>
                                            <ArticleIcon />
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
                                        <Button variant="secondary">
                                            <span>More</span>
                                            <OpenIcon />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
