import type { Metadata } from "next";
import { LazyDemo } from "@/components/vgpu/lazy-demo";
import BlackHole from "@/components/vgpu/black-hole";
import { Example as RaymarchedFractal } from "@/components/vgpu/raymarched-fractal";
import { Example as RadianceCascades } from "@/components/vgpu/radiance-cascades";
import { Example as Fluid } from "@/components/vgpu/fluid";
import { Example as NextjsFlare } from "@/components/vgpu/nextjs-flare";
import { Example as Clipping } from "@/components/vgpu/clipping";
import { Example as FftOceanSurface } from "@/components/vgpu/fft-ocean-surface";

export const metadata: Metadata = {
    title: "Shader Lab",
    description: "Comparing vgpu examples for the site hero.",
    robots: { index: false, follow: false },
};

interface Demo {
    id: string;
    title: string;
    blurb: string;
    rendering: "Continuous" | "On demand";
    files: number;
    interaction: string;
    demo: React.ReactNode;
}

const demos: Demo[] = [
    {
        id: "black-hole",
        title: "Black Hole",
        blurb: "Raymarched gravitational lensing with a Doppler-beamed accretion disk and an HDR bloom chain. Warm orange — the one palette outlier.",
        rendering: "Continuous",
        files: 7,
        interaction: "Drag to orbit",
        demo: <BlackHole className="h-full w-full" />,
    },
    {
        id: "raymarched-fractal",
        title: "Raymarched Fractal",
        blurb: "A Sierpinski tetrahedron on pure black under directional light and restrained bloom. Renders on interaction rather than in a loop, so it costs nothing while idle.",
        rendering: "On demand",
        files: 9,
        interaction: "Drag to orbit",
        demo: <RaymarchedFractal />,
    },
    {
        id: "radiance-cascades",
        title: "Radiance Cascades",
        blurb: "Now on the home page. Draw light with the pointer and watch it bounce: a jump-flooded distance field feeds six radiance cascades merged into 2D global illumination. The name in the middle is the emitter, replacing the original triangle.",
        rendering: "Continuous",
        files: 12,
        interaction: "Drag to paint light",
        demo: <RadianceCascades />,
    },
    {
        id: "fluid",
        title: "Interactive Fluid",
        blurb: "A pressure-projected Navier-Stokes solver with velocity advection and dye. The most playable of the set, and the dye palette is fully controllable.",
        rendering: "Continuous",
        files: 13,
        interaction: "Drag to stir",
        demo: <Fluid />,
    },
    {
        id: "nextjs-flare",
        title: "Next.js Flare",
        blurb: "A rim-lit glyph with volumetric scattering over a blue-noise-jittered ray walk. It rasterizes a logo at runtime, so the same technique works on your own mark or initials.",
        rendering: "Continuous",
        files: 9,
        interaction: "Move pointer to steer",
        demo: <NextjsFlare />,
    },
    {
        id: "clipping",
        title: "Clipping",
        blurb: "An animated icosphere sliced by a single signed-distance test, with a fitted disk revealing the cross-section. The smallest real animation here.",
        rendering: "Continuous",
        files: 4,
        interaction: "None",
        demo: <Clipping />,
    },
    {
        id: "fft-ocean-surface",
        title: "FFT Ocean Surface",
        blurb: "A Phillips spectrum evolving in frequency space through a shared-memory radix-2 IFFT, with per-pixel normals, foam, and a Fresnel sky reflection. The sunset is tunable toward blue.",
        rendering: "Continuous",
        files: 14,
        interaction: "Drag to orbit, panel to tune",
        demo: <FftOceanSurface />,
    },
];

export default function LabPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-2">Shader Lab</h1>
            <p className="text-muted-foreground mb-10">
                vgpu examples in contention for the site hero. Each one mounts
                as it scrolls into view and tears down as it leaves, so only a
                couple hold a live GPU context at a time.
            </p>
            <div className="flex flex-col gap-10">
                {demos.map((demo) => (
                    <DemoCard key={demo.id} {...demo} />
                ))}
            </div>
        </div>
    );
}

function DemoCard({
    title,
    blurb,
    rendering,
    files,
    interaction,
    demo,
}: Demo) {
    return (
        <section>
            <div className="flex flex-row flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-2">
                <h2 className="text-2xl font-semibold">{title}</h2>
                <p className="text-xs text-muted-foreground">
                    {rendering} &middot; {files} files &middot; {interaction}
                </p>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{blurb}</p>
            <div className="h-[420px] overflow-hidden rounded-2xl border">
                <LazyDemo>{demo}</LazyDemo>
            </div>
        </section>
    );
}
