import fs from "node:fs";
import path from "node:path";
import { headingId } from "@/lib/utils";

export type PostHeading = {
    id: string;
    text: string;
    level: 2 | 3;
};

function readPostSource(slug: string): string {
    return fs.readFileSync(
        path.join(process.cwd(), "posts", `${slug}.mdx`),
        "utf8",
    );
}

const WORDS_PER_MINUTE = 225;

export function getPostReadingMinutes(slug: string): number {
    const prose = readPostSource(slug)
        .replace(/^import .*$/gm, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
    const words = prose.split(/\s+/).filter((word) => /\w/.test(word)).length;
    return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function getPostHeadings(slug: string): PostHeading[] {
    const source = readPostSource(slug);
    const sourceWithoutCodeBlocks = source.replace(/^```[\s\S]*?^```/gm, "");

    return Array.from(
        sourceWithoutCodeBlocks.matchAll(/^(#{2,3})\s+(.+)$/gm),
        ([, hashes, rawText]) => {
            const text = rawText
                .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
                .replace(/`/g, "")
                .trim();
            return {
                id: headingId(text),
                text,
                level: hashes.length === 2 ? 2 : 3,
            };
        },
    );
}
