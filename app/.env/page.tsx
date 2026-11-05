import type { Metadata } from "next";
import HomeButton from "@/components/home-button";

export const metadata: Metadata = {
    title: ".env",
    description: "You really think I would do that?",
    robots: {
        index: false,
        follow: false,
    },
};

const FAKE_ENV = `# Top secret. Please don't tell anyone.
DATABASE_PASSWORD=hunter2
API_KEY=nice-try
AWS_SECRET_ACCESS_KEY=lol-no
ADMIN_PASSWORD=password123
WORTH_A_SHOT=true`;

export default function EnvPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] px-4 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] mb-4 flex flex-col items-center justify-center gap-2">
                <span className="text-base font-semibold tracking-normal text-brand">
                    .env
                </span>
                <span>You really think I would do that?</span>
            </h1>
            <p className="text-md sm:text-xl">
                Bold move, though. Respect.
            </p>
            <p className="text-sm text-muted-foreground mt-1 mb-6">
                Here are all my secrets. Spend them wisely.
            </p>
            <pre className="mb-6 w-full max-w-md overflow-x-auto rounded-xl border bg-muted/40 p-4 text-left font-mono text-sm leading-relaxed dark:bg-card">
                <code>{FAKE_ENV}</code>
            </pre>
            <HomeButton />
        </div>
    );
}
