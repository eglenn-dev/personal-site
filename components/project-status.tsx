import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Globe } from "lucide-react";
import { getProjectStatus } from "@/lib/project-status";

export default async function ProjectStatus() {
    const { allOnline, errorMessage, updatedAt } = await getProjectStatus();

    const date = new Date(updatedAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    let message: string;
    if (diffMinutes < 1) {
        message = "just now";
    } else if (diffMinutes === 1) {
        message = "1 minute ago";
    } else {
        message = `${diffMinutes} minutes ago`;
    }

    return (
        <HoverCard>
            <HoverCardTrigger href="https://status.eglenn.dev" target="_blank">
                <div className="mb-4 select-none cursor-pointer inline-flex items-center gap-3 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-sm font-medium">
                    <div
                        className={`flex items-center gap-1.5 ${
                            allOnline
                                ? "text-emerald-700 dark:text-emerald-400"
                                : "text-orange-600 dark:text-orange-400"
                        }`}
                    >
                        <div className="relative">
                            <Globe className="h-5 w-5" />
                            <div
                                className={`absolute -top-1 -right-1 h-2 w-2 rounded-full ${
                                    allOnline ? "bg-emerald-500" : "bg-red-500"
                                }`}
                            />
                        </div>
                        <span className="hidden lg:inline-block">
                            {allOnline
                                ? "All projects online"
                                : "Service issues"}
                        </span>
                    </div>
                </div>
            </HoverCardTrigger>
            <HoverCardContent>
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold flex gap-2 items-center">
                        <Globe className="h-5 w-5" />
                        Project Status
                    </h3>
                    {allOnline ? (
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">
                            All projects are online and accessible.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            <p className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-2">
                                {errorMessage}
                            </p>
                        </div>
                    )}
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        <span className="font-semibold">Last updated:</span>{" "}
                        {message}
                    </p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
}

export function ProjectStatusSkeleton() {
    return (
        <div className="mb-4 inline-flex items-center gap-3 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-sm font-medium">
            <div className="flex items-center gap-1.5 text-zinc-400 animate-pulse">
                <div className="relative">
                    <Globe className="h-5 w-5" />
                    <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                </div>
                <span>...</span>
            </div>
        </div>
    );
}
