export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { getTechStack } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import WeatherCard, { WeatherSkeleton } from "@/components/weather";
import GithubStats, { GithubStatsSkeleton } from "@/components/github-stats";
import { ArrowRight, FileText, ExternalLinkIcon } from "lucide-react";
import { getLatestPost } from "@/posts/blog-list";
import ProjectStatus, {
    ProjectStatusSkeleton,
} from "@/components/project-status";
import {
    GithubIcon,
    LinkedInIcon,
    ReactIcon,
    TypeScriptIcon,
    PythonIcon,
    DockerIcon,
    MongoIcon,
    BrainIcon,
} from "@/lib/icons";

export default async function Home() {
    const techStack = getTechStack();
    const latestPost = getLatestPost();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-6">Ethan Glenn</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div id="main">
                    <h2 className="text-2xl font-semibold mb-4">
                        Software Engineer
                    </h2>
                    <p className="text-base mb-4 flex flex-row items-center gap-1">
                        <span>Full-stack Developer at</span>
                        <span className="flex flex-row items-center gap-1">
                            <span className="mb-[2px]">
                                <BrainIcon />
                            </span>{" "}
                            DataThink
                        </span>
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
                            <Button className="group">
                                <span>My Projects</span>
                                <ArrowRight
                                    className="ml-1 transition-transform group-hover:translate-x-1"
                                    size={16}
                                />
                            </Button>
                        </Link>
                        <Link href={`/blog/${latestPost.slug}`}>
                            <Button variant="outline" className="group">
                                <span>Latest Blog Post</span>
                                <ArrowRight
                                    className="ml-1 transition-transform group-hover:translate-x-1"
                                    size={16}
                                />
                            </Button>
                        </Link>
                    </div>
                </div>
                <div id="featured-project">
                    <h2 className="text-2xl font-semibold mb-4">
                        Featured Project
                    </h2>
                    <div className="bg-zinc-200 dark:bg-muted p-4 rounded-lg">
                        <div className="flex flex-row items-center justify-between mb-2">
                            <h3 className="text-xl font-semibold flex flex-row items-center gap-2">
                                <FileText className="inline text-purple-600 dark:text-purple-400" />
                                Resumly.pro
                            </h3>
                            <div className="flex flex-row gap-2">
                                <TypeScriptIcon width={20} height={20} />
                                <ReactIcon width={20} height={20} />
                                <PythonIcon width={20} height={20} />
                                <DockerIcon width={20} height={20} />
                                <MongoIcon width={20} height={20} />
                            </div>
                        </div>
                        <p className="text-base mb-2">
                            For my senior project, I built Resumly.pro, a free
                            AI-powered resume builder. It analyzes job
                            descriptions and tailors your resume to match,
                            helping you beat the bots and stand out to
                            recruiters.
                        </p>
                        <a
                            href="https://clipit.one/eg-dev-resumly"
                            target="_blank"
                        >
                            <Button variant="outline">
                                <span>View</span>
                                <ExternalLinkIcon className="ml-1" size={16} />
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
                    <div className="flex flex-col ml-2">
                        <Suspense fallback={<GithubStatsSkeleton />}>
                            <GithubStats />
                        </Suspense>
                        <Suspense fallback={<WeatherSkeleton />}>
                            <WeatherCard />
                        </Suspense>
                        <Suspense fallback={<ProjectStatusSkeleton />}>
                            <ProjectStatus />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
