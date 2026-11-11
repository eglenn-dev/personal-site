export const SITE_URL = "https://ethanglenn.dev";
export const CLEAN_SITE_URL = "ethanglenn.dev";
export const SITE_NAME = "Ethan Glenn";
export const SITE_DESCRIPTION =
    "Full Stack Engineer specializing in TypeScript, React, and Python. I create efficient, scalable web applications and have experience leading development teams.";
export const TWITTER_HANDLE = "@eglenn_dev";
export const JOB_TITLE = "Full Stack Engineer";
export const ORGANIZATION = "DataThink";
export const SOCIAL_LINKS = {
    github: "https://github.com/eglenn-dev",
    linkedin: "https://www.linkedin.com/in/eglenn-dev/",
    twitter: "https://x.com/eglenn_dev",
} as const;
export const RSS_PATH = "/rss.xml";
// Page-level `alternates` replace the root ones, so every page that sets a
// canonical URL spreads this in to keep the feed discoverable.
export const RSS_ALTERNATE = {
    "application/rss+xml": [{ url: RSS_PATH, title: `${SITE_NAME}'s Blog` }],
};
