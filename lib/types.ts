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
    last60DaysContributions: ContributionWeekday[];
    mostUsedLanguages: LanguageData;
    topLanguage: string | null;
}

export interface Project {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
    article?: string;
}

export interface Experience {
    role: string;
    company: string;
    period: string;
    skills: string[];
    responsibilities?: string[];
}

export interface TechStack {
    name: string;
    icon: React.ComponentType;
}
