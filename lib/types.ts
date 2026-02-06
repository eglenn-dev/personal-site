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
    last120DaysContributions: ContributionWeekday[];
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

export interface CanvasAssignment {
    id: number;
    name: string;
    description: string;
    due_at: string | null;
    points_possible: number;
    course_id: number;
    html_url: string;
    submission_types: string[];
}

export interface CanvasCourse {
    id: number;
    name: string;
    course_code: string;
}

export interface CanvasAssignmentWithCourse extends CanvasAssignment {
    course_name: string;
}
