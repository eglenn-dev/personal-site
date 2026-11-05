// All player-facing copy and balance-independent metadata for Five Nines.

export type Traffic = "web" | "static" | "api" | "jobs";

export type NodeKind =
    | "client"
    | "ec2"
    | "rds"
    | "s3"
    | "lambda"
    | "dynamo"
    | "sqs"
    | "worker"
    | "alb";

export type ItemId =
    | "links"
    | "bridge"
    | "alb"
    | "asg"
    | "standby"
    | "cache"
    | "cdn"
    | "waf"
    | "tgw"
    | "dx";

export const TRAFFIC_LABEL: Record<Traffic, string> = {
    web: "Web requests",
    static: "Static assets",
    api: "API calls",
    jobs: "Background jobs",
};

export const KIND_INFO: Record<
    Exclude<NodeKind, "client" | "alb">,
    { label: string; blurb: string }
> = {
    ec2: {
        label: "EC2 web app",
        blurb: "Serves web requests, then needs its database.",
    },
    rds: {
        label: "RDS database",
        blurb: "Web requests finish here. Lives in one AZ unless you add a standby.",
    },
    s3: {
        label: "S3 bucket",
        blurb: "Serves static assets. Huge capacity, but it still needs a road.",
    },
    lambda: {
        label: "Lambda function",
        blurb: "Serves API calls, then needs DynamoDB.",
    },
    dynamo: {
        label: "DynamoDB table",
        blurb: "API calls finish here. Fast, but not infinite.",
    },
    sqs: {
        label: "SQS queue",
        blurb: "Accepts jobs instantly and holds them until a worker is free.",
    },
    worker: {
        label: "Worker fleet",
        blurb: "Pulls jobs from the queue. Jobs never drive home.",
    },
};

export type ItemInfo = {
    name: string;
    short: string;
    description: string;
    /** What the player does after selecting it from the toolbar. */
    placement: string;
};

export const ITEM_INFO: Record<ItemId, ItemInfo> = {
    links: {
        name: "Network Links",
        short: "Links",
        description:
            "More road. Every tile of network you draw uses one, and erasing refunds it.",
        placement: "Drag on the map to draw",
    },
    bridge: {
        name: "Cross-AZ Links",
        short: "Cross-AZ",
        description:
            "Lets a road cross an AZ boundary. Used automatically when you draw across one.",
        placement: "Used automatically when a road crosses an AZ boundary",
    },
    alb: {
        name: "Load Balancer",
        short: "ALB",
        description:
            "Clients send requests here first. It picks the least busy instance and skips dead ones. Without one, everybody hammers the closest server.",
        placement: "Tap a road tile that clients can reach",
    },
    asg: {
        name: "Auto Scaling",
        short: "Scale",
        description:
            "Adds an instance to a service, or a read replica to a database. More capacity, same address.",
        placement: "Tap a service or database",
    },
    standby: {
        name: "Multi-AZ Standby",
        short: "Standby",
        description:
            "A hot copy of your database in another AZ. It takes over a few seconds after the primary dies, if your apps can reach it.",
        placement: "Tap an empty spot in a different AZ, then connect it",
    },
    cache: {
        name: "ElastiCache",
        short: "Cache",
        description:
            "Half of the requests for this service skip the database entirely.",
        placement: "Tap an EC2 or Lambda service",
    },
    cdn: {
        name: "CloudFront",
        short: "CDN",
        description:
            "Most static requests get answered at the edge and never touch your roads.",
        placement: "Tap an S3 bucket",
    },
    waf: {
        name: "WAF",
        short: "WAF",
        description:
            "Attach it to a load balancer. Attack traffic dies there instead of eating your servers.",
        placement: "Tap a load balancer",
    },
    tgw: {
        name: "Transit Gateway",
        short: "Transit",
        description:
            "Turns a busy junction into a high-throughput interchange, so it stops being a bottleneck.",
        placement: "Tap a junction",
    },
    dx: {
        name: "Direct Connect",
        short: "Direct",
        description:
            "A very fast private link between two points, up to 10 tiles apart. It ignores everything underneath.",
        placement: "Tap the start, then tap the end",
    },
};

