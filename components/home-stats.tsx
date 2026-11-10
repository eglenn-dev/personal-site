import { getCombinedGitHubStats } from "@/lib/github-stats";
import WeatherCard, { WeatherSkeleton } from "@/components/weather";
import GithubStats, { GithubStatsSkeleton } from "@/components/github";
import { GitHubHeatmap, GitHubHeatmapSkeleton } from "./heat-map";
import { StatsQuipSkeleton } from "./stats-quip";
import { cacheLife } from "next/cache";

// The quip arrives as children so that a slow API call doesn't hold up these
// cached stats.
export async function HomeStats({ children }: { children: React.ReactNode }) {
    "use cache";
    cacheLife("minutes");
    const githubStats = await getCombinedGitHubStats("eglenn-dev");

    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <GithubStats data={githubStats} />
                <WeatherCard />
                {children}
                <GitHubHeatmap data={githubStats?.contributionHistory} />
            </div>
        </div>
    );
}

export function HomeStatsSkeleton() {
    return (
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <GithubStatsSkeleton />
                <WeatherSkeleton />
                <StatsQuipSkeleton />
                <GitHubHeatmapSkeleton />
            </div>
        </div>
    );
}
