import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getTechStack } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import WeatherCard, { WeatherSkeleton } from "@/components/weather";
import { GithubIcon, LinkedInIcon } from "@/lib/icons";

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
                        Currently working for BYU-Idaho as a Web Developer.
                    </p>
                    <div className="flex flex-row gap-4 mb-4">
                        <a href="https://github.com/eglenn-dev" target="_blank">
                            <GithubIcon height={30} width={30} />
                        </a>
                        <a
                            href="https://linkedin.com/in/eglenn-dev"
                            target="_blank"
                        >
                            <LinkedInIcon height={30} width={30} />
                        </a>
                    </div>
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
                            MarkNote.one
                        </h3>
                        <p className="mb-4">
                            Created an online note taking app with markdown
                            support, auto-saving, and live previews. With React
                            server-side component rendering, the app is fast and
                            responsive. Built initially as a 36 hour coding
                            challenge.
                        </p>
                        <Button variant="outline" asChild>
                            <a href="https://marknote.one" target="_blank">
                                View Project
                            </a>
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
