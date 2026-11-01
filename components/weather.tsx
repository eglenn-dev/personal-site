import { getWeather } from "@/lib/weather";
import { Cloud, Sun, Moon, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
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
        <Tooltip>
            <TooltipTrigger className="w-fit cursor-default">
                <div className="w-fit select-none inline-flex items-center gap-3 h-11 px-4 glass rounded-full text-sm font-medium">
                    <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400">
                        {weatherIcon}
                        {data.main.temp.toString().split(".")[0]}°F
                    </div>
                    <div className="h-4 w-px bg-foreground/15"></div>
                    <div className="flex items-center gap-1.5 text-foreground/80">
                        <Cloud className="h-4 w-4" />
                        {data.weather[0].description.charAt(0).toUpperCase() +
                            data.weather[0].description.slice(1)}
                    </div>
                    <div className="h-4 w-px bg-foreground/15"></div>
                    <Time />
                </div>
            </TooltipTrigger>
            <TooltipContent>Weather conditions in {data.name}</TooltipContent>
        </Tooltip>
    );
}

export function WeatherSkeleton() {
    return (
        <div className="w-fit inline-flex items-center gap-3 h-11 px-4 glass rounded-full text-sm font-medium">
            <div className="flex items-center gap-1.5 text-muted-foreground animate-pulse">
                <Sun className="h-5 w-5" />
                <span>...</span>
            </div>
            <div className="h-4 w-px bg-foreground/15" />
            <div className="flex items-center gap-1.5 text-muted-foreground animate-pulse">
                <Cloud className="h-4 w-4" />
                <span>...</span>
            </div>
            <div className="h-4 w-px bg-foreground/15" />
            <div className="flex flex-row text-muted-foreground items-center gap-1.5 animate-pulse">
                <Clock className="inline-block h-4 w-4" />
                <span>...</span>
            </div>
        </div>
    );
}
