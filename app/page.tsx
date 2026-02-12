import {
    GithubIcon,
    LinkedInIcon,
    ReactIcon,
    TypeScriptIcon,
    MongoIcon,
    BrainIcon,
    NextjsIcon,
    AwardIcon,
    XIcon,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { getTechStack } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { HomeStats, HomeStatsSkeleton } from "@/components/home-stats";
import Link from "next/link";

export default async function Home() {
    const techStack = getTechStack();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-6">Ethan Glenn</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div id="main">
                    <h2 className="text-2xl font-semibold mb-4">
                        Full-Stack Developer
                    </h2>
                    <p className="text-base mb-4 flex flex-row items-center gap-1">
                        <span>Working at</span>
                        <span className="flex flex-row items-center gap-1">
                            <span className="mb-[1px]">
                                <BrainIcon />
                            </span>{" "}
                            DataThink
                        </span>
                    </p>
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
                        <Link href={`/blog/ai-and-engineering`}>
                            <Button variant="outline" className="group">
                                <span>Featured Article</span>
                                <ArrowRight
                                    className="ml-1 transition-transform group-hover:translate-x-1"
                                    size={16}
                                />
                            </Button>
                        </Link>
                    </div>
                </div>
                <div id="featured-project">
                    <h2 className="text-2xl font-semibold mb-4">Featured</h2>
                    <div className="bg-zinc-200 dark:bg-muted p-4 rounded-lg">
                        <div className="flex flex-row items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold flex flex-row items-center gap-2">
                                <span className="text-yellow-500">
                                    <AwardIcon width={25} height={25} />
                                </span>
                                1st Place Hackathon Winner x2
                            </h3>
                            <div className="flex flex-row gap-2">
                                <TypeScriptIcon width={20} height={20} />
                                <ReactIcon width={20} height={20} />
                                <NextjsIcon width={20} height={20} />
                                <MongoIcon width={20} height={20} />
                            </div>
                        </div>
                        <p className="text-base mb-2">
                            I placed first at the 2024 and 2025 BYU-Idaho
                            hackathons! Two different teams, two different
                            projects, and two different solutions.
                        </p>
                        <Link href="/blog/i-hack-25">
                            <Button variant="outline" className="group">
                                <span>More </span>
                                <ChevronRight
                                    size={16}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Button>
                        </Link>
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
                                className="flex flex-col items-center justify-center p-4 w-[4.75rem] sm:w-20"
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
