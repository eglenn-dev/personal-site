"use server";
import { getMostUsedLanguages } from "@/lib/get-github-stats";

interface LanguageData {
    [key: string]: number;
}

export async function GET() {
    const languages: LanguageData = await getMostUsedLanguages();

    if (!languages) {
        return new Response("Failed to fetch languages", {
            status: 500,
        });
    }

    delete languages["HTML"];

    return new Response(JSON.stringify(languages), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
