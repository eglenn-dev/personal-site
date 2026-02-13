import {
    PythonIcon,
    TypeScriptIcon,
    ReactIcon,
    PostgresIcon,
    MongoIcon,
    NextjsIcon,
    PrismaIcon,
    TailWindIcon,
    GitIcon,
    FastApiIcon,
    GcpIcon,
    ClaudeIcon,
} from "./icons";
import type { Project, Experience, TechStack } from "./types";

export function getProjects(): Project[] {
    return [
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
            name: "Legrande Health Web App",
            description:
                "Full-stack health services web application servicing over 100 medical practices across the mainland U.S. Built in an Agile environment with a team of seven developers.",
            technologies: [
                "TypeScript",
                "React",
                "Python",
                "FastAPI",
                "PostgreSQL",
                "Docker",
            ],
            article: "/blog/legrande-health",
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
        {
            name: "Bible Search",
            description:
                "Build a API that allows users to search the Bible using natural language queries. The API uses a vector database to store and retrieve verses based on their semantic meaning.",
            technologies: [
                "Python",
                "Sentence Transformers",
                "FAISS (vector database)",
                "FastAPI",
            ],
            article: "/blog/bible-search",
        },
        {
            name: "Pull Request Dashboard",
            description:
                "A dashboard to track contributors to a GitHub repo, and show how many pull-requests they have assigned to them, and how many they have reviewed in the last week.",
            technologies: ["Next.js", "Tailwind", "GitHub API", "shadcn/ui"],
            link: "https://pr-dash.eglenn.dev/",
            article: "/blog/pr-dashboard",
        },
        {
            name: "3D Print Request System",
            description:
                "A fully custom web application for managing 3D print request from students at BYU-Idaho to the school's print lab. Created a front-end application, and a REST API running on a Node.js server.",
            technologies: ["React", "TypeScript", "Next.js", "Firebase"],
            article: "/blog/3d-print-queue",
        },
        {
            name: "This Portfolio",
            description:
                "My personal portfolio website built with Next.js, TypeScript, and Tailwind CSS. Third party services include Vercel for serverless hosting, and Resend for email handling.",
            technologies: [
                "Next.js",
                "TypeScript",
                "Vercel",
                "Resend",
                "Tailwind",
            ],
            link: "https://github.com/eglenn-dev/personal-site",
        },
    ];
}

export function getExperiences(): Experience[] {
    return [
        {
            role: "Full-Stack Engineer",
            company: "DataThink",
            period: "August 2025 - Present",
            skills: ["React", "TypeScript", "Python", "PostgreSQL", "FastAPI"],
            responsibilities: [
                "Built and maintain an order management platform processing 200+ weekly orders for 115+ medical practices using React, Python, FastAPI, and PostgreSQL.",
                "Collaborate directly with users and stakeholders to gather requirements, resolve critical issues, and deliver features that streamline ordering, and patient management workflows.",
                "Monitor production systems in real-time, rapidly deploy fixes, and manage weekly production releases ensuring 99%+ uptime for critical healthcare operations.",
            ],
        },
        {
            role: "Team Lead & Web Developer",
            company: "David O. McKay Library - BYU-Idaho",
            period: "July 2024 - August 2025",
            skills: [
                "Team Leadership",
                "Project Management",
                "React",
                "TypeScript",
                "JavaScript",
            ],
            responsibilities: [
                "Helped supervise a lab supporting over 1,200 students and faculty monthly, while overseeing a team of 10+ graphic designers and 3D printer technicians.",
                "Proposed, designed, implemented, and deployed a full-stack web app in React, Next.js, and TypeScript for managing 3D print requests from library patrons, replacing a dated excel spreadsheet.",
                "Develop and maintain library website of 30+ pages, including a new search bar experience that improved user experience for over 154,000 users in 2024.",
            ],
        },
        {
            role: "Applied Calculus Teaching Assistant",
            company: "Department of Mathematics - BYU-Idaho",
            period: "April 2024 - April 2025",
            skills: ["R", "RStudio", "Data Analysis", "Calculus", "Teaching"],
            responsibilities: [
                "Met with 6-10 students weekly to troubleshoot R code and help them implement calculus one concepts to data analysis projects.",
                "Worked with two instructors to offer grading support and tutoring to multiple sections of the course.",
            ],
        },
        {
            role: "Lab Technician & Front-End Developer",
            company: "David O. McKay Library - BYU-Idaho",
            period: "June 2023 - July 2024",
            skills: [
                "Front-End Development",
                "3D Printing",
                "HTML",
                "CSS",
                "JavaScript",
            ],
            responsibilities: [
                "Suggested and implemented changes that would reduce page load time by 0.6 seconds and reduce CSS by 78% by removing unused and duplicate styles.",
                "Collaborated with a team of three to remodel the University Library website frontend by transitions from jQuery and Bootstrap to Vanilla JS and CSS.",
                "Taught 3D printing and introductory programming workshops twice per semester to classes of 40+ students.",
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
        { name: "Tailwind", icon: TailWindIcon },
        { name: "Git", icon: GitIcon },
        { name: "Postgres", icon: PostgresIcon },
        { name: "Prisma", icon: PrismaIcon },
        { name: "MongoDB", icon: MongoIcon },
        { name: "GCP", icon: GcpIcon },
        { name: "Claude", icon: ClaudeIcon },
    ];
}
