import type { Metadata } from "next";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProjects } from "@/lib/data";
import { OpenIcon, TagIcon, ArticleIcon } from "@/lib/icons";
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
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <h1 className="mb-8 text-4xl font-semibold tracking-tight sm:text-5xl">
                My Projects
            </h1>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project, index) => (
                    <Card key={index}>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {project.name}
                            </CardTitle>
                            <CardDescription className="text-[15px] leading-relaxed">
                                {project.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="mt-auto">
                            <div className="mb-5 flex flex-wrap gap-1.5">
                                {project.technologies.map((tech) => (
                                    <Badge key={tech}>
                                        <TagIcon />
                                        <span>{tech}</span>
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex flex-row justify-end gap-2">
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
                                            <ArticleIcon width={16} height={16} />
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
                                        <Button>
                                            <span>More</span>
                                            <OpenIcon width={16} height={16} />
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
