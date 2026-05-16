"use client";

import { GithubIcon, LinkedInIcon, XIcon } from "@/lib/icons";
import Link from "next/link";

const linkCols = [
    {
        title: "Site",
        links: [
            { label: "Home", href: "/" },
            { label: "Projects", href: "/projects" },
            { label: "Experience", href: "/experience" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/contact" },
        ],
    },
    {
        title: "Elsewhere",
        links: [
            {
                label: "GitHub",
                href: "https://github.com/eglenn-dev",
                external: true,
            },
            {
                label: "LinkedIn",
                href: "https://linkedin.com/in/eglenn-dev",
                external: true,
            },
            {
                label: "X",
                href: "https://x.com/eglenn_dev",
                external: true,
            },
        ],
    },
];

export function Footer() {
    return (
        <footer className="bg-background pt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <div className="rounded-[2rem] bg-surface px-6 sm:px-12 lg:px-16 pt-12 pb-10 overflow-hidden relative">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">
                        <div className="md:col-span-7">
                            <h2 className="font-display text-5xl md:text-7xl leading-[0.95]">
                                Let&apos;s
                                <br />
                                build something.
                            </h2>
                            <div className="flex items-center gap-5 mt-8 text-muted-foreground">
                                <a
                                    href="https://github.com/eglenn-dev"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="GitHub Profile"
                                    className="hover:text-foreground transition-colors"
                                >
                                    <GithubIcon height={22} width={22} />
                                </a>
                                <a
                                    href="https://linkedin.com/in/eglenn-dev"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="LinkedIn Profile"
                                    className="hover:text-foreground transition-colors"
                                >
                                    <LinkedInIcon height={22} width={22} />
                                </a>
                                <a
                                    href="https://x.com/eglenn_dev"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="X Profile"
                                    className="hover:text-foreground transition-colors"
                                >
                                    <XIcon height={22} width={22} />
                                </a>
                            </div>
                        </div>
                        <div className="md:col-span-5 grid grid-cols-2 gap-6">
                            {linkCols.map((col) => (
                                <div key={col.title}>
                                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-4">
                                        {col.title}
                                    </p>
                                    <ul className="space-y-2.5">
                                        {col.links.map((link) => (
                                            <li key={link.href}>
                                                <Link
                                                    href={link.href}
                                                    target={
                                                        "external" in link &&
                                                        link.external
                                                            ? "_blank"
                                                            : undefined
                                                    }
                                                    className="text-sm text-foreground hover:text-lime transition-colors"
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-14 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <p className="text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} Ethan Glenn. All
                            rights reserved.
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Built with Next.js. Deployed on Vercel.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export function FooterSkeleton() {
    return (
        <footer className="bg-background pt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
                <div className="rounded-[2rem] bg-surface px-6 sm:px-12 lg:px-16 py-12 h-[420px] animate-pulse" />
            </div>
        </footer>
    );
}
