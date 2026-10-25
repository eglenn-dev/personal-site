import {
    PythonIcon,
    TypeScriptIcon,
    ReactIcon,
    PostgresIcon,
    MongoIcon,
    NextjsIcon,
    PrismaIcon,
    TanstackIcon,
    FastApiIcon,
    GcpIcon,
    AwsIcon,
    ClaudeIcon,
} from "./icons";
import type { Project, Experience, TechStack } from "./types";

export function getProjects(): Project[] {
    return [
        {
            name: "Legrande Health Web App",
            description:
                "Full-stack health services web application supporting practices and fulfillment centers, built through DataThink.",
            technologies: ["TypeScript", "React", "Python"],
            link: "https://legrandehealth.com",
        },
        {
            name: "Ember Health AI Companion",
            description:
                "Full-stack AI chat app with custom tools to help cancer patients and their families through their care journey, built through DataThink.",
            technologies: [
                "TypeScript",
                "React",
                "TanStack Start",
                "PostgreSQL",
            ],
            link: "https://emberhealth.ai",
        },
        {
            name: "KeepHours",
            description:
                "Time tracking, invoicing, and expense management for contractors, developed at DataThink. Includes a PWA mode and an MCP server for agent access.",
            technologies: [
                "TypeScript",
                "React",
                "TanStack Start",
                "Prisma",
                "PostgreSQL",
            ],
            link: "https://keephours.com",
        },
        {
            name: "Gospel Help",
            description:
                "Build a API that allows users to search over 137,000 indexed historical records using natural language queries, and built a very nice frontend to facilitate study and research.",
            technologies: [
                "Python",
                "Sentence Transformers",
                "FastAPI",
                "React",
            ],
            link: "https://gospel.help",
        },
        {
            name: "I-Hack Winner 2025",
            description:
                "My team placed first in the 'Human Progress' category at the BYU-Idaho 2025 hackathon. We created a full-stack mock interview platform called 'Olin'. ",
            technologies: [
                "Next.js",
                "TypeScript",
                "Tailwind",
                "MongoDB",
                "Google Gemini",
            ],
            article: "/blog/i-hack-25",
        },
        {
            name: "Resumly.pro",
            description:
                "A full stack web app the generates resumes based on a user provided job posting URL. Custom Python backend scraps important data from the job posting, and Gemini API is used to generate a tailored resume.",
            technologies: [
                "Python",
                "TypeScript",
                "React",
                "MongoDB",
                "Docker",
            ],
            link: "https://resumly.pro/",
            article: "/blog/resumly",
        },
        {
            name: "I-Hack Winner 2024",
            description:
                "Placed first in the 'Integrity & Might' category at the BYU-Idaho 2024 hackathon. My team created a full-stack community watch platform with custom user authentication, post management, and AI integration.",
            technologies: ["React", "TypeScript", "Next.js", "Firebase"],
            article:
                "https://www.linkedin.com/posts/eglenn-dev_mlh-hackathon-byui-activity-7253968115519127552-uleA/?utm_source=share&utm_medium=member_desktop",
        },
        {
            name: "Git Rewind",
            description:
                "A web application that provides users with a summary of their GitHub activity over the past year, including contributions, daily streaks, and more.",
            technologies: [
                "React",
                "TypeScript",
                "Next.js",
                "GraphQL",
                "GitHub API",
            ],
            link: "https://git-rewind.com/",
            article: "/blog/git-rewind",
        },
    ];
}

export function getExperiences(): Experience[] {
    return [
        {
            role: "Full-Stack Engineer",
            company: "DataThink",
            period: "Dec 2025 - Present",
            skills: [
                "React",
                "TypeScript",
                "Python",
                "FastAPI",
                "PostgreSQL",
                "Next.js",
                "GCP",
            ],
            responsibilities: [
                "Built and maintained a high-volume order management platform for a network of medical practices, including custom ecommerce and shipment fulfillment workflows for each practice. (React, Python, FastAPI, Postgres)",
                "Designed and shipped an in-platform telephony system letting practices call and text patients and partners directly, with HIPAA/PCI-compliant encrypted call recordings, call transferring, a custom call routing algorithm, and analytics for managing patient relationships.",
                "Developed an internal contractor management tool for time tracking, invoicing, and client tracking, giving leadership clear visibility into contractor performance across the company. (Next.js, Postgres, GCP)",
                "Used AI coding agents (Claude Code, Codex) daily to accelerate feature delivery while maintaining a high standard of code quality.",
            ],
        },
        {
            role: "Software Engineer Intern",
            company: "DataThink",
            period: "Aug 2025 - Dec 2025",
            skills: ["React", "TypeScript", "Python", "FastAPI", "PostgreSQL"],
            responsibilities: [
                "Triaged incoming bug reports and support tickets, diagnosing issues and resolving or routing them to keep the platform running smoothly.",
                "Designed and implemented an extension to the inventory management system to support new tracking and fulfillment workflows.",
                "Validated changes with unit and end-to-end testing, deploying to production multiple times per week.",
            ],
        },
        {
            role: "Team Lead & Web Developer",
            company: "David O. McKay Library - BYU-Idaho",
            period: "Jul 2024 - Aug 2025",
            skills: [
                "Team Leadership",
                "Project Management",
                "React",
                "Next.js",
                "TypeScript",
            ],
            responsibilities: [
                "Led a lab supporting over 1,200 students and faculty monthly, while overseeing a team of 10+ graphic designers and 3D printer technicians.",
                "Proposed, designed, implemented, and deployed a full-stack web app in React, Next.js, and TypeScript for managing 3D print requests from library patrons, replacing a dated excel spreadsheet.",
                "Developed and maintained library websites of 30+ pages, including a new search bar experience that improved user experience for over 154,000 users in 2024.",
            ],
        },
        {
            role: "Applied Calculus Teaching Assistant",
            company: "Department of Mathematics - BYU-Idaho",
            period: "Apr 2024 - Apr 2025",
            skills: ["R", "RStudio", "Data Analysis", "Calculus", "Teaching"],
            responsibilities: [
                "Met with 6-10 students weekly to troubleshoot R code and help them implement calculus one concepts to data analysis projects.",
                "Worked with two instructors to offer grading support and tutoring to multiple sections of the course.",
            ],
        },
        {
            role: "Lab Technician & Front-End Developer",
            company: "David O. McKay Library - BYU-Idaho",
            period: "Jun 2023 - Jul 2024",
            skills: [
                "Front-End Development",
                "3D Printing",
                "HTML",
                "CSS",
                "JavaScript",
            ],
            responsibilities: [
                "Suggested and implemented changes that reduced page load time by 0.6 seconds and reduced CSS by 78% by removing unused and duplicate styles in favor of utility classes.",
                "Collaborated with a team of three to remodel the University Library website frontend by transitioning from jQuery and Bootstrap to CSS and Vanilla JS.",
            ],
        },
    ];
}

export function getTechStack(): TechStack[] {
    return [
        { name: "TypeScript", icon: TypeScriptIcon },
        { name: "Python", icon: PythonIcon },
        { name: "React", icon: ReactIcon },
        { name: "FastAPI", icon: FastApiIcon },
        { name: "Next.js", icon: NextjsIcon },
        { name: "TanStack", icon: TanstackIcon },
        { name: "Postgres", icon: PostgresIcon },
        { name: "Prisma", icon: PrismaIcon },
        { name: "MongoDB", icon: MongoIcon },
        { name: "GCP", icon: GcpIcon },
        { name: "AWS", icon: AwsIcon },
        { name: "Claude", icon: ClaudeIcon },
    ];
}
