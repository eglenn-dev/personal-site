"use client";
import React, { useState, useEffect } from "react";

export default function Time() {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(async () => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <span>
            {currentTime.toLocaleTimeString("en-US", {
                timeZone: "America/Denver",
            })}
        </span>
    );
}
