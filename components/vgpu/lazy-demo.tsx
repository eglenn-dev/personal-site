"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Status = "idle" | "running" | "held" | "unsupported";

/**
 * Mounts a WebGPU demo only while it is near the viewport, so a page full of
 * them holds one or two live GPU contexts instead of all of them at once.
 */
export function LazyDemo({ children }: { children: ReactNode }) {
    const hostRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<Status>("idle");

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.some((entry) => entry.isIntersecting);
                setStatus((current) => {
                    if (current === "unsupported") return current;
                    if (!visible) return current === "running" ? "idle" : current;
                    if (!navigator.gpu) return "unsupported";
                    if (
                        current !== "held" &&
                        window.matchMedia("(prefers-reduced-motion: reduce)")
                            .matches
                    ) {
                        return "held";
                    }
                    return current === "held" ? "held" : "running";
                });
            },
            { rootMargin: "300px" }
        );

        observer.observe(host);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={hostRef} className="h-full w-full bg-black">
            {status === "running" && children}
            {status === "unsupported" && (
                <Notice>
                    This browser has no WebGPU support. Try Chrome, Edge, or
                    Safari 26.
                </Notice>
            )}
            {status === "held" && (
                <Notice>
                    <button
                        type="button"
                        onClick={() => setStatus("running")}
                        className="underline underline-offset-4"
                    >
                        Play animation
                    </button>
                    <span className="block mt-1 text-xs">
                        Held back because your system prefers reduced motion.
                    </span>
                </Notice>
            )}
        </div>
    );
}

function Notice({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-full w-full items-center justify-center p-6 text-center text-sm text-white/60">
            <p>{children}</p>
        </div>
    );
}
