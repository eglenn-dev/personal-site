interface LanguageData {
    [key: string]: number;
}

export async function getYearContributions(): Promise<number> {
    try {
        const now = new Date();
        const oneYearAgo = new Date(now);
        oneYearAgo.setFullYear(now.getFullYear() - 1);

        const query = `
            query($from: DateTime!, $to: DateTime!) {
                viewer {
                    contributionsCollection(from: $from, to: $to) {
                        contributionCalendar {
                            totalContributions
                        }
                    }
                }
            }
        `;

        const variables = {
            from: oneYearAgo.toISOString(),
            to: now.toISOString(),
        };

        const response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, variables }),
            next: { revalidate: 900 },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error fetching GitHub contributions:", errorData);
            return 0;
        }

        const data = await response.json();
        const totalContributions =
            data.data.viewer.contributionsCollection.contributionCalendar
                .totalContributions;

        return totalContributions;
    } catch (error) {
        console.error("An error occurred:", error);
        return 0;
    }
}

export async function getMonthContributions(): Promise<number> {
    try {
        const now = new Date();
        const oneMonthAgo = new Date(now);
        oneMonthAgo.setMonth(now.getMonth() - 1);

        const query = `
            query($from: DateTime!, $to: DateTime!) {
                viewer {
                    contributionsCollection(from: $from, to: $to) {
                        contributionCalendar {
                            totalContributions
                        }
                    }
                }
            }
        `;
        const variables = {
            from: oneMonthAgo.toISOString(),
            to: now.toISOString(),
        };
        const response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, variables }),
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error fetching GitHub contributions:", errorData);
            return 0;
        }

        const data = await response.json();
        const totalContributions =
            data.data.viewer.contributionsCollection.contributionCalendar
                .totalContributions;

        return totalContributions;
    } catch (error) {
        console.error("An error occurred:", error);
        return 0;
    }
}

export async function getMostUsedLanguages() {
    try {
        const query = `
            query {
                viewer {
                    repositories(first: 100, isFork: false) {
                        nodes {
                            primaryLanguage {
                                name
                            }
                        }
                    }
                }
            }
        `;

        const response = await fetch("https://api.github.com/graphql", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query }),
            next: { revalidate: 3600 },
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error fetching GitHub languages:", errorData);
            return null;
        }

        const data = await response.json();
        const languages = data.data.viewer.repositories.nodes
            .map(
                (repo: { primaryLanguage: { name: string } | null }) =>
                    repo.primaryLanguage
            )
            .filter((lang: { name: string } | null) => lang !== null)
            .reduce((acc: Record<string, number>, lang: { name: string }) => {
                acc[lang!.name] = (acc[lang!.name] || 0) + 1;
                return acc;
            }, {});

        return languages;
    } catch (error) {
        console.error("An error occurred:", error);
        return null;
    }
}

export async function getMostUsedLanguage() {
    const languages: LanguageData = await getMostUsedLanguages();

    const languageKeys = Object.keys(languages);
    if (languageKeys.length === 0) {
        return null;
    }

    let topLanguage = languageKeys[0];
    languageKeys.forEach((key) => {
        if (languages[key] > languages[topLanguage]) {
            topLanguage = key;
        }
    });

    return topLanguage;
}
