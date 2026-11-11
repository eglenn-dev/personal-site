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
import { getRecentPosts } from "@/posts/blog-list";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatPostDate } from "@/lib/utils";
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { HomeStats, HomeStatsSkeleton } from "@/components/home-stats";
import Link from "next/link";
import Image from "next/image";

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="mb-6 flex items-center gap-3 text-xl font-bold tracking-tight">
            {children}
            <span aria-hidden className="h-px grow bg-border" />
        </h2>
    );
}

export default async function Home() {
    const techStack = getTechStack();
    const recentPosts = getRecentPosts(3);
    const latestPost = recentPosts[0];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-16">
                <div id="main" className="flex flex-col gap-5">
                    <Avatar className="size-16">
                        <AvatarImage
                            src="https://github.com/eglenn-dev.png"
                            alt="Ethan Glenn"
                        />
                        <AvatarFallback>EG</AvatarFallback>
                    </Avatar>
                    <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.02] tracking-[-0.03em]">
                        Ethan Glenn
                        <span
                            aria-hidden
                            className="ml-[0.06em] inline-block size-[0.16em] rounded-full bg-brand"
                        />
                    </h1>
                    <p className="text-lg text-muted-foreground flex flex-row items-center gap-1.5">
                        Full-Stack Engineer at{" "}
                        <a
                            href="https://datathink.dev"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline"
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
                    <p className="max-w-prose text-base leading-relaxed text-foreground/80">
                        I build full-stack web apps with TypeScript, React, and
                        Python. Lately that has meant an order management
                        platform for medical practices, an AI companion for
                        cancer patients, and KeepHours. I write here about what
                        I learn shipping them.
                    </p>
                    <div className="flex flex-row flex-wrap gap-3 mt-1">
                        <Button asChild className="group">
                            <Link href="/projects">
                                <span>My Projects</span>
                                <ArrowRight
                                    className="ml-1 transition-transform group-hover:translate-x-1"
                                    size={16}
                                />
                            </Link>
                        </Button>
                        <Button asChild variant="outline" className="group">
                            <Link href={`/blog/${latestPost.slug}`}>
                                <span>Latest Article</span>
                                <ArrowRight
                                    className="ml-1 transition-transform group-hover:translate-x-1"
                                    size={16}
                                />
                            </Link>
                        </Button>
                    </div>
                    <div className="flex flex-row gap-4 mb-4 text-muted-foreground [&>a]:transition-colors [&>a:hover]:text-primary">
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
                    <SectionHeading>Featured</SectionHeading>
                    <div className="relative overflow-hidden rounded-2xl border border-[#53a640]/40 bg-linear-to-br from-[#53a640]/40 via-[#53a640]/15 to-[#1e293b]/25 p-5 shadow-sm dark:border-[#53a640]/25 dark:from-[#53a640]/40 dark:via-[#1e293b]/70 dark:to-[#1e293b]">
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
                        <p className="text-base leading-relaxed text-zinc-800 dark:text-foreground mt-3 mb-4">
                            Time tracking, invoicing, and expenses for
                            contractors, built at DataThink. It&apos;s a PWA and
                            has an MCP server, so AI agents can log time
                            directly. We recently moved it from Next.js to
                            TanStack Start.
                        </p>
                        <div className="flex flex-row flex-wrap gap-2">
                            <Button
                                asChild
                                variant="outline"
                                className="group bg-background/70 dark:bg-background/40"
                            >
                                <a
                                    href="https://keephours.com"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span>Visit KeepHours</span>
                                    <ArrowUpRight
                                        size={16}
                                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    />
                                </a>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="group bg-background/70 dark:bg-background/40"
                            >
                                <Link href="/blog/keephours-tanstack-start">
                                    <span>Read the migration story</span>
                                    <ChevronRight
                                        size={16}
                                        className="transition-transform group-hover:translate-x-1"
                                    />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <section id="recent-writing" className="mb-16">
                <SectionHeading>Recent Writing</SectionHeading>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {recentPosts.map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group flex flex-col gap-2 rounded-xl border bg-card p-5 shadow-xs transition-colors hover:border-foreground/30"
                        >
                            <time
                                dateTime={post.date}
                                className="text-xs font-medium text-muted-foreground"
                            >
                                {formatPostDate(post.date)}
                            </time>
                            <h3 className="text-lg font-bold leading-snug tracking-tight transition-colors group-hover:text-brand">
                                {post.title}
                            </h3>
                            <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                                {post.description}
                            </p>
                        </Link>
                    ))}
                </div>
                <Link
                    href="/blog"
                    className="group mt-5 inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
                >
                    All posts
                    <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                    />
                </Link>
            </section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-12">
                <div id="tech-stack">
                    <SectionHeading>Tech Stack</SectionHeading>
                    <div className="flex flex-row flex-wrap gap-3 justify-center md:justify-start">
                        {techStack.map((tech) => (
                            <Card
                                key={tech.name}
                                className="flex flex-col items-center justify-center p-4 w-19 sm:w-20"
                            >
                                <CardContent className="text-center flex flex-col items-center justify-center p-0">
                                    <tech.icon />
                                    <h3 className="text-xs sm:text-sm font-semibold mt-1">
                                        {tech.name}
                                    </h3>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
                <div id="stats">
                    <SectionHeading>Stats</SectionHeading>
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
