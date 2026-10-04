"use client";

import { useEffect, useRef, useState } from "react";

interface Commit {
    x: number;
    y: number;
    branch: string;
    color: string;
    delay: number;
}

interface Branch {
    name: string;
    color: string;
    start: number;
    end: number;
    mergePoint?: number;
}

export function GitGraph() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
        if (typeof window !== "undefined") {
            return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        }
        return false;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

        const handleChange = (e: MediaQueryListEvent) => {
            setPrefersReducedMotion(e.matches);
        };

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Define branches with their lifecycle
    const branches: Branch[] = [
        { name: "main", color: "oklch(0.488 0.243 264.376)", start: 0, end: 10 },
        { name: "feature/ui", color: "oklch(0.7 0.19 142)", start: 2, end: 6, mergePoint: 6 },
        { name: "bugfix/api", color: "oklch(0.7 0.22 30)", start: 4, end: 8, mergePoint: 8 },
    ];

    // Generate commits based on branches
    const commits: Commit[] = [];
    const spacing = 60;
    const branchSpacing = 50;

    branches.forEach((branch, branchIndex) => {
        for (let i = branch.start; i <= branch.end; i++) {
            commits.push({
                x: i * spacing + 20,
                y: branchIndex * branchSpacing + 30,
                branch: branch.name,
                color: branch.color,
                delay: i * 0.15,
            });
        }
        
        // Add merge commit back to main if specified
        if (branch.mergePoint && branch.name !== "main") {
            commits.push({
                x: branch.mergePoint * spacing + 20,
                y: 30, // Main branch Y position
                branch: "main",
                color: branches[0].color,
                delay: branch.mergePoint * 0.15,
            });
        }
    });

    // Generate connection lines
    const lines: React.ReactElement[] = [];
    let lineKey = 0;

    branches.forEach((branch, branchIndex) => {
        const y = branchIndex * branchSpacing + 30;
        
        // Horizontal lines for commits on the same branch
        for (let i = branch.start; i < branch.end; i++) {
            lines.push(
                <line
                    key={`line-${lineKey++}`}
                    x1={i * spacing + 20}
                    y1={y}
                    x2={(i + 1) * spacing + 20}
                    y2={y}
                    stroke={branch.color}
                    strokeWidth="2"
                    className={prefersReducedMotion ? "" : "git-line"}
                    style={{
                        animationDelay: prefersReducedMotion ? "0s" : `${i * 0.15}s`,
                    }}
                />
            );
        }

        // Branch off from main
        if (branch.name !== "main") {
            lines.push(
                <path
                    key={`branch-${lineKey++}`}
                    d={`M ${branch.start * spacing + 20} 30 Q ${branch.start * spacing + 20} ${(y + 30) / 2} ${branch.start * spacing + 20} ${y}`}
                    fill="none"
                    stroke={branch.color}
                    strokeWidth="2"
                    className={prefersReducedMotion ? "" : "git-line"}
                    style={{
                        animationDelay: prefersReducedMotion ? "0s" : `${branch.start * 0.15}s`,
                    }}
                />
            );
        }

        // Merge back to main
        if (branch.mergePoint && branch.name !== "main") {
            lines.push(
                <path
                    key={`merge-${lineKey++}`}
                    d={`M ${branch.mergePoint * spacing + 20} ${y} Q ${branch.mergePoint * spacing + 20} ${(y + 30) / 2} ${branch.mergePoint * spacing + 20} 30`}
                    fill="none"
                    stroke={branch.color}
                    strokeWidth="2"
                    className={prefersReducedMotion ? "" : "git-line"}
                    style={{
                        animationDelay: prefersReducedMotion ? "0s" : `${branch.mergePoint * 0.15}s`,
                    }}
                />
            );
        }
    });

    return (
        <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center overflow-hidden"
            aria-hidden="true"
        >
            <svg
                viewBox="0 0 680 180"
                className="w-full h-full"
                style={{ maxHeight: "180px" }}
            >
                <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Lines */}
                <g className={isVisible && !prefersReducedMotion ? "animate-lines" : prefersReducedMotion ? "" : "opacity-0"}>
                    {lines}
                </g>

                {/* Commits */}
                <g className={isVisible && !prefersReducedMotion ? "animate-commits" : prefersReducedMotion ? "" : "opacity-0"}>
                    {commits.map((commit, index) => (
                        <circle
                            key={`commit-${index}`}
                            cx={commit.x}
                            cy={commit.y}
                            r="6"
                            fill={commit.color}
                            className="git-commit"
                            style={{
                                animationDelay: prefersReducedMotion ? "0s" : `${commit.delay}s`,
                                filter: "url(#glow)",
                            }}
                        />
                    ))}
                </g>

                {/* Branch labels */}
                <g className="opacity-70">
                    {branches.map((branch, index) => (
                        <text
                            key={`label-${branch.name}`}
                            x="10"
                            y={index * branchSpacing + 35}
                            fill="currentColor"
                            fontSize="12"
                            fontFamily="monospace"
                            className="select-none"
                        >
                            {branch.name}
                        </text>
                    ))}
                </g>
            </svg>

        </div>
    );
}
