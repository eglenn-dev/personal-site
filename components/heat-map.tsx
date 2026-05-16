"use client";

import { useEffect, useRef } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ContributionWeekday } from "@/lib/types";

const colorScale = (count: number) => {
    if (count === 0) return "bg-surface-2";
    if (count < 3) return "bg-lime/25";
    if (count < 8) return "bg-lime/50";
    if (count < 12) return "bg-lime/75";
    return "bg-lime";
};

interface GitHubHeatmapProps {
    data: ContributionWeekday[] | undefined;
}

export function GitHubHeatmap({ data }: GitHubHeatmapProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const viewport = scrollRef.current?.querySelector(
            "[data-radix-scroll-area-viewport]"
        );
        if (viewport) {
            viewport.scrollLeft = viewport.scrollWidth;
        }
    }, [data]);

    if (!data || data.length === 0) {
        return <></>;
    }

    const formatDate = (date: string) => {
        const d = new Date(date);
        return `${d.toLocaleString("en-US", {
            month: "short",
            timeZone: "UTC",
        })} ${d.getUTCDate().toString().padStart(2, "0")}`;
    };

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
        <div className="p-5 bg-surface-2 rounded-2xl border border-border/40">
            <ScrollArea ref={scrollRef} className="w-full">
                <div className="flex flex-col gap-1 w-fit">
                    {gridData.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-1">
                            {row.map((day, colIndex) => (
                                <Tooltip key={`${rowIndex}-${colIndex}`}>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={`w-3 h-3 rounded-sm ${day ? colorScale(day.contributionCount) : "bg-surface"} transition-colors`}
                                        />
                                    </TooltipTrigger>
                                    {day && (
                                        <TooltipContent>
                                            <p>
                                                {day.contributionCount} commits
                                                on {formatDate(day.date)}
                                            </p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            ))}
                        </div>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}

export function GitHubHeatmapSkeleton() {
    const WEEKS = 52;
    const DAYS_PER_WEEK = 7;

    const grid = Array.from({ length: DAYS_PER_WEEK }, () =>
        Array.from({ length: WEEKS }).fill(0)
    );

    return (
        <div className="p-5 bg-surface-2 rounded-2xl border border-border/40 animate-pulse">
            <div className="overflow-hidden w-full">
                <div className="flex flex-col gap-1 w-fit ml-auto">
                    {grid.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-1">
                            {row.map((_, colIndex) => (
                                <div
                                    key={`${rowIndex}-${colIndex}`}
                                    className="w-3 h-3 bg-surface rounded-sm"
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
