"use client";
import { useEffect, useRef } from "react";
import { createRenderer } from "./radiance-cascades/renderer";

/**
 * Radiance-cascades scene: the name is the emitter, and dragging paints extra
 * light that bounces off it.
 *
 * The heading sits underneath the canvas rather than over it, so it stays in the
 * document for crawlers and screen readers; once WebGPU is running, the canvas
 * paints opaque black across it and the shader's own glyphs take over.
 *
 * This only mounts once the reveal has been asked for, so it starts rendering
 * straight away.
 */
export default function NameHero({
    name,
    className,
}: {
    name: string;
    className?: string;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (!navigator.gpu) return;

        const renderer = createRenderer({ canvas, name });
        renderer.ready.catch(() => {});

        return () => renderer.dispose();
    }, [name]);

    return (
        <div
            className={`bg-radial from-indigo-300/25 from-5% via-indigo-800/20 via-30% to-black to-70% ${className ?? ""}`}
        >
            <h1 className="absolute inset-0 flex items-center justify-center px-6 text-center text-4xl sm:text-6xl font-bold text-white">
                {name}
            </h1>
            <canvas
                ref={canvasRef}
                className="relative block h-full w-full touch-none"
            />
            <p className="pointer-events-none absolute bottom-4 right-5 text-xs uppercase tracking-[.08em] text-white/40">
                Drag to paint light
            </p>
        </div>
    );
}
