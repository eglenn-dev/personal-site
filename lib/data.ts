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
    link?: string;
    article?: string;
}

interface Experience {
    id: number;
    role: string;
    company: string;
    period: string;
    skills: string[];
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
            article: "/blog/resumly",
        },
        {
            id: 2,
            name: "I-Hack Winner",
            description:
                "Placed first in the 'Integrity & Might' category at the BYU-Idaho 2024 hackathon. My team created a full-stack community watch platform with custom user authentication, post management, and AI integration.",
            technologies: ["React", "TypeScript", "Next.js", "Firebase"],
            article: "https://clipit.one/eg-dev-ihack",
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
            article: "/blog/marknote-update",
        },
        {
            id: 4,
            name: "Library Database Search",
            description:
                "Implemented a search tool for the McKay Library databases, allowing users to find relevant resources using natural language queries.",
            technologies: ["TypeScript", "React", "Next.js", "Gemini API"],
            article: "/blog/mckay-db-search",
        },
        {
            id: 5,
            name: "ClipIt.one",
            description:
                "Developed a streamlined link shortening application with custom analytics and user accounts, leveraging Next.js and Firebase to provide a dashboard and detailed insights for each link.",
            technologies: ["TypeScript", "React", "Next.js", "Firebase"],
            link: "https://clipit.one/eg-dev-clipit",
            article: "/blog/clipit-launch",
        },
        {
            id: 6,
            name: "3D Print Request System",
            description:
                "A fully custom web application for managing 3D print request from students at BYU-Idaho to the school's print lab. Created a front-end application, and a REST API running on a Node.js server.",
            technologies: ["React", "TypeScript", "Next.js", "Firebase"],
            article: "/blog/3d-print-queue",
        },
        {
            id: 7,
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
            id: 2,
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
            id: 3,
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

export function getJsonLdData() {
    return `{
      "@context": "https://schema.org/",
      "@type": "Person",
      "name": "Ethan Glenn",
      "jobTitle": "Full Stack Developer",
      "description": "Full Stack Developer specializing in TypeScript, React, Next.js, and Python. I create efficient, scalable web applications and have experience leading development teams.",
      "url": "https://ethanglenn.dev",
      "sameAs": [
        "https://github.com/eglenn-dev",
        "https://linkedin.com/in/eglenn-dev"
      ],
      "knowsAbout": [
        "TypeScript",
        "Python",
        "React",
        "Next.js",
        "Node.js",
        "MongoDB",
        "Firebase",
        "Docker",
        "Web Development",
        "Full Stack Development"
      ],
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://ethanglenn.dev"
      }
    }
  `;
}
