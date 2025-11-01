import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import { Footer, FooterSkeleton } from "@/components/footer";
import GoogleAnalytics from "@/components/analytics";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { Suspense } from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Ethan Glenn",
    description:
        "Full Stack Developer specializing in TypeScript, React, Next.js, and Python. I create efficient, scalable web applications and have experience leading development teams.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <NuqsAdapter>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <div className="flex flex-col min-h-screen">
                            <Navbar />
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
                </NuqsAdapter>
            </body>
        </html>
    );
}
