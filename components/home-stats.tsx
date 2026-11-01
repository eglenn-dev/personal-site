import { getCombinedGitHubStats } from "@/lib/github-stats";
import WeatherCard, { WeatherSkeleton } from "@/components/weather";
import GithubStats, { GithubStatsSkeleton } from "@/components/github";
import { GitHubHeatmap, GitHubHeatmapSkeleton } from "./heat-map";
import { cacheLife } from "next/cache";

export async function HomeStats() {
    "use cache";
    cacheLife("minutes");
    const githubStats = await getCombinedGitHubStats("eglenn-dev");

    return (
        <div className="flex flex-col">
            <div className="mb-4 flex flex-wrap gap-3">
                <GithubStats data={githubStats} />
                <WeatherCard />
            </div>
            <GitHubHeatmap data={githubStats?.contributionHistory} />
        </div>
    );
}

export function HomeStatsSkeleton() {
    return (
        <div className="flex flex-col">
            <div className="mb-4 flex flex-wrap gap-3">
                <GithubStatsSkeleton />
                <WeatherSkeleton />
            </div>
            <GitHubHeatmapSkeleton />
        </div>
    );
}
