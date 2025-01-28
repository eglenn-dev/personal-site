"use client";
import React from "react";

export default function CurrentDate() {
    const date = new Date().toLocaleDateString("en-US", {
        timeZone: "America/Denver",
    });

    return <span>{date}</span>;
}
