"use client";
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function Time() {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const getTimeOfDayColor = (time: Date) => {
        const hour = time.getHours();

        if (hour >= 6 && hour < 12) {
            return "text-sky-500 dark:text-sky-400";
        } else if (hour >= 12 && hour < 18) {
            return "text-amber-500 dark:text-amber-400";
        } else if (hour >= 18 && hour < 21) {
            return "text-red-500 dark:text-red-400";
        } else {
            return "text-purple-500 dark:text-purple-400";
        }
    };

    const colorClass = currentTime
        ? getTimeOfDayColor(currentTime)
        : "text-gray-500 dark:text-gray-400";

    return (
        <span className={`${colorClass} flex flex-row items-center gap-1.5`}>
            <Clock className="inline-block h-4 w-4" />
            {currentTime
                ? currentTime.toLocaleTimeString("en-US", {
                      timeZone: process.env.NEXT_PUBLIC_TIMEZONE,
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                  })
                : `...`}
        </span>
    );
}
