import Link from "next/link";
import { Button } from "./ui/button";
import { HomeIcon } from "lucide-react";

export default function HomeButton() {
    return (
        <Link href="/" className="flex items-center gap-2">
            <Button variant="ghost">
                <HomeIcon className="h-8 w-8" />
                Return Home
            </Button>
        </Link>
    );
}
