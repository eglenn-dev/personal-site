import type { Metadata } from "next";
import { DuckGame } from "@/components/duck-game";

export const metadata: Metadata = {
    title: "Not Found",
    description: "We couldn't find the page you're looking for",
    robots: {
        index: false,
        follow: false,
    },
};

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] px-4 text-center">
            <h1 className="text-4xl font-bold mb-4 flex flex-col items-center justify-center gap-2">
                <span className="text-xl text-gray-400 sm:text-2xl">404</span>
                <span>Page Not Found</span>
            </h1>
            <p className="text-md sm:text-xl">
                The page you are looking for does not exist.
            </p>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
                While you&apos;re here, help the duck dodge some broken links.
            </p>
            <div className="flex w-full justify-center">
                <DuckGame />
            </div>
        </div>
    );
}
