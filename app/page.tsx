import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getTechStack } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
    const techStack = getTechStack();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-6">Welcome to My Portfolio</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">About Me</h2>
                    <p className="mb-4">
                        Hi, I&#39;m [Your Name], a passionate software engineer
                        with expertise in web development, cloud technologies,
                        and machine learning. I love building scalable and
                        efficient solutions to complex problems.
                    </p>
                    <Button asChild>
                        <Link href="/experience">View My Experience</Link>
                    </Button>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4">
                        Featured Project
                    </h2>
                    <div className="bg-muted p-4 rounded-lg">
                        <h3 className="text-xl font-medium mb-2">
                            Project Name
                        </h3>
                        <p className="mb-4">
                            A brief description of your featured project and its
                            key features.
                        </p>
                        <Button variant="outline" asChild>
                            <Link href="/projects">View All Projects</Link>
                        </Button>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-6">My Tech Stack</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                    {techStack.map((tech) => (
                        <Card
                            key={tech.name}
                            className="flex flex-col items-center justify-center p-4"
                        >
                            <CardContent className="text-center flex flex-col items-center justify-center">
                                <tech.icon className="h-8 w-8 mb-2" />
                                <h3 className="text-sm font-medium">
                                    {tech.name}
                                </h3>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
