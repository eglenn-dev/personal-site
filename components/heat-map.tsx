import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { ContributionWeekday } from "@/lib/types";

const colorScale = (count: number) => {
    if (count === 0) return "bg-gray-200 dark:bg-zinc-800";
    if (count < 3) return "bg-green-300 dark:bg-green-900";
    if (count < 8) return "bg-green-500 dark:bg-green-700";
    if (count < 12) return "bg-green-700 dark:bg-green-600";
    return "bg-green-800 dark:bg-green-500";
};

interface GitHubHeatmapProps {
    data: ContributionWeekday[] | undefined;
}

export async function GitHubHeatmap({ data }: GitHubHeatmapProps) {
    if (!data) return <></>;

    const formatDate = (date: string) => {
        const d = new Date(date);
        return `${d.toLocaleString("en-US", {
            month: "short",
            timeZone: "UTC",
        })} ${d.getUTCDate().toString().padStart(2, "0")}`;
    };

    if (!data || data.length === 0) {
        return <></>;
    }

    const sorted = [...data]
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(1);

    const DAYS_PER_WEEK = 7;
    const firstDate = new Date(sorted[0].date);
    const startOfFirstWeek = new Date(firstDate);
    startOfFirstWeek.setUTCDate(firstDate.getUTCDate() - firstDate.getUTCDay());

    const weeksMap = new Map<number, ContributionWeekday[]>();
    sorted.forEach((day) => {
        const d = new Date(day.date);
        const diffDays = Math.floor(
            (d.getTime() - startOfFirstWeek.getTime()) / 86400000
        );
        const weekIndex = Math.floor(diffDays / DAYS_PER_WEEK);
        if (!weeksMap.has(weekIndex)) weeksMap.set(weekIndex, []);
        weeksMap.get(weekIndex)!.push(day);
    });

    const weekIndices = Array.from(weeksMap.keys()).sort((a, b) => a - b);

    if (weekIndices.length === 0) {
        return <></>;
    }

    const gridData: (ContributionWeekday | null)[][] = Array.from(
        { length: DAYS_PER_WEEK },
        () => new Array(weekIndices.length).fill(null)
    );

    weekIndices.forEach((weekIdx, col) => {
        const days = weeksMap.get(weekIdx)!;
        days.forEach((day) => {
            const row = day.weekday;
            if (row >= 0 && row < DAYS_PER_WEEK) {
                gridData[row][col] = day;
            }
        });
    });

    return (
        <TooltipProvider>
            <div className="space-y-2">
                <div className="flex">
                    <div className="flex flex-col space-y-1 max-w-fit">
                        {gridData.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex space-x-1">
                                {row.map((day, colIndex) => (
                                    <div key={`${rowIndex}-${colIndex}`}>
                                        {day ? (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <div
                                                        className={`w-3 h-3 rounded-sm ${colorScale(day.contributionCount)} transition-colors`}
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>
                                                        {day.contributionCount}{" "}
                                                        commits on{" "}
                                                        {formatDate(day.date)}
                                                    </p>
                                                </TooltipContent>
                                            </Tooltip>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
}

export function GitHubHeatmapSkeleton() {
    const WEEKS = 9;
    const DAYS_PER_WEEK = 7;

    const grid = Array.from({ length: DAYS_PER_WEEK }, () =>
        Array.from({ length: WEEKS }).fill(0)
    );

    return (
        <div className="space-y-2 animate-pulse">
            <div className="flex">
                <div className="flex flex-col space-y-1 max-w-fit">
                    {grid.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex space-x-1">
                            {row.map((_, colIndex) => (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className="w-3 h-3 bg-gray-200 dark:bg-zinc-800 rounded-sm"
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
