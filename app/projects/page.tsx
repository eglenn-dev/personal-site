import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProjects } from "@/lib/data";
import { TagIcon } from "@/lib/icons";

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
                            <CardTitle>{project.name}</CardTitle>
                            <CardDescription>
                                {project.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.technologies.map((tech) => (
                                    <Badge
                                        key={tech}
                                        variant="secondary"
                                        className="dark:bg-[#172190]"
                                    >
                                        <span className="flex items-center gap-1">
                                            <TagIcon />
                                            <span>{tech}</span>
                                        </span>
                                    </Badge>
                                ))}
                            </div>
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                            >
                                View Project
                            </a>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
