"use client";
import React, { useState, useEffect } from "react";

export default function Time() {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);

    useEffect(() => {
        const intervalId = setInterval(async () => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <span>
            {currentTime &&
                currentTime.toLocaleTimeString("en-US", {
                    timeZone: "America/Denver",
                })}
        </span>
    );
}
