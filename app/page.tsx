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
import { ArrowRight, ArrowUpRight, ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { HomeStats, HomeStatsSkeleton } from "@/components/home-stats";
import Link from "next/link";
import Image from "next/image";

const socialLinks = [
    {
        href: "https://github.com/eglenn-dev",
        label: "GitHub Profile",
        icon: <GithubIcon height={22} width={22} />,
    },
    {
        href: "https://www.linkedin.com/in/eglenn-dev/",
        label: "LinkedIn Profile",
        icon: <LinkedInIcon height={22} width={22} />,
    },
    {
        href: "https://x.com/eglenn_dev",
        label: "X Profile",
        icon: <XIcon height={20} width={20} />,
    },
];

function Hero({ latestPostSlug }: { latestPostSlug: string }) {
    return (
        <section id="main" className="flex flex-col justify-center gap-5">
            <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
                Ethan Glenn
            </h1>
            <p className="flex flex-row flex-wrap items-center gap-1.5 text-lg text-muted-foreground">
                Full-Stack Engineer at{" "}
                <a
                    href="https://datathink.dev"
                    target="_blank"
                    className="glass inline-flex items-center gap-1.5 rounded-full py-1 pr-3 pl-2 text-base font-medium text-foreground transition-[background-color,transform] duration-300 hover:bg-glass-hover active:scale-[0.97]"
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
            <div className="flex flex-row flex-wrap gap-3">
                <Link href="/projects">
                    <Button size="lg" className="group">
                        <span>My Projects</span>
                        <ArrowRight
                            className="transition-transform group-hover:translate-x-1"
                            size={16}
                        />
                    </Button>
                </Link>
                <Link href={`/blog/${latestPostSlug}`}>
                    <Button size="lg" variant="outline" className="group">
                        <span>Latest Article</span>
                        <ArrowRight
                            className="transition-transform group-hover:translate-x-1"
                            size={16}
                        />
                    </Button>
                </Link>
            </div>
            <div className="flex flex-row gap-3">
                {socialLinks.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={link.label}
                        className="glass flex size-11 items-center justify-center rounded-full transition-[background-color,transform] duration-300 hover:bg-glass-hover active:scale-95"
                    >
                        {link.icon}
                    </a>
                ))}
            </div>
        </section>
    );
}

function FeaturedProject() {
    return (
        <section id="featured-project">
            <h2 className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Featured
            </h2>
            <div className="glass rounded-[32px] p-6 sm:p-7">
                <div className="mb-4 flex flex-row items-center justify-between gap-4">
                    <h3>
                        <Image
                            src="/keephours-email-logo.png"
                            alt="KeepHours"
                            width={126}
                            height={24}
                            className="h-6 w-auto dark:brightness-0 dark:invert"
                        />
                    </h3>
                    <div className="flex flex-row gap-1.5">
                        {[TypeScriptIcon, ReactIcon, TanstackIcon, PostgresIcon].map(
                            (Icon, index) => (
                                <span
                                    key={index}
                                    className="flex size-8 items-center justify-center rounded-[10px] bg-foreground/5"
                                >
                                    <Icon width={18} height={18} />
                                </span>
                            ),
                        )}
                    </div>
                </div>
                <p className="mb-5 text-base leading-relaxed">
                    Time tracking, invoicing, and expenses for contractors,
                    built at DataThink. It&apos;s a PWA and has an MCP server,
                    so AI agents can log time directly. We recently moved it
                    from Next.js to TanStack Start.
                </p>
                <div className="flex flex-row flex-wrap gap-2">
                    <a
                        href="https://keephours.com"
                        target="_blank"
                        rel="noreferrer"
                    >
                        <Button className="group">
                            <span>Visit KeepHours</span>
                            <ArrowUpRight
                                size={16}
                                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
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
        </section>
    );
}

function TechStack() {
    const techStack = getTechStack();

    return (
        <section id="tech-stack">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">
                My Tech Stack
            </h2>
            <div className="grid grid-cols-4 gap-x-3 gap-y-5 sm:grid-cols-6 md:grid-cols-4 lg:grid-cols-6">
                {techStack.map((tech) => (
                    <div
                        key={tech.name}
                        className="flex flex-col items-center gap-2"
                    >
                        <div className="glass flex size-16 items-center justify-center rounded-[22px] sm:size-[72px]">
                            <tech.icon />
                        </div>
                        <h3 className="text-xs font-medium text-muted-foreground">
                            {tech.name}
                        </h3>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default async function Home() {
    const latestPost = getLatestPost();

    return (
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <div className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-2">
                <Hero latestPostSlug={latestPost.slug} />
                <FeaturedProject />
            </div>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                <TechStack />
                <section id="stats">
                    <h2 className="mb-6 text-2xl font-semibold tracking-tight">
                        Stats
                    </h2>
                    <Suspense fallback={<HomeStatsSkeleton />}>
                        <HomeStats />
                    </Suspense>
                </section>
            </div>
        </div>
    );
}
