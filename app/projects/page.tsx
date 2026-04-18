import type { Metadata } from "next";
import { Suspense } from "react";
import { getProjects } from "@/lib/data";
import ProjectsPage from "./projects";

export const metadata: Metadata = {
    title: "Projects",
    description: "List of projects I've worked on and contributed to",
    openGraph: {
        title: "Projects",
        description: "List of projects I've worked on and contributed to",
        url: "/projects",
        type: "website",
        images: [
            {
                url: "/og?title=Projects&description=List+of+projects+I've+worked+on+and+contributed+to",
                width: 1200,
                height: 630,
                alt: "Projects | Ethan Glenn",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Projects | Ethan Glenn",
        description: "List of projects I've worked on and contributed to",
        images: [
            "/og?title=Projects&description=List+of+projects+I've+worked+on+and+contributed+to",
        ],
    },
    alternates: {
        canonical: "/projects",
    },
};

export default function Page() {
    const projects = getProjects();
    return (
        <Suspense>
            <ProjectsPage projects={projects} />
        </Suspense>
    );
}
