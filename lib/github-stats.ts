import type { LanguageData, ContributionWeekday, CombinedStats } from "./types";

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

export async function getCombinedGitHubStats(
    username: string
): Promise<CombinedStats | null> {
    try {
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        const fromYear = oneYearAgo.toISOString();
        const to = new Date(
            today.getTime() + (24 * 60 * 60 * 1000 - 1)
        ).toISOString();

        const query = `
            query($username: String!, $fromYear: DateTime!, $to: DateTime!) {
                user(login: $username) {
                    contributionsCollection(from: $fromYear, to: $to) {
                        contributionCalendar {
                            totalContributions
                            weeks {
                                contributionDays {
                                    date
                                    contributionCount
                                    weekday
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

        const variables = {
            username,
            fromYear,
            to,
        };

        const response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ query, variables }),
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error fetching combined GitHub stats:", errorData);
            throw new Error(`GitHub API error: ${response.statusText}`);
        }

        const json = await response.json();
        if (json.errors) {
            throw new Error(
                `GitHub API error: ${json.errors[0]?.message || "Unknown error"}`
            );
        }

        const { user } = json.data;
        const { contributionsCollection, repositories } = user;
        const { contributionCalendar } = contributionsCollection;

        const languages: LanguageData = repositories.nodes
            .map(
                (repo: { primaryLanguage: { name: string } | null }) =>
                    repo.primaryLanguage
            )
            .filter((lang: { name: string } | null) => lang !== null)
            .reduce((acc: Record<string, number>, lang: { name: string }) => {
                acc[lang.name] = (acc[lang.name] || 0) + 1;
                return acc;
            }, {});

        let topLanguage: string | null = null;
        if (Object.keys(languages).length > 0) {
            topLanguage = Object.keys(languages).reduce((a, b) =>
                languages[a] > languages[b] ? a : b
            );
        }

        const rawDays: ContributionWeekday[] =
            contributionCalendar.weeks.flatMap(
                (week: { contributionDays: ContributionWeekday[] }) =>
                    week.contributionDays
            );

        const dayMap = new Map<string, ContributionWeekday>();
        rawDays.forEach((d) => {
            const key = d.date.substring(0, 10);
            dayMap.set(key, {
                date: key,
                contributionCount: d.contributionCount,
                weekday: new Date(`${d.date}T00:00:00Z`).getUTCDay(),
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
            yearContributions:
                contributionCalendar.totalContributions,
            monthContributions,
            mostUsedLanguages: languages,
            topLanguage,
            contributionHistory: contributionHistory.reverse(),
        };
    } catch (error) {
        console.error("An error occurred in getCombinedGitHubStats:", error);
        return null;
    }
}
