import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import GoogleAnalytics from "@/components/analytics";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getJsonLdData } from "@/lib/data";
import { Toaster } from "@/components/ui/sonner";

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
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div className="flex flex-col min-h-screen">
                        <Navbar />
                        <main className="flex-grow">{children}</main>
                        <Footer />
                    </div>
                </ThemeProvider>
                <GoogleAnalytics />
                <Analytics />
                <SpeedInsights />
                <script
                    type="application/ld+json"
                    key="product-jsonld"
                    dangerouslySetInnerHTML={{ __html: getJsonLdData() }}
                ></script>
                <Toaster richColors position="bottom-left" />
            </body>
        </html>
    );
}
