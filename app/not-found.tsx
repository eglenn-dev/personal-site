import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "404 Not Fount | Ethan Glenn",
    description: "We couldn't find the page you're looking for",
};

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="text-xl mb-8">
                The page you are looking for does not exist.
            </p>
            <Image
                src="/duck.webp"
                alt="404 page duck"
                width={150}
                height={150}
                className="mb-8 select-none pointer-events-none"
            />
            <Link href="/">
                <Button>Return to Home</Button>
            </Link>
        </div>
    );
}
