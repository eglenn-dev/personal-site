import type { Technology } from "./icons";

export interface LanguageData {
    [key: string]: number;
}

export interface ContributionWeekday {
    date: string;
    contributionCount: number;
    weekday: number;
}

export interface CombinedStats {
    yearContributions: number;
    monthContributions: number;
    contributionHistory: ContributionWeekday[];
    mostUsedLanguages: LanguageData;
    topLanguage: string | null;
}

export interface Project {
    name: string;
    description: string;
    technologies: Technology[];
    link?: string;
    article?: string;
}

export interface ExperienceLogo {
    src: string;
    invertInDark?: boolean;
}

export interface Experience {
    role: string;
    company: string;
    logo: ExperienceLogo;
    period: string;
    skills: string[];
    responsibilities?: string[];
}

export interface TechStack {
    name: string;
    icon: React.ComponentType;
}
