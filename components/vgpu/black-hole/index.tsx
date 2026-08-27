"use client";
import { useEffect, useRef } from "react";
import { createRenderer } from "./renderer";

/**
 * Raymarched black hole hero. The canvas paints over the gradient underneath
 * once WebGPU is up; where WebGPU is unavailable or motion is reduced, nothing
 * paints and the gradient stays visible on its own.
 */
export default function BlackHole({ className }: { className?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (!navigator.gpu) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        const renderer = createRenderer({ canvas });
        renderer.ready.catch(() => {});

        return () => renderer.dispose();
    }, []);

    return (
        <div
            aria-hidden="true"
            className={`bg-radial from-orange-300/40 from-5% via-orange-800/20 via-25% to-black to-60% ${className ?? ""}`}
        >
            <canvas ref={canvasRef} className="block h-full w-full touch-none" />
        </div>
    );
}
