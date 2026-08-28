"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import NameHero from "./name-hero";

/**
 * The home page reads as it always has until someone clicks the name, at which
 * point the radiance-cascades band opens above the intro and the name moves
 * into it as the scene's light source.
 *
 * State is shared through context because the two halves sit in different parts
 * of the page: the band above the grid, the heading inside its first column.
 */
const RevealContext = createContext<{
    active: boolean;
    activate: () => void;
    name: string;
} | null>(null);

function useReveal() {
    const value = useContext(RevealContext);
    if (!value) {
        throw new Error("Hero reveal parts must be rendered inside HeroReveal.");
    }
    return value;
}

export function HeroReveal({
    name,
    children,
}: {
    name: string;
    children: ReactNode;
}) {
    const [active, setActive] = useState(false);

    // WebGPU is checked here so the egg never opens onto a canvas that cannot
    // draw. Reduced motion is not: it suppresses motion nobody asked for, and
    // clicking is asking for it.
    const activate = () => {
        if (navigator.gpu) setActive(true);
    };

    return (
        <RevealContext.Provider value={{ active, activate, name }}>
            {children}
        </RevealContext.Provider>
    );
}

/** The scene, once opened. Renders nothing until then. */
export function HeroBand() {
    const { active, name } = useReveal();
    if (!active) return null;

    return (
        <div className="relative h-80 sm:h-[26rem] mb-12 overflow-hidden rounded-2xl">
            <NameHero name={name} className="absolute inset-0 h-full w-full" />
        </div>
    );
}

/**
 * The heading, until the scene takes it over. Exactly one h1 is on the page in
 * either state: this one, or the one inside the band.
 */
export function HeroName() {
    const { active, activate, name } = useReveal();
    if (active) return null;

    return (
        <h1 className="text-4xl font-bold">
            <button
                type="button"
                onClick={activate}
                title="Turn on the light"
                className="cursor-pointer rounded-lg outline-none transition duration-500 hover:text-indigo-100 hover:[filter:drop-shadow(0_0_10px_var(--color-indigo-400))_drop-shadow(0_0_34px_var(--color-indigo-500))] focus-visible:text-indigo-100 focus-visible:[filter:drop-shadow(0_0_10px_var(--color-indigo-400))_drop-shadow(0_0_34px_var(--color-indigo-500))]"
            >
                {name}
            </button>
        </h1>
    );
}
