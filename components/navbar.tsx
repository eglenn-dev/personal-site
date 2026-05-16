"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";

const navItems = [
    { href: "/projects", label: "Projects" },
    { href: "/experience", label: "Experience" },
    { href: "/blog", label: "Blog" },
];

export default function Navbar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();

    return (
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-display text-3xl leading-none"
                        aria-label="Home"
                    >
                        <span>Ethan Glenn</span>
                    </Link>
                    <ul className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const isActive =
                                pathname.split("/")[1] ===
                                item.href.split("/")[1];
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                            isActive
                                                ? "text-foreground bg-surface-2"
                                                : "text-muted-foreground hover:text-foreground"
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Open command palette"
                            className="hidden sm:inline-flex"
                            onClick={() => {
                                window.dispatchEvent(
                                    new KeyboardEvent("keydown", {
                                        key: "k",
                                        metaKey: true,
                                        bubbles: true,
                                    }),
                                );
                            }}
                        >
                            <Search className="h-5 w-5" />
                            <Kbd className="sr-only">⌘K</Kbd>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Toggle theme"
                            onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
                        >
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                        <Link
                            href="/contact"
                            className="hidden sm:inline-flex"
                        >
                            <Button variant="lime" size="sm">
                                Get in touch
                            </Button>
                        </Link>
                    </div>
                </div>
                <ul className="md:hidden flex items-center gap-1 pb-3 -mt-2 overflow-x-auto">
                    {navItems.map((item) => {
                        const isActive =
                            pathname.split("/")[1] === item.href.split("/")[1];
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                                        isActive
                                            ? "text-foreground bg-surface-2"
                                            : "text-muted-foreground hover:text-foreground"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
