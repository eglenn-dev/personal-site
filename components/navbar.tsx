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
    const { theme, setTheme } = useTheme();

    return (
        <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex gap-2 sm:gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                                    pathname.split("/")[1] ===
                                    item.href.split("/")[1]
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300"
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            aria-label="Open command palette"
                            className="hidden sm:flex items-center gap-2 text-muted-foreground hover:text-foreground"
                            onClick={() => {
                                window.dispatchEvent(
                                    new KeyboardEvent("keydown", {
                                        key: "k",
                                        metaKey: true,
                                        bubbles: true,
                                    })
                                );
                            }}
                        >
                            <Search className="h-4 w-4" />
                            <span className="text-sm">Search</span>
                            <Kbd>⌘K</Kbd>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Toggle theme"
                            className="transition-transform transform hover:scale-110"
                            onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
                        >
                            <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
