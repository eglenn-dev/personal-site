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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05] mb-3">Experience</h1>
            <p className="text-lg text-muted-foreground mb-12">
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
