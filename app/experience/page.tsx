import type { Metadata } from "next";
import { getExperiences } from "@/lib/data";
import { TimelineEntry } from "./timeline-entry";

export const metadata: Metadata = {
    title: "Experience",
    description: "My work experience as a software engineer and developer",
    openGraph: {
        title: "Experience",
        description: "My work experience as a software engineer and developer",
        url: "/experience",
        type: "website",
        images: [
            {
                url: "/og?title=Experience&description=My+work+experience+as+a+software+engineer+and+developer",
                width: 1200,
                height: 630,
                alt: "Experience | Ethan Glenn",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Experience | Ethan Glenn",
        description: "My work experience as a software engineer and developer",
        images: [
            "/og?title=Experience&description=My+work+experience+as+a+software+engineer+and+developer",
        ],
    },
    alternates: {
        canonical: "/experience",
    },
};

export default function ExperiencePage() {
    const experiences = getExperiences();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-10">
            <section className="rounded-[2rem] bg-surface px-6 sm:px-12 lg:px-20 py-16 md:py-24 max-w-5xl">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-6">
                    Experience
                </p>
                <h1 className="font-display text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] mb-6">
                    My professional
                    <br />
                    journey so far.
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                    Where I&apos;ve worked, what I&apos;ve built, and the
                    problems I&apos;ve helped solve along the way.
                </p>
            </section>

            <section className="rounded-[2rem] bg-surface p-6 sm:p-10 md:p-14">
                <div className="relative max-w-4xl mx-auto">
                    {experiences.map((experience, index) => (
                        <TimelineEntry
                            key={index}
                            experience={experience}
                            isLast={index === experiences.length - 1}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
