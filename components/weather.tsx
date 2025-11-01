import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { getWeather } from "@/lib/weather";
import { Cloud, Sun, Moon, Clock } from "lucide-react";
import Time from "./time";

export default async function WeatherCard() {
    let data;
    let isNight = false;

    try {
        data = await getWeather();
        const sunrise = new Date(data.sys.sunrise * 1000);
        const sunset = new Date(data.sys.sunset * 1000);
        const currentTime = new Date();
        isNight = currentTime < sunrise || currentTime > sunset;
    } catch (error) {
        console.log("Failed to fetch weather data:", error);
        data = {
            name: "Unknown",
            main: { temp: 0 },
            weather: [{ main: "Unknown", description: "Unknown" }],
            sys: { sunrise: 0, sunset: 0 },
        };
    }

    const weatherIcon = isNight ? (
        <Moon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
    ) : (
        <Sun className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />
    );

    return (
        <div className="mb-4 select-none inline-flex items-center gap-3 px-4 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm text-sm font-medium">
            <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400">
                {weatherIcon}
                {data.main.temp.toString().split(".")[0]}°F
            </div>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700"></div>
            <div className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                <Cloud className="h-4 w-4" />
                {data.weather[0].description.charAt(0).toUpperCase() +
                    data.weather[0].description.slice(1)}
            </div>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700"></div>
            <Time />
        </div>
    );
}

export function WeatherSkeleton() {
    return (
        <div className="w-fit mb-4 inline-flex items-center gap-3 px-4 py-2 bg-zinc-50 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800 shadow-sm text-sm font-medium">
            <div className="flex items-center gap-1.5 text-zinc-400 animate-pulse">
                <Sun className="h-5 w-5" />
                <span>...</span>
            </div>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" />
            <div className="flex items-center gap-1.5 text-zinc-400 animate-pulse">
                <Cloud className="h-4 w-4" />
                <span>...</span>
            </div>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" />
            <div className="flex flex-row text-zinc-400 items-center gap-1.5 animate-pulse">
                <Clock className="inline-block h-4 w-4" />
                <span>...</span>
            </div>
        </div>
    );
}
