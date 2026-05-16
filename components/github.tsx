import type { CombinedStats } from "@/lib/types";
import { GitCommit, Code } from "lucide-react";

interface GithubStatsProps {
    data: CombinedStats | null;
}

export default async function GithubStats({ data }: GithubStatsProps) {
    if (!data) return <></>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div
                className="flex items-center justify-between gap-3 px-6 py-5 bg-surface-2 rounded-2xl border border-border/40"
                title="GitHub contributions in the last year"
            >
                <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
                        Contributions
                    </p>
                    <p className="font-display text-4xl leading-none">
                        {data.yearContributions}
                    </p>
                </div>
                <GitCommit className="h-6 w-6 text-lime" />
            </div>
            {data.topLanguage && (
                <div
                    className="flex items-center justify-between gap-3 px-6 py-5 bg-surface-2 rounded-2xl border border-border/40"
                    title="Most-used language across my repositories"
                >
                    <div>
                        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
                            Top Language
                        </p>
                        <p className="font-display text-4xl leading-none">
                            {data.topLanguage}
                        </p>
                    </div>
                    <Code className="h-6 w-6 text-lime" />
                </div>
            )}
        </div>
    );
}

export function GithubStatsSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {[0, 1].map((i) => (
                <div
                    key={i}
                    className="flex items-center justify-between gap-3 px-6 py-5 bg-surface-2 rounded-2xl border border-border/40 animate-pulse"
                >
                    <div className="space-y-2">
                        <div className="h-3 w-24 rounded bg-border" />
                        <div className="h-8 w-16 rounded bg-border" />
                    </div>
                    <div className="h-6 w-6 rounded bg-border" />
                </div>
            ))}
        </div>
    );
}
