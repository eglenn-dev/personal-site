"use client";

import { useEffect, useRef, useState } from "react";

interface TerminalLine {
    text: string;
    delay: number;
    type?: "command" | "log" | "success";
}

const terminalSequence: TerminalLine[] = [
    { text: "$ deploy --env production", delay: 50, type: "command" },
    { text: "→ Building application...", delay: 400, type: "log" },
    { text: "✓ TypeScript compiled successfully", delay: 300, type: "log" },
    { text: "✓ Optimizing bundle", delay: 300, type: "log" },
    { text: "✓ Running tests... 12/12 passed", delay: 300, type: "log" },
    { text: "✓ Deploy complete", delay: 400, type: "success" },
];

export function TerminalAnimation() {
    const [lines, setLines] = useState<string[]>([]);
    const [currentLineIndex, setCurrentLineIndex] = useState(0);
    const [currentText, setCurrentText] = useState("");
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    });

    // Check for reduced motion preference
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    // Intersection Observer to pause when off-screen
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                setIsPaused(!entries[0].isIntersecting);
            },
            { threshold: 0.1 }
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    // Main animation loop
    useEffect(() => {
        if (isPaused || prefersReducedMotion) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            return;
        }

        const currentSequence = terminalSequence[currentLineIndex];
        if (!currentSequence) {
            // Restart sequence after a pause
            timeoutRef.current = setTimeout(() => {
                setLines([]);
                setCurrentLineIndex(0);
                setCurrentText("");
            }, 1500);
            return;
        }

        if (currentText.length < currentSequence.text.length) {
            // Type next character
            timeoutRef.current = setTimeout(() => {
                setCurrentText(currentSequence.text.slice(0, currentText.length + 1));
            }, currentSequence.delay);
        } else {
            // Finished typing current line
            timeoutRef.current = setTimeout(() => {
                setLines((prev) => [...prev, currentSequence.text]);
                setCurrentText("");
                setCurrentLineIndex((prev) => prev + 1);
            }, 200);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [currentLineIndex, currentText, isPaused, prefersReducedMotion]);

    // Render static version for reduced motion
    if (prefersReducedMotion) {
        return (
            <div
                ref={containerRef}
                className="bg-zinc-900 dark:bg-zinc-950 rounded-2xl p-6 font-mono text-sm"
                aria-label="Terminal showing successful deployment"
            >
                <div className="flex items-center gap-2 mb-4" aria-hidden="true">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-2">
                    <div className="text-green-400">$ deploy --env production</div>
                    <div className="text-zinc-400">→ Building application...</div>
                    <div className="text-zinc-400">✓ TypeScript compiled successfully</div>
                    <div className="text-zinc-400">✓ Optimizing bundle</div>
                    <div className="text-zinc-400">✓ Running tests... 12/12 passed</div>
                    <div className="text-green-400 font-semibold">✓ Deploy complete</div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="bg-zinc-900 dark:bg-zinc-950 rounded-2xl p-6 font-mono text-sm"
            aria-label="Terminal showing successful deployment"
        >
            <div className="flex items-center gap-2 mb-4" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="space-y-2 min-h-[140px]" aria-live="polite" aria-atomic="false">
                {lines.map((line, index) => {
                    const isCommand = terminalSequence[index]?.type === "command";
                    const isSuccess = terminalSequence[index]?.type === "success";
                    return (
                        <div
                            key={index}
                            className={`${
                                isCommand
                                    ? "text-green-400"
                                    : isSuccess
                                      ? "text-green-400 font-semibold"
                                      : "text-zinc-400"
                            }`}
                        >
                            {line}
                        </div>
                    );
                })}
                {currentText && (
                    <div
                        className={`${
                            terminalSequence[currentLineIndex]?.type === "command"
                                ? "text-green-400"
                                : terminalSequence[currentLineIndex]?.type === "success"
                                  ? "text-green-400 font-semibold"
                                  : "text-zinc-400"
                        }`}
                    >
                        {currentText}
                        <span className="inline-block w-2 h-4 ml-1 bg-green-400 animate-pulse"></span>
                    </div>
                )}
            </div>
        </div>
    );
}
