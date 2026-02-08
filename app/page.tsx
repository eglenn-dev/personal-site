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
import { Button } from "@/components/ui/button";
import { getTechStack } from "@/lib/data";
import { ArrowRight, FileText, ExternalLinkIcon } from "lucide-react";
import { Suspense } from "react";
import { HomeStats, HomeStatsSkeleton } from "@/components/home-stats";
import Link from "next/link";

export default async function Home() {
    const techStack = getTechStack();

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            {/* Hero */}
            <div className="mb-14 sm:mb-20">
                <div className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full mb-6">
                    <BrainIcon />
                    <span>Working at DataThink</span>
                </div>
                <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-4">
                    Ethan Glenn
                </h1>
                <p className="text-xl text-muted-foreground max-w-md mb-8">
                    Full-Stack Developer crafting web applications that solve
                    real problems.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                    <Link href="/projects">
                        <Button size="lg" className="group">
                            <span>View My Work</span>
                            <ArrowRight
                                className="ml-2 transition-transform group-hover:translate-x-1"
                                size={18}
                            />
                        </Button>
                    </Link>
                    <Link href="/blog/2025-review">
                        <Button
                            size="lg"
                            variant="outline"
                            className="group"
                        >
                            <span>Featured Article</span>
                            <ArrowRight
                                className="ml-2 transition-transform group-hover:translate-x-1"
                                size={18}
                            />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-1 ml-1">
                        <a
                            href="https://github.com/eglenn-dev"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub Profile"
                            className="p-2 rounded-full hover:bg-secondary transition-colors"
                        >
                            <GithubIcon height={22} width={22} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/eglenn-dev/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn Profile"
                            className="p-2 rounded-full hover:bg-secondary transition-colors"
                        >
                            <LinkedInIcon height={22} width={22} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                {/* Featured Project - 4 cols */}
                <div className="md:col-span-4 relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-8">
                    <div className="absolute inset-y-0 left-0 w-1 bg-purple-500" />
                    <div className="flex items-center gap-2 mb-4">
                        <FileText
                            className="text-purple-600 dark:text-purple-400"
                            size={18}
                        />
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                            Featured Project
                        </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                        Resumly.pro
                    </h2>
                    <p className="text-muted-foreground mb-6 max-w-xl leading-relaxed">
                        For my senior project, I built Resumly.pro, a free
                        AI-powered resume builder. It analyzes job descriptions
                        and tailors your resume to match, helping you beat the
                        bots and stand out to recruiters.
                    </p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <TypeScriptIcon width={22} height={22} />
                            <ReactIcon width={22} height={22} />
                            <PythonIcon width={22} height={22} />
                            <DockerIcon width={22} height={22} />
                            <MongoIcon width={22} height={22} />
                        </div>
                        <a href="https://resumly.pro/" target="_blank">
                            <Button variant="outline" size="sm">
                                <span>Visit Site</span>
                                <ExternalLinkIcon
                                    className="ml-1.5"
                                    size={14}
                                />
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Tech Stack - 2 cols */}
                <div className="md:col-span-2 rounded-2xl border bg-card p-6">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {techStack.map((tech) => (
                            <div
                                key={tech.name}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-sm font-medium"
                            >
                                <tech.icon />
                                <span>{tech.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dashboard / Stats - full width */}
                <div className="md:col-span-6 rounded-2xl border bg-card p-6">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        Dashboard
                    </span>
                    <div className="mt-4">
                        <Suspense fallback={<HomeStatsSkeleton />}>
                            <HomeStats />
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    );
}
