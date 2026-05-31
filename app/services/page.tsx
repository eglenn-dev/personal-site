import type { Metadata } from "next";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/contact-form";
import { getProjects } from "@/lib/data";
import { OpenIcon, TagIcon, ArticleIcon } from "@/lib/icons";
import {
    ArrowRight,
    Code2,
    Sparkles,
    Wrench,
    Zap,
    Layers,
    MessageSquare,
} from "lucide-react";
import Link from "next/link";

const DESCRIPTION =
    "Hire Ethan Glenn — a full-stack engineer building custom web apps, AI-powered features, and providing technical consulting for businesses.";

const OG_IMAGE =
    "/og?title=Services&description=" +
    encodeURIComponent(
        "Full-stack web development, AI integration, and technical consulting.",
    );

export const metadata: Metadata = {
    title: "Services",
    description: DESCRIPTION,
    openGraph: {
        title: "Services",
        description: DESCRIPTION,
        url: "/services",
        type: "website",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Services | Ethan Glenn",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Services | Ethan Glenn",
        description: DESCRIPTION,
        images: [OG_IMAGE],
    },
    alternates: {
        canonical: "/services",
    },
};

const services = [
    {
        icon: Code2,
        title: "Full-Stack Web Apps",
        description:
            "Custom web applications built end-to-end with React, Next.js, and TypeScript — from database and API design to a polished, responsive frontend.",
        points: [
            "React / Next.js & TypeScript",
            "API & database design",
            "Authentication & deployment",
        ],
    },
    {
        icon: Sparkles,
        title: "AI Integration",
        description:
            "Bring AI into your product. I add LLM-powered features — chat, search, summarization, and automation — using models like Google Gemini and Claude.",
        points: [
            "LLM features & chatbots",
            "Semantic search & RAG",
            "Workflow automation",
        ],
    },
    {
        icon: Wrench,
        title: "Consulting & Maintenance",
        description:
            "Already have a codebase? I offer technical consulting, code review, and ongoing maintenance to keep your product fast, secure, and shipping.",
        points: [
            "Code review & architecture",
            "Performance & bug fixes",
            "Ongoing support",
        ],
    },
];

const highlights = [
    {
        icon: Zap,
        title: "Ships fast",
        description:
            "Pragmatic, iterative delivery — you see working software early and often.",
    },
    {
        icon: Layers,
        title: "Modern stack",
        description:
            "Battle-tested tools (Next.js, TypeScript, Postgres) chosen to last, not to chase trends.",
    },
    {
        icon: MessageSquare,
        title: "Direct communication",
        description:
            "You work with me directly — clear updates, no account managers, no runaround.",
    },
];

export default function ServicesPage() {
    const featuredProjects = getProjects().slice(0, 3);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero */}
            <section className="max-w-3xl mb-20">
                <Badge variant="secondary" className="mb-4">
                    Available for new projects
                </Badge>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                    Web development that moves your business forward
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    I&apos;m Ethan Glenn, a full-stack engineer. I design and
                    build fast, reliable web applications — and the AI features
                    that make them stand out. Whether you&apos;re launching
                    something new or improving what you already have, I can
                    help.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="#contact">
                        <Button size="lg" className="group w-full sm:w-auto">
                            <span>Start a project</span>
                            <ArrowRight
                                className="ml-1 transition-transform group-hover:translate-x-1"
                                size={16}
                            />
                        </Button>
                    </Link>
                    <Link href="/projects">
                        <Button
                            size="lg"
                            variant="outline"
                            className="group w-full sm:w-auto"
                        >
                            <span>See my work</span>
                            <ArrowRight
                                className="ml-1 transition-transform group-hover:translate-x-1"
                                size={16}
                            />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Services */}
            <section className="mb-20">
                <h2 className="text-2xl font-semibold mb-2">What I offer</h2>
                <p className="text-muted-foreground mb-8">
                    Services tailored to where your product is today.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map((service) => (
                        <Card key={service.title} className="h-full">
                            <CardHeader>
                                <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary">
                                    <service.icon size={22} />
                                </div>
                                <CardTitle className="text-lg">
                                    {service.title}
                                </CardTitle>
                                <CardDescription className="leading-relaxed">
                                    {service.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    {service.points.map((point) => (
                                        <li
                                            key={point}
                                            className="flex items-center gap-2"
                                        >
                                            <ArrowRight
                                                size={14}
                                                className="shrink-0 text-primary"
                                            />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Why work with me */}
            <section className="mb-20">
                <h2 className="text-2xl font-semibold mb-8">
                    Why work with me
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {highlights.map((highlight) => (
                        <div key={highlight.title} className="flex gap-4">
                            <div className="shrink-0 text-primary">
                                <highlight.icon size={24} />
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">
                                    {highlight.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {highlight.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Selected work */}
            <section className="mb-20">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-2">
                    <h2 className="text-2xl font-semibold">Selected work</h2>
                    <p className="text-sm text-muted-foreground">
                        2x BYU-Idaho hackathon winner (2024 &amp; 2025)
                    </p>
                </div>
                <p className="text-muted-foreground mb-8">
                    A few of the projects I&apos;ve shipped recently.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredProjects.map((project, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <CardTitle className="text-lg text-[#0077b6] dark:text-white mb-2">
                                    {project.name}
                                </CardTitle>
                                <CardDescription className="text-black dark:text-gray-300 leading-relaxed">
                                    {project.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.technologies.map((tech) => (
                                        <Badge
                                            key={tech}
                                            variant="secondary"
                                            className="bg-[#0077b659] hover:bg-[#0077b659] dark:bg-[#172190] hover:dark:bg-[#172190]"
                                        >
                                            <span className="flex items-center gap-1">
                                                <TagIcon />
                                                <span>{tech}</span>
                                            </span>
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex flex-row gap-2 justify-end">
                                    {project.article && (
                                        <Link
                                            href={project.article}
                                            target={
                                                project.article.startsWith(
                                                    "http",
                                                )
                                                    ? "_blank"
                                                    : "_self"
                                            }
                                        >
                                            <Button variant="outline">
                                                <span>Read</span>
                                                <ArticleIcon />
                                            </Button>
                                        </Link>
                                    )}
                                    {project.link && (
                                        <Link
                                            href={project.link}
                                            target={
                                                project.link.startsWith("http")
                                                    ? "_blank"
                                                    : "_self"
                                            }
                                        >
                                            <Button variant="secondary">
                                                <span>View</span>
                                                <OpenIcon />
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <div className="mt-8">
                    <Link href="/projects">
                        <Button variant="outline" className="group">
                            <span>View all projects</span>
                            <ArrowRight
                                className="ml-1 transition-transform group-hover:translate-x-1"
                                size={16}
                            />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Contact CTA */}
            <section
                id="contact"
                className="scroll-mt-24 rounded-2xl border bg-card p-6 sm:p-10"
            >
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                        Let&apos;s build something
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        Tell me a bit about your project and what you&apos;re
                        trying to accomplish. I&apos;ll get back to you as soon
                        as possible.
                    </p>
                    <ContactForm />
                </div>
            </section>
        </div>
    );
}
