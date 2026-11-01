"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Moon,
    Sun,
    Search,
    Home,
    FolderOpen,
    Briefcase,
    FileText,
    Mail,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/projects", label: "Projects", icon: FolderOpen },
    { href: "/experience", label: "Experience", icon: Briefcase },
    { href: "/blog", label: "Blog", icon: FileText },
    { href: "/contact", label: "Contact", icon: Mail },
];

export default function Navbar() {
    const pathname = usePathname();
    const { resolvedTheme, setTheme } = useTheme();
    const isActive = (href: string) =>
        pathname.split("/")[1] === href.split("/")[1];

    return (
        <>
            <header className="pointer-events-none sticky top-0 z-50 px-4 pt-3 sm:px-6 lg:px-8">
                <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-[1fr_auto_1fr]">
                    <Link
                        href="/"
                        className="glass-strong pointer-events-auto flex h-11 w-fit items-center rounded-full px-5 text-[15px] font-semibold tracking-tight transition-transform duration-300 active:scale-[0.97]"
                    >
                        Ethan Glenn
                    </Link>
                    <nav
                        aria-label="Main"
                        className="glass-strong pointer-events-auto hidden h-11 items-center gap-0.5 rounded-full p-1 md:flex"
                    >
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={
                                    isActive(item.href) ? "page" : undefined
                                }
                                className={cn(
                                    "flex h-full items-center rounded-full px-4 text-sm font-medium transition-[background-color,color,box-shadow] duration-300",
                                    isActive(item.href)
                                        ? "bg-foreground/8 text-foreground shadow-[inset_0_1px_0_0_var(--glass-highlight)]"
                                        : "text-muted-foreground hover:text-foreground",
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="glass-strong pointer-events-auto flex h-11 items-center gap-0.5 justify-self-end rounded-full p-1">
                        <Button
                            variant="ghost"
                            aria-label="Open command palette"
                            className="h-9 gap-2 px-2.5 text-muted-foreground hover:text-foreground lg:px-3"
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
                            <Search className="size-4" />
                            <span className="hidden text-sm lg:inline">
                                Search
                            </span>
                            <Kbd className="hidden lg:inline-flex">⌘K</Kbd>
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Toggle theme"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() =>
                                setTheme(
                                    resolvedTheme === "dark" ? "light" : "dark",
                                )
                            }
                        >
                            <Sun className="size-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute size-5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </div>
                </div>
            </header>
            <nav
                aria-label="Main"
                className="glass-strong fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex h-16 items-stretch rounded-full p-1.5 md:hidden"
            >
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={cn(
                            "flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-medium transition-[background-color,color] duration-300",
                            isActive(item.href)
                                ? "bg-foreground/8 text-primary"
                                : "text-muted-foreground",
                        )}
                    >
                        <item.icon className="size-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>
        </>
    );
}
