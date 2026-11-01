"use client";

import { GithubIcon, LinkedInIcon, XIcon } from "@/lib/icons";

const socialLinks = [
    {
        name: "GitHub",
        href: "https://github.com/eglenn-dev",
        Icon: GithubIcon,
    },
    {
        name: "LinkedIn",
        href: "https://linkedin.com/in/eglenn-dev",
        Icon: LinkedInIcon,
    },
    {
        name: "X",
        href: "https://x.com/eglenn_dev",
        Icon: XIcon,
    },
];

function FooterContent({ year }: { year: string }) {
    return (
        <footer className="px-4 pt-16 pb-24 sm:px-6 md:pb-6 lg:px-8">
            <div className="glass mx-auto flex max-w-7xl items-center justify-between rounded-full py-1.5 pr-1.5 pl-5">
                <p className="text-sm text-muted-foreground">
                    &copy; {year} Ethan Glenn
                </p>
                <div className="flex items-center gap-1">
                    {socialLinks.map(({ name, href, Icon }) => (
                        <a
                            key={name}
                            href={href}
                            target="_blank"
                            className="flex size-10 items-center justify-center rounded-full text-muted-foreground transition-[background-color,color,transform] duration-300 hover:bg-foreground/6 hover:text-foreground active:scale-95"
                        >
                            <span className="sr-only">{name}</span>
                            <Icon />
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}

export function Footer() {
    return <FooterContent year={String(new Date().getFullYear())} />;
}

export function FooterSkeleton() {
    // This renders as the Suspense fallback, which is prerendered outside the
    // boundary and so cannot read the clock. NEXT_PUBLIC_BUILD_YEAR is inlined
    // at build time (see next.config.ts) to keep the two in sync.
    return <FooterContent year={process.env.NEXT_PUBLIC_BUILD_YEAR ?? ""} />;
}
