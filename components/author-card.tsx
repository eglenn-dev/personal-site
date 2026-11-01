"use client";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

export function AuthorCard() {
    return (
        <div className="glass flex w-fit flex-row items-center gap-2 rounded-full py-1 pr-4 pl-1 font-medium">
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
