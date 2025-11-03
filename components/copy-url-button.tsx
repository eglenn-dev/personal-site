"use client";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link as LinkIcon, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function CopyUrlButton() {
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    const onClickCopy = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
        }
    };

    return (
        <Tooltip open={isCopied}>
            <TooltipTrigger asChild>
                <Button
                    variant="outline"
                    className="h-8 w-8"
                    onClick={onClickCopy}
                >
                    <span className="sr-only">Copy URL</span>
                    {isCopied ? (
                        <Check className="h-4 w-4" />
                    ) : (
                        <LinkIcon className="h-4 w-4" />
                    )}
                </Button>
            </TooltipTrigger>
            <TooltipContent>Copied URL to clipboard!</TooltipContent>
        </Tooltip>
    );
}
