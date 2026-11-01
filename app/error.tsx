"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function Error() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] px-4 text-center">
            <h1 className="mb-4 flex flex-col items-center justify-center gap-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                <span className="glass rounded-full px-4 py-1 text-base font-medium text-muted-foreground">500</span>
                <span>There was an error</span>
            </h1>
            <Image
                src="/duck.webp"
                alt="404 page duck"
                width={100}
                height={100}
                className="my-4 select-none pointer-events-none"
            />
            <p className="mb-6 text-lg text-muted-foreground">
                Sorry, something went wrong on our end.
            </p>
            <Link href="/">
                <Button size="lg">
                    <Home />
                    Return to Home
                </Button>
            </Link>
        </div>
    );
}
