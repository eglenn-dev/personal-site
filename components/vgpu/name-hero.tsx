"use client";
import { useEffect, useRef, useState } from "react";
import { createRenderer } from "./radiance-cascades/renderer";

/**
 * Radiance-cascades scene: the name is the emitter, and dragging paints extra
 * light that bounces off it.
 *
 * Bringing up WebGPU takes a moment -- adapter, name raster, shader compilation
 * -- so the heading holds the frame while that happens and hands over once the
 * first frame is ready, rather than leaving an empty panel and then popping.
 * The heading also sits underneath the canvas rather than over it, so it stays
 * in the document for crawlers and screen readers either way.
 *
 * If the scene cannot run at all -- an adapter that reports itself and then
 * refuses, a device lost mid-flight -- the heading simply settles instead of
 * pulsing forever, leaving the same gradient banner a browser without WebGPU
 * would have got.
 */
export default function NameHero({
    name,
    className,
}: {
    name: string;
    className?: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [status, setStatus] = useState<"loading" | "lit" | "failed">(
        "loading"
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        let live = true;
        const renderer = createRenderer({
            canvas,
            name,
            onError: (error) => {
                console.error("The radiance cascades hero could not run.", error);
                if (live) setStatus("failed");
            },
        });
        renderer.ready
            .then(() => {
                if (live) setStatus("lit");
            })
            .catch(() => {});

        return () => {
            live = false;
            renderer.dispose();
        };
    }, [name]);

    const lit = status === "lit";

    return (
        <div
            className={`bg-radial from-indigo-300/25 from-5% via-indigo-800/20 via-30% to-black to-70% ${className ?? ""}`}
        >
            {/* The pulse lives on the inner span: an animation driving opacity on
                the same element would fight the fade-out and snap it. */}
            <h1
                className={`absolute inset-0 flex items-center justify-center px-6 text-center text-4xl sm:text-6xl font-bold text-white transition-all duration-700 ease-out ${
                    lit ? "scale-110 opacity-0" : "scale-100 opacity-90"
                }`}
            >
                <span
                    className={
                        status === "loading" ? "motion-safe:animate-pulse" : ""
                    }
                >
                    {name}
                </span>
            </h1>
            <canvas
                ref={canvasRef}
                className={`relative block h-full w-full touch-none transition-opacity duration-500 ease-out ${
                    lit ? "opacity-100" : "opacity-0"
                }`}
            />
            <p
                className={`pointer-events-none absolute bottom-4 right-5 text-xs uppercase tracking-[.08em] text-white/40 transition-opacity duration-500 delay-300 ${
                    lit ? "opacity-100" : "opacity-0"
                }`}
            >
                Drag to paint light with WebGPU
            </p>
        </div>
    );
}
