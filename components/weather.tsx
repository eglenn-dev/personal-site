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
        <Moon className="h-5 w-5 text-blue-400" />
    ) : (
        <Sun className="h-5 w-5 text-yellow-400" />
    );

    return (
        <Tooltip>
            <TooltipTrigger className="w-fit cursor-default">
                <div className="inline-flex items-center gap-4 px-5 py-3 bg-surface-2 rounded-full border border-border/40 text-sm">
                    <div className="flex items-center gap-2 font-medium">
                        {weatherIcon}
                        {data.main.temp.toString().split(".")[0]}°F
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Cloud className="h-4 w-4" />
                        {data.weather[0].description.charAt(0).toUpperCase() +
                            data.weather[0].description.slice(1)}
                    </div>
                    <div className="h-4 w-px bg-border" />
                    <div className="text-muted-foreground">
                        <Time />
                    </div>
                </div>
            </TooltipTrigger>
            <TooltipContent>Weather conditions in {data.name}</TooltipContent>
        </Tooltip>
    );
}

export function WeatherSkeleton() {
    return (
        <div className="w-fit inline-flex items-center gap-4 px-5 py-3 bg-surface-2 rounded-full border border-border/40 text-sm animate-pulse">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Sun className="h-5 w-5" />
                <span>...</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
                <Cloud className="h-4 w-4" />
                <span>...</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>...</span>
            </div>
        </div>
    );
}
