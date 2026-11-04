"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

export function CodeBlock(props: React.ComponentProps<"pre">) {
    const [isCopied, setIsCopied] = useState(false);
    const preRef = useRef<HTMLPreElement>(null);

    useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => {
                setIsCopied(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    const onClickCopy = () => {
        const text = preRef.current?.textContent;
        if (text) {
            navigator.clipboard.writeText(text);
            setIsCopied(true);
        }
    };

    return (
        <div className="group relative">
            <pre
                ref={preRef}
                className="mb-4 overflow-x-auto rounded-xl border bg-muted/40 p-4 font-mono text-sm leading-relaxed dark:bg-card [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[length:inherit]"
                {...props}
            />
            <Tooltip open={isCopied}>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        className="absolute top-2 right-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={onClickCopy}
                    >
                        <span className="sr-only">Copy code</span>
                        {isCopied ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Copied!</TooltipContent>
            </Tooltip>
        </div>
    );
}
