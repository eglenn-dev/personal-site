import {
    GithubIcon,
    LinkedInIcon,
    AwardIcon,
    XIcon,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { getTechStack } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import { HomeStats, HomeStatsSkeleton } from "@/components/home-stats";
import Link from "next/link";
import { GitGraph } from "@/components/git-graph";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
    const techStack = getTechStack();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div id="main" className="flex flex-col gap-4">
                    <h1 className="text-4xl font-bold">Ethan Glenn</h1>
                    <p className="text-base flex flex-row items-center gap-2 flex-wrap">
                        Full-Stack Engineer at DataThink
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                            <span className="text-yellow-500">
                                <AwardIcon width={14} height={14} />
                            </span>
                            2x 1st place, BYU-Idaho Hackathon
                        </Badge>
                    </p>
                    <div className="flex flex-row gap-4">
                        <Link href="/projects">
                            <Button className="group">
                                <span>My Projects</span>
                                <ArrowRight
                                    className="ml-1 transition-transform group-hover:translate-x-1"
                                    size={16}
                                />
                            </Button>
                        </Link>
                        <Link href={`/blog/what-ai-cant-build`}>
                            <Button variant="outline" className="group">
                                <span>Featured Article</span>
                                <ArrowRight
                                    className="ml-1 transition-transform group-hover:translate-x-1"
                                    size={16}
                                />
                            </Button>
                        </Link>
                    </div>
                    <div className="flex flex-row gap-4 mb-4">
                        <a
                            href="https://github.com/eglenn-dev"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub Profile"
                        >
                            <GithubIcon height={30} width={30} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/eglenn-dev/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn Profile"
                        >
                            <LinkedInIcon height={30} width={30} />
                        </a>
                        <a
                            href="https://x.com/eglenn_dev"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="X Profile"
                            className="mt-0.5"
                        >
                            <XIcon height={30} width={30} />
                        </a>
                    </div>
                </div>
                <div id="featured-project">
                    <h2 className="text-2xl font-semibold mb-4">Featured</h2>
                    <div className="bg-zinc-200 dark:bg-muted p-6 rounded-2xl min-h-[235px] flex flex-col">
                        <div className="flex-1 flex items-center justify-center">
                            <GitGraph />
                        </div>
                        <p className="text-sm text-muted-foreground text-center mt-4">
                            Building and merging features, just like in real development
                        </p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div id="tech-stack">
                    <h2 className="text-2xl font-semibold mb-6">
                        My Tech Stack
                    </h2>
                    <div className="flex flex-row flex-wrap gap-4 justify-center md:justify-start">
                        {techStack.map((tech) => (
                            <Card
                                key={tech.name}
                                className="flex flex-col items-center justify-center p-4 w-19 sm:w-20"
                            >
                                <CardContent className="text-center flex flex-col items-center justify-center p-0">
                                    <tech.icon />
                                    <h3 className="text-xs sm:text-sm font-medium mt-0.5">
                                        {tech.name}
                                    </h3>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
                <div id="stats">
                    <h2 className="text-2xl font-semibold mb-6">Stats</h2>
                    <div className="flex flex-col">
                        <Suspense fallback={<HomeStatsSkeleton />}>
                            <HomeStats />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
