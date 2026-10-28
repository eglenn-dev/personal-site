import fs from "node:fs";
import path from "node:path";
import { headingId } from "@/lib/utils";

export type PostHeading = {
    id: string;
    text: string;
    level: 2 | 3;
};

export function getPostHeadings(slug: string): PostHeading[] {
    const source = fs.readFileSync(
        path.join(process.cwd(), "posts", `${slug}.mdx`),
        "utf8",
    );
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
