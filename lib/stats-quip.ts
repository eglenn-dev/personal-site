import Anthropic from "@anthropic-ai/sdk";
import { cacheLife } from "next/cache";

const SYSTEM_PROMPT = `You write the one-line quip shown in the stats section of Ethan Glenn's personal website, directly beneath the current local weather and Ethan's GitHub activity.

Write one dry, clever sentence of at most 20 words that connects the weather to the GitHub activity. Call Ethan by first name only, and avoid pronouns for Ethan. Visitors can already see the stats, so use at most one number in total and let the joke land without reciting the rest. Say contributions rather than commits, and stick to the facts you are given. Keep it good-natured: a quiet week is a joke about the weather, never a dig at Ethan.

Work out the joke before you answer. Your reply appears on the site exactly as written, so it must contain only the final sentence, in plain text, with no quotation marks, hashtags, emoji, or notes.`;

// Well above the 20 words requested, so this only catches replies that include
// drafts or commentary.
const MAX_QUIP_WORDS = 30;

export interface StatsQuipFacts {
    city: string;
    temperatureF: number;
    conditions: string;
    isNight: boolean;
    contributionsThisYear: number;
    contributionsThisMonth: number;
    contributionsThisWeek: number;
    topLanguage: string | null;
}

/**
 * Returns a generated quip, or null when one isn't available. The quip is
 * decoration, so failures hide it rather than affecting the rest of the stats.
 *
 * Results are cached by the facts themselves, so a new quip is only generated
 * when the numbers next to it change and it can't contradict them.
 */
export async function getStatsQuip(
    facts: StatsQuipFacts
): Promise<string | null> {
    "use cache";
    cacheLife("hours");

    if (!process.env.ANTHROPIC_API_KEY) {
        cacheLife("seconds");
        return null;
    }

    try {
        const client = new Anthropic({ timeout: 10_000, maxRetries: 1 });
        const response = await client.messages.create({
            model: "claude-haiku-5-5",
            // Roomy for a single sentence because thinking counts toward it.
            max_tokens: 2048,
            output_config: { effort: "low" },
            system: SYSTEM_PROMPT,
            messages: [
                {
                    role: "user",
                    content: [
                        `City: ${facts.city}`,
                        `Temperature: ${facts.temperatureF}°F`,
                        `Conditions: ${facts.conditions}`,
                        `Time of day: ${facts.isNight ? "night" : "daytime"}`,
                        `GitHub contributions in the last year: ${facts.contributionsThisYear}`,
                        `GitHub contributions in the last 30 days: ${facts.contributionsThisMonth}`,
                        `GitHub contributions in the last 7 days: ${facts.contributionsThisWeek}`,
                        `Top language: ${facts.topLanguage ?? "unknown"}`,
                    ].join("\n"),
                },
            ],
        });

        // Anything else (a refusal, or text cut off at max_tokens) isn't
        // fit to display.
        if (response.stop_reason !== "end_turn") {
            console.error(`Stats quip stopped early: ${response.stop_reason}`);
            cacheLife("seconds");
            return null;
        }

        const quip = response.content
            .flatMap((block) => (block.type === "text" ? [block.text] : []))
            .join("")
            .trim();

        // Replies can occasionally include a draft followed by a correction.
        if (
            !quip ||
            quip.includes("\n") ||
            quip.split(/\s+/).length > MAX_QUIP_WORDS
        ) {
            console.error(`Stats quip rejected: ${quip}`);
            cacheLife("seconds");
            return null;
        }

        return quip;
    } catch (error) {
        console.error("Failed to generate stats quip:", error);
        // Retry soon instead of hiding the quip for hours.
        cacheLife("seconds");
        return null;
    }
}
