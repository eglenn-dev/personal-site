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
                className="glass mb-4 overflow-x-auto rounded-[20px] p-5 text-sm leading-relaxed [&_code]:bg-transparent [&_code]:p-0"
                {...props}
            />
            <Tooltip open={isCopied}>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon-sm"
                        className="absolute top-2.5 right-2.5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
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
