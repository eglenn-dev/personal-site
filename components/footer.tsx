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
        <footer className="border-t">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                        &copy; {year} Ethan Glenn
                    </p>
                    <div className="flex space-x-6 align-center items-center justify-center">
                        {socialLinks.map(({ name, href, Icon }) => (
                            <a
                                key={name}
                                href={href}
                                target="_blank"
                                className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:shadow-md hover:shadow-accent/50 rounded-full p-2"
                            >
                                <span className="sr-only">{name}</span>
                                <Icon />
                            </a>
                        ))}
                    </div>
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
