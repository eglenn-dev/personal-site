"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface CommandPaletteContextType {
    open: boolean;
    setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

const CommandPaletteContext = createContext<
    CommandPaletteContextType | undefined
>(undefined);

export function useCommandPalette() {
    const context = useContext(CommandPaletteContext);
    if (!context) {
        throw new Error(
            "useCommandPalette must be used within CommandPaletteContextProvider",
        );
    }
    return context;
}

export function CommandPaletteContextProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [open, setOpen] = useState(false);

    return (
        <CommandPaletteContext.Provider value={{ open, setOpen }}>
            {children}
        </CommandPaletteContext.Provider>
    );
}
