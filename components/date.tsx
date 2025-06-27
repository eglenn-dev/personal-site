"use client";
import React from "react";

export default function CurrentDate() {
    const date = new Date().toLocaleDateString("en-US", {
        timeZone: process.env.NEXT_PUBLIC_TIMEZONE,
    });

    return <span>{date}</span>;
}
