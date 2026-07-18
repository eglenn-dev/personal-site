import { cacheLife } from "next/cache";
import type { LanguageData, ContributionWeekday, CombinedStats } from "./types";

const MAX_ATTEMPTS = 3;
const RETRY_BASE_DELAY_MS = 500;

function getGitHubToken(): string {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        throw new Error(
            "GitHub token is required. Please set the GITHUB_TOKEN environment variable."
        );
    }
    return token;
}

function getHeaders() {
    const token = getGitHubToken();
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

const STATS_QUERY = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
            contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                    totalContributions
                    weeks {
                        contributionDays {
                            date
                            contributionCount
                        }
                    }
                }
            }
            repositories(first: 100, isFork: false, ownerAffiliations: OWNER) {
                nodes {
                    primaryLanguage {
                        name
                    }
                }
            }
        }
    }
`;

interface StatsQueryData {
    user: {
        contributionsCollection: {
            contributionCalendar: {
                totalContributions: number;
                weeks: {
                    contributionDays: {
                        date: string;
                        contributionCount: number;
                    }[];
                }[];
            };
        };
        repositories: {
            nodes: { primaryLanguage: { name: string } | null }[];
        };
    };
}

async function queryGitHub(variables: {
    username: string;
    from: string;
    to: string;
}): Promise<StatsQueryData> {
    let lastError: unknown;

    // GitHub's GraphQL API intermittently fails with transient errors such as
    // "Resource limits for this query exceeded", so retry with backoff.
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        if (attempt > 0) {
            await new Promise((resolve) =>
                setTimeout(resolve, RETRY_BASE_DELAY_MS * 2 ** (attempt - 1))
            );
        }

        try {
            const response = await fetch("https://api.github.com/graphql", {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({ query: STATS_QUERY, variables }),
            });

            if (!response.ok) {
                throw new Error(
                    `GitHub API error: ${response.status} ${response.statusText}`
                );
            }

            const json = await response.json();
            if (json.errors) {
                throw new Error(
                    `GitHub API error: ${json.errors[0]?.message || "Unknown error"}`
                );
            }

            return json.data;
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError;
}

export async function getCombinedGitHubStats(
    username: string
): Promise<CombinedStats | null> {
    "use cache";
    // Contribution stats change slowly, so revalidate hourly at most.
    cacheLife({ stale: 1800, revalidate: 3600, expire: 86400 });

    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        const from = oneYearAgo.toISOString();
        const to = new Date(
            today.getTime() + (24 * 60 * 60 * 1000 - 1)
        ).toISOString();

        const { user } = await queryGitHub({ username, from, to });
        return buildStats(user, today);
    } catch (error) {
        console.error("An error occurred in getCombinedGitHubStats:", error);
        // Only cache the failure for seconds so the next request retries,
        // instead of pinning an empty stats section for the full hour.
        cacheLife("seconds");
        return null;
    }
}

function buildStats(user: StatsQueryData["user"], today: Date): CombinedStats {
    const { contributionsCollection, repositories } = user;
    const { contributionCalendar } = contributionsCollection;

    const languages: LanguageData = repositories.nodes
        .map((repo) => repo.primaryLanguage)
        .filter((lang): lang is { name: string } => lang !== null)
        .reduce((acc: Record<string, number>, lang) => {
            acc[lang.name] = (acc[lang.name] || 0) + 1;
            return acc;
        }, {});

    let topLanguage: string | null = null;
    if (Object.keys(languages).length > 0) {
        topLanguage = Object.keys(languages).reduce((a, b) =>
            languages[a] > languages[b] ? a : b
        );
    }

    const rawDays = contributionCalendar.weeks.flatMap(
        (week) => week.contributionDays
    );

    const dayMap = new Map<string, ContributionWeekday>();
    rawDays.forEach((d) => {
        const key = d.date.substring(0, 10);
        dayMap.set(key, {
            date: key,
            contributionCount: d.contributionCount,
            weekday: new Date(`${key}T00:00:00Z`).getUTCDay(),
        });
    });

    const contributionHistory: ContributionWeekday[] = [];
    for (let i = 0; i < 365; i++) {
        const dt = new Date(today);
        dt.setUTCDate(today.getUTCDate() - i);
        const key = dt.toISOString().substring(0, 10);

        if (dayMap.has(key)) {
            contributionHistory.push(dayMap.get(key)!);
        } else {
            contributionHistory.push({
                date: key,
                contributionCount: 0,
                weekday: dt.getUTCDay(),
            });
        }
    }

    const oneMonthAgo = new Date(today);
    oneMonthAgo.setUTCDate(today.getUTCDate() - 29);

    const monthContributions = contributionHistory
        .filter((c) => {
            const day = new Date(c.date);
            return day >= oneMonthAgo && day <= today;
        })
        .reduce((sum, c) => sum + c.contributionCount, 0);

    return {
        yearContributions: contributionCalendar.totalContributions,
        monthContributions,
        mostUsedLanguages: languages,
        topLanguage,
        contributionHistory: contributionHistory.reverse(),
    };
}
