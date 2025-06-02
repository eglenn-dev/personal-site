export const dynamic = "force-dynamic";
import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getTechStack } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import WeatherCard, { WeatherSkeleton } from "@/components/weather";
import GithubStats, { GithubStatsSkeleton } from "@/components/github-stats";
import { GithubIcon, LinkedInIcon } from "@/lib/icons";
import { ArrowRight } from "lucide-react";
import { getLatestBlogPost } from "@/posts/blog-list";
import { FileText } from "lucide-react";

export default function Home() {
    const techStack = getTechStack();
    const latestPost = getLatestBlogPost();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-6">Ethan Glenn</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div id="main">
                    <h2 className="text-2xl font-semibold mb-4">
                        Software Engineer
                    </h2>
                    <p className="text-base mb-4">
                        Currently working for BYU-Idaho as a Web Developer.
                    </p>
                    <div className="flex flex-row gap-4 mb-4">
                        <a
                            href="https://clipit.one/eg-dev-github"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub Profile"
                        >
                            <GithubIcon height={30} width={30} />
                        </a>
                        <a
                            href="https://clipit.one/eg-dev-linkedin"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn Profile"
                        >
                            <LinkedInIcon height={30} width={30} />
                        </a>
                    </div>
                    <div className="flex flex-row gap-4">
                        <Link href="/projects">
                            <Button>
                                <span>My Projects</span>
                                <ArrowRight className="ml-1" size={16} />
                            </Button>
                        </Link>
                        <Link href={`/blog/${latestPost.slug}`}>
                            <Button variant="outline">
                                <span>Latest Blog Post</span>
                                <ArrowRight className="ml-1" size={16} />
                            </Button>
                        </Link>
                    </div>
                </div>
                <div id="featured-project">
                    <h2 className="text-2xl font-semibold mb-4">
                        Featured Project
                    </h2>
                    <div className="bg-muted p-4 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2 flex flex-row items-center gap-2">
                            <FileText className="inline text-purple-600 dark:text-purple-400" />
                            Resumly.pro{" "}
                            <span className="hidden sm:inline-block">
                                - Your Resume Assistant
                            </span>
                        </h3>
                        <p className="text-base mb-2">
                            Simplify your job applications with AI-powered
                            resume tailoring. Just provide the job posting, and
                            Resumly.pro will highlight your relevant experience
                            using the information you share. It then delivers a
                            professionally formatted resume that stands out.
                        </p>
                        <a
                            href="https://clipit.one/eg-dev-resumly"
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
                <div id="tech-stack">
                    <h2 className="text-2xl font-semibold mb-6">
                        My Tech Stack
                    </h2>
                    <Suspense fallback={<GithubStatsSkeleton />}>
                        <GithubStats />
                    </Suspense>
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
                <div id="weather" className="pt-0 sm:pt-8">
                    <Suspense fallback={<WeatherSkeleton />}>
                        <WeatherCard />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
