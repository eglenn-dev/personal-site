"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Node {
    id: string;
    label: string;
    x: number;
    y: number;
}

interface Connection {
    from: string;
    to: string;
    delay: number;
}

const nodes: Node[] = [
    { id: "client", label: "Client", x: 20, y: 50 },
    { id: "api", label: "API", x: 50, y: 30 },
    { id: "database", label: "Database", x: 80, y: 50 },
    { id: "queue", label: "Queue", x: 50, y: 70 },
];

const connections: Connection[] = [
    { from: "client", to: "api", delay: 0 },
    { from: "api", to: "database", delay: 1 },
    { from: "api", to: "queue", delay: 2 },
    { from: "queue", to: "database", delay: 3.5 },
];

export function LiveSystemDiagram() {
    const [isVisible, setIsVisible] = useState(false);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
        if (typeof window !== "undefined") {
            return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        }
        return false;
    });
    const containerRef = useRef<HTMLDivElement>(null);

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

    const getNodePosition = (nodeId: string) => {
        const node = nodes.find((n) => n.id === nodeId);
        return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
    };

    const createPath = (from: string, to: string) => {
        const fromPos = getNodePosition(from);
        const toPos = getNodePosition(to);
        return `M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`;
    };

    const DataPacket = ({
        connection,
        isAnimating,
    }: {
        connection: Connection;
        isAnimating: boolean;
    }) => {
        const fromPos = getNodePosition(connection.from);
        const toPos = getNodePosition(connection.to);

        if (prefersReducedMotion) {
            return null;
        }

        return (
            <motion.circle
                r="1.5"
                className="fill-primary"
                style={{ filter: "drop-shadow(0 0 3px currentColor)" }}
                initial={{ cx: fromPos.x, cy: fromPos.y, opacity: 0 }}
                animate={
                    isAnimating
                        ? {
                              cx: [fromPos.x, toPos.x],
                              cy: [fromPos.y, toPos.y],
                              opacity: [0, 1, 1, 0],
                          }
                        : { cx: fromPos.x, cy: fromPos.y, opacity: 0 }
                }
                transition={{
                    duration: 1.2,
                    delay: connection.delay,
                    repeat: isAnimating ? Infinity : 0,
                    repeatDelay: 5 - 1.2,
                    ease: "easeInOut",
                }}
            />
        );
    };

    return (
        <div
            ref={containerRef}
            className="w-full h-full"
            aria-label="Live system architecture diagram showing data flow between client, API, database, and queue components"
        >
            <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient
                        id="connectionGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop
                            offset="0%"
                            className="[stop-color:hsl(var(--primary)/0.2)]"
                        />
                        <stop
                            offset="50%"
                            className="[stop-color:hsl(var(--primary)/0.4)]"
                        />
                        <stop
                            offset="100%"
                            className="[stop-color:hsl(var(--primary)/0.2)]"
                        />
                    </linearGradient>
                </defs>

                {connections.map((conn, idx) => (
                    <path
                        key={idx}
                        d={createPath(conn.from, conn.to)}
                        className="stroke-border dark:stroke-border/50"
                        strokeWidth="0.3"
                        fill="none"
                    />
                ))}

                {!prefersReducedMotion &&
                    connections.map((conn, idx) => (
                        <DataPacket
                            key={idx}
                            connection={conn}
                            isAnimating={isVisible}
                        />
                    ))}

                {nodes.map((node) => (
                    <g key={node.id}>
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r="4"
                            className="fill-background stroke-primary dark:stroke-primary/80"
                            strokeWidth="0.5"
                        />
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r="2"
                            className="fill-primary dark:fill-primary/80"
                        />
                        <text
                            x={node.x}
                            y={node.y + 8}
                            textAnchor="middle"
                            className="text-[4px] fill-foreground font-medium"
                        >
                            {node.label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}
