import {
    PythonIcon,
    TypeScriptIcon,
    ReactIcon,
    NodeIcon,
    PostgresIcon,
    MongoIcon,
    NextjsIcon,
    JavaScriptIcon,
    FirebaseIcon,
    TailWindIcon,
    GitIcon,
    DockerIcon,
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
            link: "https://clipit.one/eg-dev-resumly",
        },
        {
            id: 2,
            name: "I-Hack Winner",
            description:
                "Placed first in the 'Integrity & Might' category at the BYU-Idaho 2024 hackathon. My team created a full-stack community watch platform with custom user authentication, post management, and AI integration.",
            technologies: ["React", "TypeScript", "Next.js", "Firebase"],
            link: "https://clipit.one/eg-dev-ihack",
        },
        {
            id: 3,
            name: "MarkNote.one",
            description:
                "Created an note taking web-app with markdown support, auto-saving, and live previews. With React server-side component rendering, the app is fast and responsive. Built initially as a 36 hour coding challenge.",
            technologies: [
                "TypeScript",
                "React",
                "Next.js",
                "Tailwind",
                "Firebase",
            ],
            link: "https://clipit.one/eg-dev-marknote",
        },
        {
            id: 4,
            name: "ClipIt.one",
            description:
                "Developed a streamlined link shortening application with custom analytics and user accounts, leveraging Next.js and Firebase to provide a dashboard and detailed insights for each link.",
            technologies: ["TypeScript", "React", "Next.js", "Firebase"],
            link: "https://clipit.one/eg-dev-clipit",
        },
        {
            id: 5,
            name: "3D Print Request System",
            description:
                "A fully custom web application for managing 3D print request from students at BYU-Idaho to the school's print lab. Created a front-end application, and a REST API running on a Node.js server.",
            technologies: ["React", "TypeScript", "Next.js", "Firebase"],
            link: "https://clipit.one/eg-dev-3dqueue",
        },
        {
            id: 6,
            name: "This Portfolio",
            description:
                "My personal portfolio website built with React and Tailwind CSS.",
            technologies: ["React", "Tailwind", "TypeScript"],
            link: "https://clipit.one/eg-dev",
        },
    ];
}

export function getExperiences(): Experience[] {
    return [
        {
            id: 1,
            role: "Team Lead & Web Developer",
            company: "David O. McKay Library - BYU-Idaho",
            period: "July 2024 - Present",
            responsibilities: [
                "Helped supervise a lab supporting over 1,200 students and faculty monthly, while overseeing a team of 10+ graphic designers and 3D printer technicians.",
                "Proposed, designed, implemented, and deployed a full-stack web app in React with TypeScript for managing 3D print requests from library patrons, replacing a dated excel spreadsheet.",
                "Develop and maintain library website of 30+ pages, writing JavaScript, HTML, and CSS to enhance user experience and maintain site functionality.",
            ],
        },
        {
            id: 2,
            role: "Applied Calculus Teaching Assistant",
            company: "Department of Mathematics - BYU-Idaho",
            period: "April 2024 - April 2025",
            responsibilities: [
                "Met with 6-10 students weekly to troubleshoot R code and help them implement calculus one concepts to data analysis projects.",
                "Worked with two instructors to offer grading support and tutoring to multiple sections of the course.",
            ],
        },
        {
            id: 3,
            role: "Lab Technician & Front-End Developer",
            company: "David O. McKay Library - BYU-Idaho",
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
        { name: "MongoDB", icon: MongoIcon },
        { name: "Docker", icon: DockerIcon },
        { name: "PostgreSQL", icon: PostgresIcon },
    ];
}
