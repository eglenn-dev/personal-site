import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "404 Not Fount | Ethan Glenn",
    description: "We couldn't find the page you're looking for",
};

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-xl mb-8">
                The page you are looking for does not exist.
            </p>
            <Button asChild>
                <Link href="/">Return to Home</Link>
            </Button>
        </div>
    );
}