export const CARD_FLAVOR: Record<ItemId, string> = {
    links: "Just one more subnet.",
    bridge: "Your finance team will find out about the data transfer fees.",
    alb: "Because “round robin in your head” does not scale.",
    asg: "Solve the problem the traditional way: spend more money.",
    standby: "Sleep through the next outage. Theoretically.",
    cache: "Now you have two problems, but the graph looks better.",
    cdn: "Your cat photos, now closer to the cats.",
    waf: "A bouncer for your load balancer.",
    tgw: "A roundabout with an enterprise support plan.",
    dx: "No traffic. Very expensive. Feels incredible.",
};

export type Cause = "noroute" | "capacity" | "outage" | "ddos";

export type RunSummary = {
    served: number;
    sprints: number;
    durationSeconds: number;
    peakRps: number;
    outages: number;
    attacksBlocked: number;
    burn: Record<Cause, number>;
    timeline: string[];
};

export type Postmortem = {
    incident: string;
    headline: string;
    rootCause: string;
    timeline: string[];
    actionItems: string[];
    grade: string;
};

const ROOT_CAUSE: Record<
    Cause,
    { headline: string; detail: string; actions: string[] }
> = {
    noroute: {
        headline: "Users could not reach anything",
        detail: "Requests had nowhere to go. The most reliable system in the world is still down if nobody built a road to it.",
        actions: [
            "Connect clients to services before announcing the launch.",
            "Add “is it plugged in?” to the runbook.",
        ],
    },
    capacity: {
        headline: "Demand outgrew the architecture",
        detail: "Nothing technically broke. There were simply more requests than servers, roads and patience.",
        actions: [
            "Scale the bottleneck instead of the thing that was easiest to scale.",
            "Add a load balancer before the next launch, not during it.",
        ],
    },
    outage: {
        headline: "An Availability Zone failed and took the system with it",
        detail: "One AZ went down, as AZs do. Too much of the system was living in it at the time.",
        actions: [
            "Run every tier in more than one AZ.",
            "Give the database a standby, and a road to reach it.",
        ],
    },
    ddos: {
        headline: "Attack traffic got treated like customers",
        detail: "A botnet reached your servers and they served it very politely.",
        actions: [
            "Put a WAF on the load balancer.",
            "Stop reading the access logs for comfort.",
        ],
    },
};

const GRADES: Array<[number, string]> = [
    [0, "Intern. Revoke prod access (gently)."],
    [3, "Junior Engineer. Please keep the laptop."],
    [5, "Software Engineer. Your manager calls this a “learning opportunity.”"],
    [7, "Senior Engineer. You saw this coming and said so in a doc."],
    [10, "Staff Engineer. You did not fix it, but you aligned everyone."],
    [13, "Principal Engineer. People quote you in meetings you skipped."],
    [17, "Distinguished Engineer. The outage is now considered a feature."],
];

export function gradeFor(sprints: number): string {
    let grade = GRADES[0][1];
    for (const [min, label] of GRADES) {
        if (sprints >= min) grade = label;
    }
    return grade;
}

export function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}m ${String(s).padStart(2, "0")}s`;
}

export function buildPostmortem(run: RunSummary): Postmortem {
    let cause: Cause = "capacity";
    let worst = -1;
    for (const key of Object.keys(run.burn) as Cause[]) {
        if (run.burn[key] > worst) {
            worst = run.burn[key];
            cause = key;
        }
    }
    const info = ROOT_CAUSE[cause];
    const incident = `INC-${String(
        (run.served * 7 + run.sprints * 131 + 1000) % 10000,
    ).padStart(4, "0")}`;

    const actionItems = [...info.actions];
    if (run.outages === 0 && cause !== "outage") {
        actionItems.push("Enjoy never having survived an AZ outage.");
    } else {
        actionItems.push("Schedule a meeting to discuss this meeting.");
    }

    return {
        incident,
        headline: info.headline,
        rootCause: info.detail,
        timeline: [
            ...run.timeline.slice(-5),
            `T+${formatDuration(run.durationSeconds)}: Error budget hit zero. Pager stopped being polite.`,
        ],
        actionItems,
        grade: gradeFor(run.sprints),
    };
}

export function shareText(run: RunSummary, url: string): string {
    return [
        `I kept production up for ${formatDuration(run.durationSeconds)} in Five Nines.`,
        `${run.served.toLocaleString("en-US")} requests served, ${run.sprints} sprints.`,
        `Final title: ${gradeFor(run.sprints)}`,
        url,
    ].join("\n");
}
