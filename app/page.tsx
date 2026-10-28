import {
    GithubIcon,
    LinkedInIcon,
    ReactIcon,
    TypeScriptIcon,
    TanstackIcon,
    PostgresIcon,
    XIcon,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { getTechStack } from "@/lib/data";
import { getLatestPost } from "@/posts/blog-list";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { HomeStats, HomeStatsSkeleton } from "@/components/home-stats";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
    const techStack = getTechStack();
    const latestPost = getLatestPost();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div id="main" className="flex flex-col gap-4">
                    <h1 className="text-4xl font-bold">Ethan Glenn</h1>
                    <p className="text-base flex flex-row items-center gap-1">
                        Full-Stack Engineer at{" "}
                        <a
                            href="https://datathink.dev"
                            target="_blank"
                            className="relative inline-flex items-center gap-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-current after:transition-transform hover:after:translate-y-px"
                        >
                            <Image
                                src="/datathink_logo.svg"
                                alt="DataThink Logo"
                                width={16}
                                height={16}
                                className="size-4 dark:invert"
                            />
                            DataThink
                        </a>
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
                        <Link href={`/blog/${latestPost.slug}`}>
                            <Button variant="outline" className="group">
                                <span>Latest Article</span>
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
                    <div className="bg-zinc-200 dark:bg-muted p-4 rounded-2xl">
                        <div className="flex flex-row items-center justify-between mb-2">
                            <h3>
                                <Image
                                    src="/keephours-email-logo.png"
                                    alt="KeepHours"
                                    width={126}
                                    height={24}
                                    className="h-6 w-auto dark:brightness-0 dark:invert"
                                />
                            </h3>
                            <div className="flex flex-row gap-2">
                                <TypeScriptIcon width={20} height={20} />
                                <ReactIcon width={20} height={20} />
                                <TanstackIcon width={20} height={20} />
                                <PostgresIcon width={20} height={20} />
                            </div>
                        </div>
                        <p className="text-base mb-2">
                            Time tracking, invoicing, and expenses for
                            contractors, built at DataThink. It&apos;s a PWA and
                            has an MCP server, so AI agents can log time
                            directly. We recently moved it from Next.js to
                            TanStack Start.
                        </p>
                        <div className="flex flex-row flex-wrap gap-2">
                            <a
                                href="https://keephours.com"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <Button variant="outline" className="group">
                                    <span>Visit KeepHours</span>
                                    <ArrowUpRight
                                        size={16}
                                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </Button>
                            </a>
                            <Link href="/blog/keephours-tanstack-start">
                                <Button variant="outline" className="group">
                                    <span>Read the migration story</span>
                                    <ChevronRight
                                        size={16}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </Button>
                            </Link>
                        </div>
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
