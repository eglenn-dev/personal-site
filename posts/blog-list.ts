import type { MDXContent } from "mdx/types";
import KeepHoursTanStackStart from "./keephours-tanstack-start.mdx";
import ReadingList from "./reading-list.mdx";
import WhatAiCantBuild from "./what-ai-cant-build.mdx";
import Agents from "./agents.mdx";
import Review2025 from "./2025-review.mdx";
import IHack25 from "./i-hack-25.mdx";
import PrDashboard from "./pr-dashboard.mdx";
import LegrandeHealth from "./legrande-health.mdx";
import GitRewind from "./git-rewind.mdx";
import BibleSearch from "./bible-search.mdx";
import MyStack from "./my-stack.mdx";
import McKayDbSearch from "./mckay-db-search.mdx";
import GeminiTicTacToe from "./gemini-tic-tac-toe.mdx";
import Resumly from "./resumly.mdx";
import PromptEngineeringResumly from "./prompt-engineering-resumly.mdx";
import ResumlyLaunch from "./resumly-launch.mdx";
import ImplementingWebScraping from "./implementing-web-scraping.mdx";
import SeniorProjectUpdate from "./senior-project-update.mdx";
import MarkNoteUpdate from "./marknote-update.mdx";
import PrintQueue3d from "./3d-print-queue.mdx";
import MarkNoteLaunch from "./marknote-launch.mdx";

const posts: (Slug & { Component: MDXContent })[] = [
    {
        slug: "keephours-tanstack-start",
        Component: KeepHoursTanStackStart,
        title: "Moving KeepHours from Next.js to TanStack Start",
        description:
            "How we migrated KeepHours from Next.js to TanStack Start and oRPC, and what it did for build times and cold starts.",
        date: "2026-10-25",
        hidden: false,
    },
    {
        slug: "reading-list",
        Component: ReadingList,
        title: "Reading List",
        description:
            "My reading list of articles, books, and papers related to software engineering.",
        date: "2026-05-13",
        updated: "2026-08-21",
        hidden: false,
    },
    {
        slug: "what-ai-cant-build",
        Component: WhatAiCantBuild,
        title: "What AI Can't Build",
        description:
            "AI is making code cheap, but figuring out what to build and why is still a human problem. The engineers who thrive will be the ones who solve business problems, not just write code.",
        date: "2026-02-13",
        hidden: false,
    },
    {
        slug: "agents",
        Component: Agents,
        title: "My Agents.md",
        description: "What my Agents.md file looks like.",
        date: "2026-01-15",
        hidden: false,
    },
    {
        slug: "2025-review",
        Component: Review2025,
        title: "A Year in Review: 2025",
        description:
            "If I had to summarize 2025 in three words: build, ship, repeat.",
        date: "2025-12-23",
        hidden: false,
    },
    {
        slug: "i-hack-25",
        Component: IHack25,
        title: "Building Olin",
        description:
            "How my team won first place with an AI-powered mock interviewer.",
        date: "2025-10-27",
        hidden: false,
    },
    {
        slug: "pr-dashboard",
        Component: PrDashboard,
        title: "Pull Request Dashboard",
        description:
            "A dashboard to track assigned pull requests to users and teams on a specific GitHub repository.",
        date: "2025-10-06",
        hidden: true,
    },
    {
        slug: "legrande-health",
        Component: LegrandeHealth,
        title: "Legrande Health Web App",
        description:
            "A web application for Legrande Health, an order management platform for medical practices and suppliers.",
        date: "2025-09-09",
        hidden: false,
    },
    {
        slug: "git-rewind",
        Component: GitRewind,
        title: "Git Rewind",
        description:
            "A web application that provides users with a summary of their GitHub activity over the past year, including contributions, daily streaks, and more.",
        date: "2025-08-14",
        hidden: true,
    },
    {
        slug: "bible-search",
        Component: BibleSearch,
        title: "Bible Semantic Search Engine",
        description:
            "Building a semantic search engine for the Bible to search it easily, and with natural language.",
        date: "2025-07-28",
        hidden: false,
    },
    {
        slug: "my-stack",
        Component: MyStack,
        title: "My Stack",
        description: "A list of the tools I use to build my projects.",
        date: "2025-07-25",
        hidden: false,
    },
    {
        slug: "mckay-db-search",
        Component: McKayDbSearch,
        title: "McKay Library AI Database Search",
        description:
            "Building a database search tool for the McKay Library using AI.",
        date: "2025-07-21",
        hidden: true,
    },
    {
        slug: "gemini-tic-tac-toe",
        Component: GeminiTicTacToe,
        title: "Vibe Coding with Gemini",
        description:
            "Building Tic Tac Toe with The Gemini CLI, and analyzing the results.",
        date: "2025-07-16",
        hidden: false,
    },
    {
        slug: "resumly",
        Component: Resumly,
        title: "Resumly.pro Blog Posts",
        description: "Compilation of blog posts related to Resumly.pro",
        date: "2025-07-14",
        hidden: true,
    },
    {
        slug: "prompt-engineering-resumly",
        Component: PromptEngineeringResumly,
        title: "Prompt Engineering",
        description: "What I learned building Resumly.pro",
        date: "2025-07-10",
        hidden: false,
    },
    {
        slug: "resumly-launch",
        Component: ResumlyLaunch,
        title: "My Senior Project",
        description:
            "How I Built an AI to Help You Escape the Resume Black Hole",
        date: "2025-06-10",
        hidden: false,
    },
    {
        slug: "implementing-web-scraping",
        Component: ImplementingWebScraping,
        title: "Implementing Web Scraping: Senior Project Update",
        description: "A deep dive into the challenges of web scraping.",
        date: "2025-05-22",
        hidden: false,
    },
    {
        slug: "senior-project-update",
        Component: SeniorProjectUpdate,
        title: "Senior Project Update",
        description: "An AI-Powered Resume Assistant",
        date: "2025-05-05",
        hidden: false,
    },
    {
        slug: "marknote-update",
        Component: MarkNoteUpdate,
        title: "MarkNote.one Update",
        description: "Things just keep getting better!",
        date: "2025-02-29",
        hidden: true,
    },
    {
        slug: "3d-print-queue",
        Component: PrintQueue3d,
        title: "3D Print Queue",
        description: "Created for the BYU-Idaho David O. McKay McKay Library",
        date: "2025-02-13",
        hidden: true,
    },
    {
        slug: "marknote-launch",
        Component: MarkNoteLaunch,
        title: "Simple Markdown Note Taking",
        description: "MarkNote.one is live!",
        date: "2025-01-28",
        hidden: true,
    },
];

// Client components receive these as props, so the MDX component is left out.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const slugs: Slug[] = posts.map(({ Component, ...slug }) => slug);

export interface Slug {
    slug: string;
    title: string;
    date: string;
    updated?: string;
    description: string;
    hidden: boolean;
}

export function getAllSlugs(): string[] {
    return slugs.map(({ slug }) => slug);
}

export function getPublicSlugs(): string[] {
    return slugs.filter((slug) => !slug.hidden).map(({ slug }) => slug);
}

export function getPost(slug: string) {
    return posts.find((post) => post.slug === slug);
}

export function getAllPosts(): Slug[] {
    return slugs;
}

export function getPublicPosts(): Slug[] {
    const publicPosts = slugs.filter((slug) => !slug.hidden);
    return publicPosts;
}

export function getLatestPost(): Slug {
    const publicPosts = slugs.filter((slug) => !slug.hidden);
    return publicPosts[0];
}
