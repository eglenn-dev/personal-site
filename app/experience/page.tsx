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
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
            <h1 className="mb-2 text-4xl font-semibold tracking-tight sm:text-5xl">
                Experience
            </h1>
            <p className="mb-10 text-lg text-muted-foreground">
                My professional journey as a software engineer and developer.
            </p>
            <div className="relative">
                {experiences.map((experience, index) => (
                    <TimelineEntry
                        key={index}
                        experience={experience}
                        isLast={index === experiences.length - 1}
                    />
                ))}
            </div>
        </div>
    );
}
