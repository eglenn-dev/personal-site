import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { Footer, FooterSkeleton } from "@/components/footer";
import { CommandPaletteProvider } from "@/components/command-palette-provider";
import GoogleAnalytics from "@/components/analytics";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PersonJsonLd, WebSiteJsonLd } from "@/components/json-ld";
import {
    SITE_URL,
    SITE_NAME,
    SITE_DESCRIPTION,
    TWITTER_HANDLE,
} from "@/lib/site-config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: SITE_NAME,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [
        "Ethan Glenn",
        "Full Stack Engineer",
        "Software Engineer",
        "Web Developer",
        "TypeScript",
        "React",
        "Python",
        "Next.js",
        "Portfolio",
    ],
    authors: [{ name: "Ethan Glenn", url: SITE_URL }],
    creator: "Ethan Glenn",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: SITE_URL,
        siteName: SITE_NAME,
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
    },
    twitter: {
        card: "summary",
        title: SITE_NAME,
        description: SITE_DESCRIPTION,
        creator: TWITTER_HANDLE,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    alternates: {
        canonical: SITE_URL,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <PersonJsonLd />
                <WebSiteJsonLd />
            </head>
            <body className={inter.className}>
                <NuqsAdapter>
                    <TooltipProvider delayDuration={400}>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            <div className="flex flex-col min-h-screen">
                                <Navbar />
                                <CommandPaletteProvider />
                                <main className="flex-grow">{children}</main>
                                <Suspense fallback={<FooterSkeleton />}>
                                    <Footer />
                                </Suspense>
                            </div>
                        </ThemeProvider>
                        <GoogleAnalytics />
                        <Analytics />
                        <SpeedInsights />
                        <Toaster richColors position="bottom-left" />
                    </TooltipProvider>
                </NuqsAdapter>
            </body>
        </html>
    );
}
