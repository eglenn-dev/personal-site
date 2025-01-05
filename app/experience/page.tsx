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
                            <CardTitle>{experience.role}</CardTitle>
                            <CardDescription>
                                {experience.company} | {experience.period}
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
