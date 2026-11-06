import type { Metadata } from "next";
import { FiveNinesGame } from "./five-nines-game";

const TITLE = "Five Nines";
const DESCRIPTION =
    "A traffic game about keeping production up. Draw the network, add load balancers, survive AZ outages, and try not to burn your error budget.";
const OG_IMAGE = `/og?title=${encodeURIComponent(TITLE)}&description=${encodeURIComponent(
    "A traffic game about keeping production up",
)}`;

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: "/five-nines",
        type: "website",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Five Nines | Ethan Glenn",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Five Nines | Ethan Glenn",
        description: DESCRIPTION,
        images: [OG_IMAGE],
    },
    alternates: {
        canonical: "/five-nines",
    },
};

const GLOSSARY: Array<{ game: string; real: string }> = [
    {
        game: "Clients only use their closest server",
        real: "Without a load balancer, nothing spreads traffic or notices a dead instance. An ALB routes by least outstanding requests and skips unhealthy targets.",
    },
    {
        game: "Dead servers keep getting traffic for 10 seconds",
        real: "That's a stale DNS record. Clients behind a health-checked load balancer move on immediately.",
    },
    {
        game: "Rivers cost a special link to cross",
        real: "Availability Zones are separate failure domains, and crossing between them is a deliberate design choice (and a line on your bill).",
    },
    {
        game: "S3 and Lambda shrug off an AZ outage, but EC2 doesn't",
        real: "Regional services span AZs for you. Anything you run on your own instances is your problem to spread out.",
    },
    {
        game: "Standby databases need their own road",
        real: "Multi-AZ failover only helps if your application can actually reach the database it fails over to.",
    },
    {
        game: "Jobs leave users immediately",
        real: "A queue acknowledges work right away and lets workers catch up, which hides problems until the queue fills up.",
    },
    {
        game: "A bigger server doesn't fix a jammed road",
        real: "Bottlenecks move. Scaling one tier just reveals the next one.",
    },
];

export default function FiveNinesPage() {
    return (
        <>
            <FiveNinesGame />
            <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl font-bold tracking-tight">
                    Why the rules work this way
                </h2>
                <p className="mt-3 text-muted-foreground">
                    Five Nines looks like a city traffic game, but the rules come
                    from how real systems fail. Requests physically queue on
                    roads, so jams appear on their own instead of being scripted.
                </p>
                <dl className="mt-6 space-y-5">
                    {GLOSSARY.map((entry) => (
                        <div key={entry.game}>
                            <dt className="font-semibold">{entry.game}</dt>
                            <dd className="mt-1 text-sm text-muted-foreground">
                                {entry.real}
                            </dd>
                        </div>
                    ))}
                </dl>
                <p className="mt-8 text-sm text-muted-foreground">
                    Inspired by the wonderful{" "}
                    <a
                        href="https://dinopoloclub.com/games/mini-motorways/"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-foreground underline underline-offset-4"
                    >
                        Mini Motorways
                    </a>
                    . Five Nines is an unofficial fan project and isn&apos;t
                    affiliated with Dinosaur Polo Club or Amazon Web Services.
                </p>
            </section>
        </>
    );
}
