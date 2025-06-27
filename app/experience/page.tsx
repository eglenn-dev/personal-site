import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TagIcon } from "lucide-react";
import { getExperiences } from "@/lib/data";

export const metadata = {
    title: "Experience | Ethan Glenn",
    description: "My work experience as a software engineer and developer",
};

export default function ExperiencePage() {
    const experiences = getExperiences();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-6">Work Experience</h1>
            <div className="space-y-6">
                {experiences.map((experience) => (
                    <Card key={experience.id}>
                        <CardHeader>
                            <CardTitle className="text-lg text-[#0077b6] dark:text-white">
                                {experience.role}
                            </CardTitle>
                            <CardDescription className="flex flex-col sm:flex-row sm:gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <span>{experience.company}</span>
                                <span className="hidden sm:inline-block">
                                    |
                                </span>
                                <span>{experience.period}</span>
                            </CardDescription>
                            <div className="flex flex-wrap gap-2 pt-2 mb-2">
                                {experience.skills.map((skill, index) => (
                                    <Badge
                                        key={`${index}-${skill}`}
                                        variant="secondary"
                                        className="bg-[#0077b659] hover:bg-[#0077b659] dark:bg-[#172190] hover:dark:bg-[#172190]"
                                    >
                                        <span className="flex items-center gap-1">
                                            <TagIcon className="w-3 h-3" />
                                            <span className="text-xs">
                                                {skill}
                                            </span>
                                        </span>
                                    </Badge>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2">
                                {experience.responsibilities.map(
                                    (responsibility, index) => (
                                        <li key={index}>{responsibility}</li>
                                    )
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
