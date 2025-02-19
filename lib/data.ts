import {
    PythonIcon,
    TypeScriptIcon,
    ReactIcon,
    NodeIcon,
    PostgresIcon,
    MongoIcon,
    MySqlIcon,
    NextjsIcon,
} from "./icons";

interface Project {
    id: number;
    name: string;
    description: string;
    technologies: string[];
    link: string;
}

interface Experience {
    id: number;
    role: string;
    company: string;
    period: string;
    responsibilities: string[];
}

interface TechStack {
    name: string;
    icon: React.ComponentType;
}

export function getProjects(): Project[] {
    return [
        {
            id: 1,
            name: "MarkNote.one",
            description:
                "Created an note taking web-app with markdown support, auto-saving, and live previews. With React server-side component rendering, the app is fast and responsive. Built initially as a 36 hour coding challenge.",
            technologies: [
                "React",
                "TypeScript",
                "Next.js",
                "Tailwind",
                "Firebase",
            ],
            link: "https://marknote.one/",
        },
        {
            id: 2,
            name: "I-Hack Winner",
            description:
                "Placed first in the 'Integrity & Might' category at the BYU-Idaho 2024 hackathon. My team created a full-stack community watch platform with custom user authentication, post management, and AI integration.",
            technologies: ["React", "TypeScript", "Next.js", "Firebase"],
            link: "https://www.linkedin.com/posts/eglenn-dev_mlh-hackathon-byui-activity-7253968115519127552-uleA?utm_source=share&utm_medium=member_desktop",
        },
        {
            id: 3,
            name: "AI Summarizer API",
            description:
                "Created an API in Python that uses Python to scrape websites and PDF documents, then it summarizes the content using Google's Gemini AI model and streams it back to the client.",
            technologies: ["Python", "Gemini API", "JavaScript"],
            link: "https://eglenn.app/ai",
        },
        {
            id: 4,
            name: "3D Print Request System",
            description:
                "A fully custom web application for managing 3D print request from students at BYU-Idaho to the school's print lab. Created a front-end application, and a REST API running on a Node.js server.",
            technologies: ["React", "TypeScript", "Next.js", "Firebase"],
            link: "https://github.com/eglenn-dev/3d-print-queue",
        },
        {
            id: 5,
            name: "This Portfolio",
            description:
                "My personal portfolio website built with React and Tailwind CSS.",
            technologies: ["React", "Tailwind", "TypeScript"],
            link: "https://eglenn.dev/",
        },
    ];
}

export function getExperiences(): Experience[] {
    return [
        {
            id: 1,
            role: "Lab Manager & Web Developer",
            company:
                "David O. McKay Library - Brigham Young University - Idaho",
            period: "July 2024 - Present",
            responsibilities: [
                "Managed a team of 10+ graphic designers and printer technicians, providing technical support and ensuring smooth lab operation.",
                "Developed a full-stack web app for managing 3D print requests.",
                "Developed and maintained web content for the library website.",
            ],
        },
        {
            id: 2,
            role: "Teaching Assistant",
            company:
                "Department of Mathematics - Brigham Young University - Idaho",
            period: "April 2024 - Present",
            responsibilities: [
                "Held weekly office hours to assist students with calculus and R programming.",
                "Supported students on weekly data analysis project reports.",
            ],
        },
        {
            id: 3,
            role: "Lab Technician & Front-End Developer",
            company:
                "David O. McKay Library - Brigham Young University - Idaho",
            period: "June 2023 - July 2024",
            responsibilities: [
                "Collaborated on University Library website redesign, transitioning from Bootstrap to Vanilla JS.",
                "Maintained a 3D printing maker lab.",
                "Taught quarterly 3D printing and intermediate programming workshops.",
            ],
        },
    ];
}

export function getTechStack(): TechStack[] {
    return [
        { name: "Python", icon: PythonIcon },
        { name: "TypeScript", icon: TypeScriptIcon },
        { name: "React", icon: ReactIcon },
        { name: "Node.js", icon: NodeIcon },
        { name: "Next.js", icon: NextjsIcon },
        { name: "PostgreSQL", icon: PostgresIcon },
        { name: "MongoDB", icon: MongoIcon },
        { name: "MySQL", icon: MySqlIcon },
    ];
}
