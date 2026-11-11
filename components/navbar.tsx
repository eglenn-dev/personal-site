"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, Search } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";

const navItems = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/experience", label: "Experience" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
];

export default function Navbar() {
    const pathname = usePathname();
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <nav aria-label="Main" className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-md supports-backdrop-filter:bg-background/75">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <div className="flex items-center gap-0.5 sm:gap-1">
                        {navItems.map((item) => {
                            const isActive =
                                pathname.split("/")[1] ===
                                item.href.split("/")[1];
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`inline-flex items-center rounded-md px-1.5 py-2.5 text-[13px] font-semibold transition-colors duration-150 sm:px-3 sm:py-1.5 ${
                                        isActive
                                            ? "bg-muted text-primary"
                                            : "text-muted-foreground hover:bg-muted/60 hover:text-primary"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="outline"
                            size="sm"
                            aria-label="Open command palette"
                            className="hidden sm:flex items-center gap-2 w-48 justify-start bg-muted/40 font-medium text-muted-foreground hover:text-foreground"
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
                            <Search className="h-4 w-4" />
                            <span className="text-sm">Search</span>
                            <Kbd className="ml-auto">⌘K</Kbd>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Toggle theme"
                            className="text-muted-foreground hover:text-primary"
                            onClick={() =>
                                setTheme(
                                    resolvedTheme === "dark" ? "light" : "dark",
                                )
                            }
                        >
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
