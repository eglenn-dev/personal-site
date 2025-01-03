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
            name: "I-Hack Winner",
            description:
                "Placed first in the 'Integrity & Might' category at the BYU-Idaho 2024 hackathon. We created a full-stack community watch platform with user authentication, and post management.",
            technologies: ["React", "TypeScript", "Next.js", "Firebase"],
            link: "https://www.linkedin.com/posts/eglenn-dev_mlh-hackathon-byui-activity-7253968115519127552-uleA?utm_source=share&utm_medium=member_desktop",
        },
        {
            id: 2,
            name: "3D Print Request System",
            description:
                "A fully custom web application for managing 3D print request from students at BYU-Idaho to the school's print lab. Created a front-end application, and a REST API running on a Node.js server.",
            technologies: ["React", "TypeScript", "Next.js", "Firebase"],
            link: "https://print-backend.onrender.com",
        },
        {
            id: 3,
            name: "AI Summarizer API",
            description:
                "Created an API in Python that uses Python to scrape websites and PDF documents, then it summarizes the content using Google's Gemini AI model and streams it back to the client.",
            technologies: ["Python", "Gemini API", "HTML & CSS"],
            link: "https://eglenn.app/ai",
        },
        {
            id: 4,
            name: "Projects.now",
            description:
                "Created a platform for students to showcase their projects and get feedback from other students. The platform is built with Next.js and Firebase.",
            technologies: ["React", "TypeScript", "Next.js", "Firebase"],
            link: "https://projects.now/",
        },
        {
            id: 5,
            name: "This Portfolio",
            description:
                "My personal portfolio website built with React and Tailwind CSS.",
            technologies: ["React", "Tailwind CSS", "TypeScript"],
            link: "https://eglenn.dev/",
        },
    ];
}

export function getExperiences(): Experience[] {
    return [
        {
            id: 1,
            role: "Team Lead & Web Developer",
            company: "Brigham Young University - Idaho",
            period: "July 2024 - Present",
            responsibilities: [""],
        },
        {
            id: 2,
            role: "Teaching Assistant",
            company: "Department of Mathematics, BYU-Idaho",
            period: "Apr 2024 - Present",
            responsibilities: [""],
        },
        {
            id: 3,
            role: "Front-End Developer",
            company: "Brigham Young University - Idaho",
            period: "June 2023 - July 2024",
            responsibilities: [""],
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
