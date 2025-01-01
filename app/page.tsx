import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getTechStack } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import WeatherCard, { WeatherSkeleton } from "@/components/weather";

export default function Home() {
    const techStack = getTechStack();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-6">Ethan Glenn</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">
                        Software Engineer
                    </h2>
                    <p className="mb-4">
                        Web Developer for BYU-Idaho and Computer Science
                        student.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div>
                    <h2 className="text-2xl font-semibold mb-6">
                        My Tech Stack
                    </h2>
                    <div className="flex flex-row flex-wrap gap-4">
                        {techStack.map((tech) => (
                            <Card
                                key={tech.name}
                                className="flex flex-col items-center justify-center p-4 w-28"
                            >
                                <CardContent className="text-center flex flex-col items-center justify-center">
                                    <tech.icon />
                                    <h3 className="text-sm font-medium">
                                        {tech.name}
                                    </h3>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
                <div>
                    <Suspense fallback={<WeatherSkeleton />}>
                        <WeatherCard />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
