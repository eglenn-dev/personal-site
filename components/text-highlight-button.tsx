"use client";

import { useState, useEffect, useRef } from "react";
import { Link, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export function TextHighlightButton() {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [copied, setCopied] = useState(false);
    const [selectedText, setSelectedText] = useState("");
    const selectionRangeRef = useRef<Range | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const highlightTextFromUrl = () => {
            const hash = window.location.hash;
            if (!hash.includes(":~:text=")) return;

            const textFragment = hash.split(":~:text=")[1];
            if (!textFragment) return;

            const decodedText = decodeURIComponent(textFragment);
            const article = document.querySelector("article");
            if (!article) return;

            // Handle range format (start,end)
            let startText = decodedText;
            let endText = null;

            if (decodedText.includes(",")) {
                [startText, endText] = decodedText.split(",");
            }

            // Function to find text in the document
            const findTextRange = (text: string, isStart: boolean = true) => {
                const normalizedSearch = text.replace(/\s+/g, " ").trim();
                const walker = document.createTreeWalker(
                    article,
                    NodeFilter.SHOW_TEXT,
                    null
                );

                const textNodes: Text[] = [];
                let node;
                while ((node = walker.nextNode())) {
                    textNodes.push(node as Text);
                }

                // Combine all text to search through
                const fullText = textNodes.map((n) => n.textContent).join("");
                const normalizedFullText = fullText.replace(/\s+/g, " ");

                const index = normalizedFullText.indexOf(normalizedSearch);
                if (index === -1) return null;

                // Find which text nodes contain this range
                let charCount = 0;
                let startNode = null;
                let startOffset = 0;

                for (const textNode of textNodes) {
                    const nodeText = (textNode.textContent || "").replace(
                        /\s+/g,
                        " "
                    );
                    if (charCount + nodeText.length > index) {
                        startNode = textNode;
                        startOffset = index - charCount;
                        break;
                    }
                    charCount += nodeText.length;
                }

                return { node: startNode, offset: startOffset };
            };

            const startResult = findTextRange(startText, true);
            if (!startResult || !startResult.node) return;

            // Create a range for highlighting
            const range = document.createRange();
            range.setStart(startResult.node, startResult.offset);

            if (endText) {
                const endResult = findTextRange(endText, false);
                if (endResult && endResult.node) {
                    const endOffset =
                        endResult.offset + endText.replace(/\s+/g, " ").length;
                    range.setEnd(endResult.node, endOffset);
                } else {
                    range.setEnd(
                        startResult.node,
                        startResult.offset + startText.length
                    );
                }
            } else {
                range.setEnd(
                    startResult.node,
                    startResult.offset + startText.length
                );
            }

            // Highlight the range
            try {
                const mark = document.createElement("mark");
                mark.className = "text-highlight bg-yellow-200";
                range.surroundContents(mark);

                // Scroll to the highlighted text
                setTimeout(() => {
                    mark.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }, 100);
            } catch (error) {
                // If surroundContents fails (crosses element boundaries),
                // fall back to using Selection API
                const selection = window.getSelection();
                if (selection) {
                    selection.removeAllRanges();
                    selection.addRange(range);
                    range.startContainer.parentElement?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                    });
                }
            }
        };

        highlightTextFromUrl();

        const handleSelection = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            const selection = window.getSelection();
            const text = selection?.toString().trim() || "";

            if (text.length < 10) {
                setIsVisible(false);
                return;
            }

            timeoutRef.current = setTimeout(() => {
                if (selection && selection.rangeCount > 0) {
                    const range = selection.getRangeAt(0);
                    const rect = range.getBoundingClientRect();

                    const scrollTop =
                        window.pageYOffset ||
                        document.documentElement.scrollTop;
                    const scrollLeft =
                        window.pageXOffset ||
                        document.documentElement.scrollLeft;

                    const buttonWidth = 40;
                    let top = rect.top + scrollTop - 35;
                    let left =
                        rect.left +
                        scrollLeft +
                        rect.width / 2 -
                        buttonWidth / 2;

                    if (left < scrollLeft + 10) {
                        left = scrollLeft + 10;
                    }

                    const maxLeft =
                        scrollLeft + window.innerWidth - buttonWidth - 10;
                    if (left > maxLeft) {
                        left = maxLeft;
                    }

                    if (top < scrollTop + 10) {
                        top = rect.bottom + scrollTop + 10;
                    }

                    setPosition({ top, left });
                    setSelectedText(text);
                    selectionRangeRef.current = range.cloneRange();
                    setIsVisible(true);
                    setCopied(false);
                }
            }, 1000);
        };

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("[data-text-highlight-button]")) {
                return;
            }
            setIsVisible(false);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };

        document.addEventListener("mouseup", handleSelection);
        document.addEventListener("touchend", handleSelection);
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mouseup", handleSelection);
            document.removeEventListener("touchend", handleSelection);
            document.removeEventListener("mousedown", handleClickOutside);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
        };
    }, []);

    // Encode text for Text Fragment URLs
    // Text Fragments use '-' as syntax for prefix/suffix, so it must be encoded
    const textFragmentEncode = (text: string): string => {
        return encodeURIComponent(text)
            .replace(/-/g, "%2D") // Encode hyphens (reserved in Text Fragment syntax)
            .replace(/&/g, "%26"); // Encode ampersands for safety
    };

    // Expand selection to word boundaries
    const expandToWordBoundaries = (range: Range): string => {
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;
        const startOffset = range.startOffset;
        const endOffset = range.endOffset;

        // Get the text content of the containers
        const startText = startContainer.textContent || "";
        const endText = endContainer.textContent || "";

        // Find word boundary at start (go backwards)
        let expandedStartOffset = startOffset;
        while (expandedStartOffset > 0 && /\w/.test(startText[expandedStartOffset - 1])) {
            expandedStartOffset--;
        }

        // Find word boundary at end (go forwards)
        let expandedEndOffset = endOffset;
        while (expandedEndOffset < endText.length && /\w/.test(endText[expandedEndOffset])) {
            expandedEndOffset++;
        }

        // Create expanded range
        const expandedRange = range.cloneRange();
        expandedRange.setStart(startContainer, expandedStartOffset);
        expandedRange.setEnd(endContainer, expandedEndOffset);

        return expandedRange.toString();
    };

    const handleCopy = async () => {
        if (!selectedText || !selectionRangeRef.current) return;

        // Expand selection to word boundaries for the URL
        const expandedText = expandToWordBoundaries(selectionRangeRef.current);
        const normalizedText = expandedText.replace(/\s+/g, " ").trim();

        let textFragment;
        if (normalizedText.length > 300) {
            const words = normalizedText.split(" ");
            const startWords = words.slice(0, 5).join(" ");
            const endWords = words.slice(-5).join(" ");
            textFragment = `${textFragmentEncode(startWords)},${textFragmentEncode(endWords)}`;
        } else {
            textFragment = textFragmentEncode(normalizedText);
        }

        const url = `${window.location.origin}${window.location.pathname}#:~:text=${textFragment}`;

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);

            if (copyTimeoutRef.current) {
                clearTimeout(copyTimeoutRef.current);
            }
            copyTimeoutRef.current = setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error("Failed to copy to clipboard:", error);
        }
    };

    if (!isVisible) return null;

    return (
        <div
            data-text-highlight-button
            className="absolute z-50 transition-opacity duration-200"
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
            }}
        >
            <Tooltip open={copied ? true : undefined}>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="shadow-lg"
                    >
                        {copied ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Link className="h-4 w-4" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{copied ? "Link copied!" : "Copy link to this text"}</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
}
