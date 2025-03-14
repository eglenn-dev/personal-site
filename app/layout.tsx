import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Analytics from "@/components/analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Ethan Glenn",
    description: "Portfolio website showcasing my projects and experience",
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
                <Analytics />
            </body>
        </html>
    );
}
