import {
    PythonIcon,
    TypeScriptIcon,
    ReactIcon,
    NodeIcon,
    PostgresIcon,
    MongoIcon,
    MySqlIcon,
    NextjsIcon,
    JavaScriptIcon,
    FirebaseIcon,
    TailWindIcon,
    GitIcon,
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
            role: "Manager & Web Developer",
            company:
                "David O. McKay Library - Brigham Young University - Idaho",
            period: "July 2024 - Present",
            responsibilities: [
                "Manage a lab supporting over 1,200 students and faculty monthly, while overseeing a team of 10+ graphic designers and 3D printer technicians.",
                "Proposed, designed, implemented, and deployed a full-stack web app in React with TypeScript for managing 3D print requests from library patrons, replacing a dated excel spreadsheet.",
                "Develop and maintain library website of 30+ pages, writing JavaScript, HTML, and CSS to enhance user experience and maintain site functionality.",
            ],
        },
        {
            id: 2,
            role: "Applied Calculus Teaching Assistant",
            company:
                "Department of Mathematics - Brigham Young University - Idaho",
            period: "April 2024 - Present",
            responsibilities: [
                "Met with 6-10 students weekly to troubleshoot R code and help them implement calculus one concepts to data analysis projects.",
                "Worked with two instructors to offer grading support and tutoring to multiple sections of the course.",
            ],
        },
        {
            id: 3,
            role: "Lab Technician & Front-End Developer",
            company:
                "David O. McKay Library - Brigham Young University - Idaho",
            period: "June 2023 - July 2024",
            responsibilities: [
                "Suggested and implemented changes that would reduce page load time by 0.6 seconds and reduce repository from 10,770 to 1382 files.",
                "Collaborated with a team of three to remodel the University Library website frontend by transitions from Bootstrap to Vanilla JS and CSS.",
                "Taught 3D printing and introductory programming workshops twice per semester to classes of 40+ students.",
            ],
        },
    ];
}

export function getTechStack(): TechStack[] {
    return [
        { name: "Python", icon: PythonIcon },
        { name: "TypeScript", icon: TypeScriptIcon },
        { name: "React", icon: ReactIcon },
        { name: "JavaScript", icon: JavaScriptIcon },
        { name: "Node.js", icon: NodeIcon },
        { name: "Next.js", icon: NextjsIcon },
        { name: "Tailwind", icon: TailWindIcon },
        { name: "Git", icon: GitIcon },
        { name: "Firebase", icon: FirebaseIcon },
        { name: "PostgreSQL", icon: PostgresIcon },
        { name: "MongoDB", icon: MongoIcon },
        { name: "MySQL", icon: MySqlIcon },
    ];
}
