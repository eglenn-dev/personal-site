import {
    getYearContributions,
    getMostUsedLanguages,
} from "@/lib/get-github-stats";
import { GitCommit, Code } from "lucide-react";

export default async function GithubStats() {
    let contributions: number = 1500;
    let language: string | null = "TypeScript";

    try {
        contributions = await getYearContributions();
        language = await getMostUsedLanguages();
    } catch (error) {
        console.error("Error fetching GitHub stats:", error);
    }

    return (
        <div className="mb-4 inline-flex items-center gap-3 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm text-sm font-medium">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-500">
                <GitCommit className="h-5 w-5" />
                <span>{contributions} contributions</span>
            </div>

            {language && (
                <>
                    <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700"></div>
                    <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400">
                        <Code className="h-4 w-4" />
                        <span>{language}</span>
                    </div>
                </>
            )}
        </div>
    );
}

export function GithubStatsSkeleton() {
    return (
        <div className="mb-4 inline-flex items-center gap-3 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm text-sm font-medium">
            <div className="flex items-center gap-1.5 text-zinc-400 animate-pulse">
                <GitCommit className="h-5 w-5" />
                <span>...</span>
            </div>

            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700"></div>
            <div className="flex items-center gap-1.5 text-zinc-400 animate-pulse">
                <Code className="h-4 w-4" />
                <span>...</span>
            </div>
        </div>
    );
}
