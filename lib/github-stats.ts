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
        const now = new Date();
        const to = now.toISOString();

        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        const fromYear = oneYearAgo.toISOString();

        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);
        const fromMonth = oneMonthAgo.toISOString();

        // Rolling 60-day window
        const sixtyDaysAgo = new Date(now);
        sixtyDaysAgo.setDate(now.getDate() - 60);
        const from60Days = sixtyDaysAgo.toISOString();

        const query = `
            query($username: String!, $fromYear: DateTime!, $fromMonth: DateTime!, $from60Days: DateTime!, $to: DateTime!) {
              viewer {
                # Alias for yearly contributions
                yearContributions: contributionsCollection(from: $fromYear, to: $to) {
                  contributionCalendar {
                    totalContributions
                  }
                }
                # Alias for monthly contributions
                monthContributions: contributionsCollection(from: $fromMonth, to: $to) {
                  contributionCalendar {
                    totalContributions
                  }
                }
                # Repositories for language stats
                repositories(first: 100, isFork: false, ownerAffiliations: OWNER) {
                  nodes {
                    primaryLanguage {
                      name
                    }
                  }
                }
              }
              user(login: $username) {
                # Alias for last 60 days contributions
                last60DaysContributions: contributionsCollection(from: $from60Days, to: $to) {
                  contributionCalendar {
                    weeks {
                      contributionDays {
                        date
                        contributionCount
                        weekday
                      }
                    }
                  }
                }
              }
            }
        `;

        const variables = {
            username,
            fromYear,
            fromMonth,
            from60Days,
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

        const { viewer, user } = json.data;

        // Process language data
        const languages: LanguageData = viewer.repositories.nodes
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
            user.last60DaysContributions.contributionCalendar.weeks
                .flatMap(
                    (week: { contributionDays: ContributionWeekday[] }) =>
                        week.contributionDays
                )
                .map((day: ContributionWeekday) => ({
                    date: day.date,
                    contributionCount: day.contributionCount,
                    weekday: day.weekday,
                }));

        // Build an exact rolling 60 day window inclusive of 'today'
        const todayUTC = new Date();
        const endUTC = new Date(
            Date.UTC(
                todayUTC.getUTCFullYear(),
                todayUTC.getUTCMonth(),
                todayUTC.getUTCDate()
            )
        );
        const startUTC = new Date(endUTC);
        startUTC.setUTCDate(endUTC.getUTCDate() - 59); // 60 days including today

        // Index raw days by yyyy-mm-dd for quick lookup (truncate to date part)
        const dayMap = new Map<string, ContributionWeekday>();
        rawDays.forEach((d) => {
            const key = d.date.substring(0, 10);
            dayMap.set(key, {
                date: key,
                contributionCount: d.contributionCount,
                weekday: new Date(d.date).getUTCDay(),
            });
        });

        const last60DaysContributions: ContributionWeekday[] = [];
        for (
            let dt = new Date(startUTC);
            dt <= endUTC;
            dt.setUTCDate(dt.getUTCDate() + 1)
        ) {
            const key = dt.toISOString().substring(0, 10);
            if (dayMap.has(key)) {
                last60DaysContributions.push(dayMap.get(key)!);
            } else {
                last60DaysContributions.push({
                    date: key,
                    contributionCount: 0,
                    weekday: dt.getUTCDay(),
                });
            }
        }

        return {
            yearContributions:
                viewer.yearContributions.contributionCalendar
                    .totalContributions,
            monthContributions:
                viewer.monthContributions.contributionCalendar
                    .totalContributions,
            mostUsedLanguages: languages,
            topLanguage,
            last60DaysContributions,
        };
    } catch (error) {
        console.error("An error occurred in getCombinedGitHubStats:", error);
        return null;
    }
}
