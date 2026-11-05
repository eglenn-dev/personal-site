import { getCombinedGitHubStats } from "@/lib/github-stats";
import { getStatsQuip } from "@/lib/stats-quip";
import { getWeather } from "@/lib/weather";
import { Sparkles } from "lucide-react";
import { cacheLife } from "next/cache";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export async function StatsQuip() {
    "use cache";
    cacheLife("minutes");

    const [github, weather] = await Promise.all([
        getCombinedGitHubStats("eglenn-dev"),
        getWeather().catch(() => null),
    ]);

    // OpenWeather error responses are valid JSON without any weather in them.
    if (!github || typeof weather?.main?.temp !== "number") return null;

    const quip = await getStatsQuip({
        city: weather.name,
        temperatureF: Math.trunc(weather.main.temp),
        conditions: weather.weather[0].description,
        isNight: weather.dt < weather.sys.sunrise || weather.dt > weather.sys.sunset,
        contributionsThisYear: github.yearContributions,
        contributionsThisMonth: github.monthContributions,
        contributionsThisWeek: github.contributionHistory
            .slice(-7)
            .reduce((sum, day) => sum + day.contributionCount, 0),
        topLanguage: github.topLanguage,
    });

    if (!quip) return null;

    return (
        <Tooltip>
            <TooltipTrigger className="mt-4 w-fit cursor-default text-left">
                <div className="flex items-start gap-2 px-4 py-2 bg-card rounded-lg border shadow-xs font-mono text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    {quip}
                </div>
            </TooltipTrigger>
            <TooltipContent>
                Written by Claude Haiku 5.5 from the stats above
            </TooltipContent>
        </Tooltip>
    );
}

export function StatsQuipSkeleton() {
    return (
        <div className="mt-4 w-fit flex items-center gap-2 px-4 py-2 bg-card rounded-lg border shadow-xs font-mono text-[13px] font-medium text-zinc-400 animate-pulse">
            <Sparkles className="h-4 w-4" />
            <span>...</span>
        </div>
    );
}
