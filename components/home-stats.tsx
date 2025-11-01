import { getCombinedGitHubStats } from "@/lib/github-stats";
import WeatherCard, { WeatherSkeleton } from "@/components/weather";
import GithubStats, { GithubStatsSkeleton } from "@/components/github";
import { GitHubHeatmap, GitHubHeatmapSkeleton } from "./heat-map";
import ProjectStatus, {
    ProjectStatusSkeleton,
} from "@/components/project-status";
import { cacheLife } from "next/cache";

export async function HomeStats() {
    "use cache";
    cacheLife("minutes");
    const githubStats = await getCombinedGitHubStats("eglenn-dev");

    return (
        <div className="flex flex-col gap-8 sm:flex-row">
            <div className="flex flex-col ml-2">
                <GithubStats data={githubStats} />
                <WeatherCard />
                <ProjectStatus />
            </div>
            <div className="w-fit mx-auto sm:mx-0">
                <GitHubHeatmap data={githubStats?.last60DaysContributions} />
            </div>
        </div>
    );
}

export function HomeStatsSkeleton() {
    return (
        <div className="flex flex-col gap-8 sm:flex-row">
            <div className="flex flex-col ml-2">
                <GithubStatsSkeleton />
                <WeatherSkeleton />
                <ProjectStatusSkeleton />
            </div>
            <div className="w-fit mx-auto sm:mx-0">
                <GitHubHeatmapSkeleton />
            </div>
        </div>
    );
}
