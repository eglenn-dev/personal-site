"use client";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

export function AuthorCard() {
    return (
        <div className="flex flex-row gap-2 items-center w-fit py-1.5 px-2.5 bg-surface-2 rounded-full border border-border/40">
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
