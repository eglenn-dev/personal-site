import type { CombinedStats } from "@/lib/types";
import { GitCommit, Code } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";

interface GithubStatsProps {
    data: CombinedStats | null;
}

export default async function GithubStats({ data }: GithubStatsProps) {
    if (!data) return <></>;

    return (
        <Tooltip>
            <TooltipTrigger className="cursor-default w-fit">
                <div className="mb-4 w-fit select-none inline-flex items-center gap-3 px-4 py-2 bg-card rounded-lg border shadow-xs font-mono text-[13px] font-medium">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                        <GitCommit className="h-5 w-5" />
                        {data.yearContributions} contributions
                    </div>
                    {data.topLanguage && (
                        <>
                            <div className="h-4 w-px bg-border"></div>
                            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                                <Code className="h-4 w-4" />
                                {data.topLanguage}
                            </div>
                        </>
                    )}
                </div>
            </TooltipTrigger>
            <TooltipContent>
                My contributions and top language for the last year
            </TooltipContent>
        </Tooltip>
    );
}

export function GithubStatsSkeleton() {
    return (
        <div className="w-fit mb-4 inline-flex items-center gap-3 px-4 py-2 bg-card rounded-lg border shadow-xs font-mono text-[13px] font-medium">
            <div className="flex items-center gap-1.5 text-zinc-400 animate-pulse">
                <GitCommit className="h-5 w-5" />
                <span>...</span>
            </div>

            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center gap-1.5 text-zinc-400 animate-pulse">
                <Code className="h-4 w-4" />
                <span>...</span>
            </div>
        </div>
    );
}
