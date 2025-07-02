import {
    getYearContributions,
    getMostUsedLanguage,
} from "@/lib/get-github-stats";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { GitCommit, Code } from "lucide-react";
import { GithubIcon } from "@/lib/icons";

export default async function GithubStats() {
    let contributions: number = 1500;
    let language: string | null = "TypeScript";

    try {
        contributions = await getYearContributions();
        language = await getMostUsedLanguage();
    } catch (error) {
        console.error("Error fetching GitHub stats:", error);
    }

    return (
        <HoverCard>
            <HoverCardTrigger href="#stats" className="w-fit">
                <div className="mb-4 select-none cursor-help inline-flex items-center gap-3 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-sm font-medium">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                        <GitCommit className="h-5 w-5" />
                        {contributions} contributions
                    </div>
                    {language && (
                        <>
                            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700"></div>
                            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                                <Code className="h-4 w-4" />
                                {language}
                            </div>
                        </>
                    )}
                </div>
            </HoverCardTrigger>
            <HoverCardContent>
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold flex gap-2 items-center">
                        <GithubIcon /> GitHub Stats
                    </h3>
                    <p className="text-sm">
                        My commit activity in the last year, and most used
                        programming language from{" "}
                        <a
                            href="https://clipit.one/eg-dev-github"
                            target="_blank"
                            className="underline"
                        >
                            GitHub
                        </a>
                        .
                    </p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}

export function GithubStatsSkeleton() {
    return (
        <div className="w-fit mb-4 inline-flex items-center gap-3 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm text-sm font-medium">
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
