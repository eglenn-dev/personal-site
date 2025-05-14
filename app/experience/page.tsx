import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
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
