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
            name: "E-commerce Platform",
            description:
                "A full-stack e-commerce platform with user authentication, product management, and order processing.",
            technologies: ["React", "Node.js", "Express", "MongoDB"],
            link: "https://github.com/yourusername/ecommerce-platform",
        },
        {
            id: 2,
            name: "Task Management App",
            description:
                "A responsive web application for managing tasks and projects with real-time updates.",
            technologies: ["React", "Firebase", "Material-UI"],
            link: "https://github.com/yourusername/task-management-app",
        },
        {
            id: 3,
            name: "Weather Forecast App",
            description:
                "A weather forecast application that provides real-time weather data and 5-day forecasts.",
            technologies: ["React Native", "Redux", "OpenWeatherMap API"],
            link: "https://github.com/yourusername/weather-forecast-app",
        },
    ];
}

export function getExperiences(): Experience[] {
    return [
        {
            id: 1,
            role: "Senior Software Engineer",
            company: "Tech Innovators Inc.",
            period: "Jan 2020 - Present",
            responsibilities: [
                "Lead a team of 5 developers in designing and implementing scalable web applications",
                "Architected and developed microservices using Node.js and Docker",
                "Implemented CI/CD pipelines using Jenkins and AWS",
            ],
        },
        {
            id: 2,
            role: "Full Stack Developer",
            company: "WebSolutions Co.",
            period: "Jun 2017 - Dec 2019",
            responsibilities: [
                "Developed and maintained multiple client websites using React and Django",
                "Optimized database queries and implemented caching strategies to improve application performance",
                "Collaborated with UX designers to implement responsive and accessible user interfaces",
            ],
        },
        {
            id: 3,
            role: "Junior Developer",
            company: "StartUp Ventures",
            period: "Sep 2015 - May 2017",
            responsibilities: [
                "Assisted in the development of a social media analytics platform using Python and React",
                "Implemented RESTful APIs and integrated third-party services",
                "Participated in code reviews and contributed to improving coding standards",
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
