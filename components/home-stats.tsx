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
        <div className="flex flex-col gap-8">
            <div className="flex flex-col">
                <GithubStats data={githubStats} />
                <WeatherCard />
            </div>
            <div className="w-fit mx-auto sm:mx-0">
                <GitHubHeatmap data={githubStats?.last120DaysContributions} />
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
            </div>
            <div className="w-fit mx-auto sm:mx-0">
                <GitHubHeatmapSkeleton />
            </div>
        </div>
    );
}
