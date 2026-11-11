import { getWeather } from "@/lib/weather";
import { Cloud, Sun, Moon, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import Time from "./time";

export default async function WeatherCard() {
    let data;
    let isNight = false;

    try {
        data = await getWeather();
        // The API answers errors (bad key, rate limit) with a JSON body, so a
        // resolved fetch still needs checking before it is shown.
        if (
            !data?.sys ||
            typeof data?.main?.temp !== "number" ||
            !data?.weather?.[0]?.description
        ) {
            return null;
        }
        const sunrise = new Date(data.sys.sunrise * 1000);
        const sunset = new Date(data.sys.sunset * 1000);
        const currentTime = new Date();
        isNight = currentTime < sunrise || currentTime > sunset;
    } catch (error) {
        console.log("Failed to fetch weather data:", error);
        return null;
    }

    const weatherIcon = isNight ? (
        <Moon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
    ) : (
        <Sun className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
    );

    return (
        <Tooltip>
            <TooltipTrigger className="w-fit cursor-default">
                <div className="mb-4 w-fit select-none inline-flex items-center gap-3 px-4 py-2 bg-card rounded-lg border shadow-xs font-mono text-[13px] font-medium">
                    <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400">
                        {weatherIcon}
                        {data.main.temp.toString().split(".")[0]}°F
                    </div>
                    <div className="h-4 w-px bg-border"></div>
                    <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                        <Cloud className="h-4 w-4" />
                        {data.weather[0].description.charAt(0).toUpperCase() +
                            data.weather[0].description.slice(1)}
                    </div>
                    <div className="h-4 w-px bg-border"></div>
                    <Time />
                </div>
            </TooltipTrigger>
            <TooltipContent>Weather conditions in {data.name}</TooltipContent>
        </Tooltip>
    );
}

export function WeatherSkeleton() {
    return (
        <div className="w-fit mb-4 inline-flex items-center gap-3 px-4 py-2 bg-card rounded-lg border shadow-xs font-mono text-[13px] font-medium">
            <div className="flex items-center gap-1.5 text-zinc-400 animate-pulse">
                <Sun className="h-5 w-5" />
                <span>...</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-1.5 text-zinc-400 animate-pulse">
                <Cloud className="h-4 w-4" />
                <span>...</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex flex-row text-zinc-400 items-center gap-1.5 animate-pulse">
                <Clock className="inline-block h-4 w-4" />
                <span>...</span>
            </div>
        </div>
    );
}
