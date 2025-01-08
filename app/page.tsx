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
                            I-Hack 1<sup>st</sup> Place Winner
                        </h3>
                        <p className="mb-4">
                            Placed first in the &#39;Integrity & Might&#39;
                            category at the BYU-Idaho 2024 hackathon. My team
                            created a full-stack community watch platform with
                            custom user authentication, post management, and AI
                            integration.
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
