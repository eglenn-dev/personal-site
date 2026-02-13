"use client";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

export function AuthorCard() {
    return (
        <div className="flex flex-row gap-2 items-center w-fit py-1 px-2 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <Avatar className="w-8 h-8">
                <AvatarImage
                    src="https://github.com/eglenn-dev.png"
                    alt="Ethan Glenn"
                />
                <AvatarFallback>EG</AvatarFallback>
            </Avatar>
            Ethan Glenn
        </div>
    );
}
