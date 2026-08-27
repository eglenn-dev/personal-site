"use client";
import { useEffect, useRef } from "react";
import { createRenderer } from "./radiance-cascades/renderer";

/**
 * Radiance-cascades hero: the name is lit inside the shader as an emitter, and
 * drag paints extra light into the scene.
 *
 * The heading sits underneath the canvas rather than over it. When WebGPU runs,
 * the canvas paints opaque black across it and the shader's own glyphs take
 * over; when it does not, the heading shows through on the gradient. Either way
 * the h1 stays in the document for crawlers and screen readers.
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
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const renderer = createRenderer({ canvas, name, controls: false });
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
        </div>
    );
}
