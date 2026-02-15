import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

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
            <Image
                src="/duck.webp"
                alt="404 page duck"
                width={100}
                height={100}
                className="my-4 select-none pointer-events-none"
            />
            <p className="text-md sm:text-xl mb-8">
                The page you are looking for does not exist.
            </p>
            <Link href="/">
                <Button>
                    <Home className="mr-1" />
                    Return to Home
                </Button>
            </Link>
        </div>
    );
}
