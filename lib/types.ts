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
