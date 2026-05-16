import {
    GithubIcon,
    LinkedInIcon,
    BrainIcon,
    AwardIcon,
    XIcon,
} from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { getTechStack } from "@/lib/data";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Suspense } from "react";
import { HomeStats, HomeStatsSkeleton } from "@/components/home-stats";
import Link from "next/link";

export default async function Home() {
    const techStack = getTechStack();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-10">
            <section className="relative overflow-hidden rounded-[2rem] bg-surface px-6 sm:px-12 lg:px-20 py-20 md:py-32">
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background:
                            "radial-gradient(120% 80% at 80% 10%, hsl(72 100% 50% / 0.18) 0%, transparent 60%), radial-gradient(80% 60% at 0% 100%, hsl(72 100% 50% / 0.08) 0%, transparent 70%)",
                    }}
                />
                <div className="relative max-w-4xl">
                    <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-2 text-xs uppercase tracking-[0.18em] text-muted-foreground mb-8">
                        <span className="size-1.5 rounded-full bg-lime" />
                        Available for collaborations
                    </p>
                    <h1 className="font-display text-[clamp(3.25rem,9vw,8rem)] leading-[0.95] tracking-tight mb-8">
                        Building things
                        <br />
                        for the web.
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
                        I&apos;m Ethan, a full-stack engineer crafting fast,
                        reliable software. Currently building at{" "}
                        <span className="inline-flex items-center gap-1.5 text-foreground font-medium">
                            <BrainIcon />
                            DataThink
                        </span>
                        .
                    </p>
                    <div className="flex flex-wrap gap-3">
                        <Link href="/projects">
                            <Button variant="lime" size="lg" className="group">
                                <span>View my work</span>
                                <ArrowRight
                                    className="ml-1 transition-transform group-hover:translate-x-1"
                                    size={18}
                                />
                            </Button>
                        </Link>
                        <Link href="/blog/what-ai-cant-build">
                            <Button
                                variant="outline"
                                size="lg"
                                className="group"
                            >
                                <span>Featured article</span>
                                <ArrowUpRight
                                    className="ml-1 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                    size={18}
                                />
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center gap-5 mt-12 text-muted-foreground">
                        <a
                            href="https://github.com/eglenn-dev"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="GitHub Profile"
                            className="hover:text-foreground transition-colors"
                        >
                            <GithubIcon height={26} width={26} />
                        </a>
                        <a
                            href="https://www.linkedin.com/in/eglenn-dev/"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn Profile"
                            className="hover:text-foreground transition-colors"
                        >
                            <LinkedInIcon height={26} width={26} />
                        </a>
                        <a
                            href="https://x.com/eglenn_dev"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="X Profile"
                            className="hover:text-foreground transition-colors"
                        >
                            <XIcon height={26} width={26} />
                        </a>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 rounded-[2rem] bg-surface p-8 md:p-12 flex flex-col">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-6">
                        Featured
                    </p>
                    <div className="flex items-center gap-3 mb-4 text-lime">
                        <AwardIcon width={28} height={28} />
                        <span className="text-sm font-semibold">
                            2x Hackathon Winner
                        </span>
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl leading-[1] mb-4">
                        First place at the
                        <br />
                        2024 &amp; 2025 BYU-Idaho
                        <br />
                        I-Hack hackathons.
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                        Two different teams, two different categories, two
                        different problem spaces — both shipped end-to-end in a
                        weekend.
                    </p>
                    <div className="mt-auto">
                        <Link href="/blog/i-hack-25">
                            <Button variant="lime" className="group">
                                <span>Read the story</span>
                                <ArrowRight
                                    size={16}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="lg:col-span-2 rounded-[2rem] bg-surface p-8 md:p-12 flex flex-col">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-6">
                        Tech Stack
                    </p>
                    <h2 className="font-display text-3xl md:text-4xl leading-[1.05] mb-8">
                        The tools I reach for daily.
                    </h2>
                    <div className="grid grid-cols-4 gap-3 mt-auto">
                        {techStack.map((tech) => (
                            <div
                                key={tech.name}
                                className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-2xl bg-surface-2/60 border border-border/40 aspect-square"
                                title={tech.name}
                            >
                                <tech.icon />
                                <span className="text-[10px] text-muted-foreground text-center leading-tight">
                                    {tech.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="rounded-[2rem] bg-surface p-8 md:p-12">
                <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">
                            Stats
                        </p>
                        <h2 className="font-display text-3xl md:text-5xl leading-[1.05] max-w-2xl">
                            A look at what I&apos;ve been up to.
                        </h2>
                    </div>
                </div>
                <Suspense fallback={<HomeStatsSkeleton />}>
                    <HomeStats />
                </Suspense>
            </section>

            <section className="relative overflow-hidden rounded-[2rem] bg-lime text-lime-foreground p-8 md:p-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <h2 className="font-display text-4xl md:text-6xl leading-[0.95]">
                        Have a project
                        <br />
                        in mind?
                    </h2>
                    <div className="md:justify-self-end">
                        <p className="text-lg mb-6 max-w-md opacity-80">
                            Whether you want to collaborate, hire, or just say
                            hello — my inbox is open.
                        </p>
                        <Link href="/contact">
                            <Button
                                size="lg"
                                className="bg-foreground text-background hover:bg-foreground/90 group"
                            >
                                <span>Get in touch</span>
                                <ArrowRight
                                    size={18}
                                    className="ml-1 transition-transform group-hover:translate-x-1"
                                />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
