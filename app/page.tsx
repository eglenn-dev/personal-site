import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getTechStack } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import WeatherCard, { WeatherSkeleton } from "@/components/weather";
import { GithubIcon, LinkedInIcon } from "@/lib/icons";
import { ArrowRight } from "lucide-react";

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
                        <a
                            href="https://github.com/eglenn-dev"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <GithubIcon height={30} width={30} />
                        </a>
                        <a
                            href="https://linkedin.com/in/eglenn-dev"
                            target="_blank"
                            rel="noreferrer"
                        >
                            <LinkedInIcon height={30} width={30} />
                        </a>
                    </div>
                    <div className="flex flex-row gap-4">
                        <Link href="/experience">
                            <Button>
                                <span>My Experience</span>
                                <ArrowRight className="ml-1" size={16} />
                            </Button>
                        </Link>
                    </div>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold mb-4">
                        Featured Project
                    </h2>
                    <div className="bg-muted p-4 rounded-lg">
                        <h3 className="text-xl font-medium mb-2">
                            {/* eslint-disable @next/next/no-img-element */}
                            <img
                                className="h-6 inline align-middle mr-2 mb-1"
                                src="./marknote.png"
                                alt="MarkNote.one logo"
                            />
                            MarkNote.one
                        </h3>
                        <p className="text-sm mb-2">
                            Created an note taking web-app with markdown
                            support, auto-saving, and live previews. With React
                            server-side component rendering, the app is fast and
                            responsive. Built initially as a 36 hour coding
                            challenge.
                        </p>
                        <a
                            href="https://clipit.one/eg-dev-marknote"
                            target="_blank"
                        >
                            <Button variant="outline">
                                <span>View Project</span>
                                <ArrowRight className="ml-1" size={16} />
                            </Button>
                        </a>
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
                                className="flex flex-col items-center justify-center p-4 w-20"
                            >
                                <CardContent className="text-center flex flex-col items-center justify-center p-0">
                                    <tech.icon />
                                    <h3 className="text-sm font-medium">
                                        {tech.name}
                                    </h3>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
                <div className="pt-0 sm:pt-8">
                    <Suspense fallback={<WeatherSkeleton />}>
                        <WeatherCard />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
