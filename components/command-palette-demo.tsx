"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Search, Command } from "lucide-react";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { useCommandPalette } from "@/components/command-palette-provider-context";

const ANIMATION_DURATION = 5000;
const TYPE_SPEED = 150;
const QUERY = "projects";

export function CommandPaletteDemo() {
    const [typedText, setTypedText] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [opening, setOpening] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== "undefined") {
            return window.matchMedia("(max-width: 768px)").matches;
        }
        return false;
    });
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
        if (typeof window !== "undefined") {
            return window.matchMedia("(prefers-reduced-motion: reduce)")
                .matches;
        }
        return false;
    });
    const containerRef = useRef<HTMLDivElement>(null);
    const { setOpen } = useCommandPalette();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.matchMedia("(max-width: 768px)").matches);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!containerRef.current || prefersReducedMotion) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 },
        );

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [prefersReducedMotion]);

    useEffect(() => {
        if (!isVisible || prefersReducedMotion) return;

        const runAnimation = async () => {
            setTypedText("");
            setShowResults(false);
            setSelectedIndex(-1);
            setOpening(false);

            await new Promise((resolve) => setTimeout(resolve, 500));

            for (let i = 0; i <= QUERY.length; i++) {
                setTypedText(QUERY.slice(0, i));
                await new Promise((resolve) => setTimeout(resolve, TYPE_SPEED));
            }

            await new Promise((resolve) => setTimeout(resolve, 300));
            setShowResults(true);

            await new Promise((resolve) => setTimeout(resolve, 400));
            setSelectedIndex(0);

            await new Promise((resolve) => setTimeout(resolve, 800));
            setOpening(true);

            await new Promise((resolve) => setTimeout(resolve, 500));
        };

        const interval = setInterval(runAnimation, ANIMATION_DURATION);
        runAnimation();

        return () => clearInterval(interval);
    }, [isVisible, prefersReducedMotion]);

    const handleClick = () => {
        setOpen(true);
    };

    const projects = [
        { name: "I-Hack Winner 2025", icon: FolderOpen },
        { name: "Legrande Health Web App", icon: FolderOpen },
        { name: "Resumly.pro", icon: FolderOpen },
    ];

    if (prefersReducedMotion) {
        return (
            <div
                ref={containerRef}
                className="relative w-full h-full min-h-[280px] flex flex-col items-center justify-center p-6 cursor-pointer group"
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleClick();
                    }
                }}
                aria-label="Open command palette"
            >
                <div className="w-full max-w-md bg-popover border border-border rounded-lg shadow-lg p-4">
                    <div className="flex items-center gap-2 mb-3 px-3 py-2 border border-border rounded-md bg-background">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                            Search for projects, blog posts...
                        </span>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-accent/50">
                            <FolderOpen className="h-4 w-4 shrink-0" />
                            <span className="text-sm">I-Hack Winner 2025</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-md opacity-60">
                            <FolderOpen className="h-4 w-4 shrink-0" />
                            <span className="text-sm">
                                Legrande Health Web App
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                        Quick navigation
                    </p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-xs text-muted-foreground">
                            Press
                        </span>
                        {isMobile ? (
                            <Kbd className="text-xs">Tap here</Kbd>
                        ) : (
                            <KbdGroup>
                                <Kbd>
                                    <Command className="h-3 w-3" />
                                </Kbd>
                                <Kbd>K</Kbd>
                            </KbdGroup>
                        )}
                        <span className="text-xs text-muted-foreground">
                            to search
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full min-h-[280px] flex flex-col items-center justify-center p-6 cursor-pointer group"
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick();
                }
            }}
            aria-label="Open command palette"
        >
            <AnimatePresence mode="wait">
                {!opening && (
                    <motion.div
                        key="palette"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                        className="w-full max-w-md bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
                    >
                        <div
                            className="flex items-center gap-2 px-3 py-3 border-b border-border"
                            aria-hidden="true"
                        >
                            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                            <div className="flex-1 flex items-center min-w-0">
                                <span className="text-sm">
                                    {typedText}
                                    <motion.span
                                        className="inline-block w-0.5 h-4 bg-primary ml-0.5"
                                        animate={{ opacity: [1, 0] }}
                                        transition={{
                                            duration: 0.8,
                                            repeat: Infinity,
                                        }}
                                    />
                                </span>
                            </div>
                        </div>

                        {showResults && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-2"
                                aria-hidden="true"
                            >
                                {projects.map((project, index) => (
                                    <motion.div
                                        key={project.name}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                                            selectedIndex === index
                                                ? "bg-accent text-accent-foreground"
                                                : "opacity-60",
                                        )}
                                    >
                                        <project.icon className="h-4 w-4 shrink-0" />
                                        <span className="text-sm truncate">
                                            {project.name}
                                        </span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <p className="text-sm text-muted-foreground mb-2 group-hover:text-foreground transition-colors">
                    Quick navigation
                </p>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        Press
                    </span>
                    {isMobile ? (
                        <Kbd className="text-xs group-hover:ring-2 group-hover:ring-primary/20 transition-all">
                            Tap here
                        </Kbd>
                    ) : (
                        <KbdGroup className="group-hover:scale-105 transition-transform">
                            <Kbd>
                                <Command className="h-3 w-3" />
                            </Kbd>
                            <Kbd>K</Kbd>
                        </KbdGroup>
                    )}
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        to search
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
