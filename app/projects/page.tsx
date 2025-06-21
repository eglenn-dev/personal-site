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

export const metadata = {
    title: "Projects | Ethan Glenn",
    description: "List of projects I've worked on and contributed to",
};

export default function ProjectsPage() {
    const projects = getProjects();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-6">My Projects</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <Card key={project.id}>
                        <CardHeader>
                            <CardTitle className="text-lg text-[#0077b6] dark:text-white mb-2">
                                {project.name}
                            </CardTitle>
                            <CardDescription className="text-black dark:text-gray-300 leading-relaxed">
                                {project.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.technologies.map((tech) => (
                                    <Badge
                                        key={tech}
                                        variant="secondary"
                                        className="bg-[#0077b659] hover:bg-[#0077b659] dark:bg-[#172190] hover:dark:bg-[#172190]"
                                    >
                                        <span className="flex items-center gap-1">
                                            <TagIcon />
                                            <span>{tech}</span>
                                        </span>
                                    </Badge>
                                ))}
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
                                            <span>View</span>
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
