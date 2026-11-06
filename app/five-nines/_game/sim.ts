// The Five Nines simulation. Contains no DOM code, so it can run headless.
//
// The world is a grid of cells. Players draw undirected links between adjacent
// cells; each link holds one lane per direction. Requests ("cars") drive those
// lanes, queue behind each other, and wait at junctions and full services, so
// traffic jams come out of the rules rather than being scripted.
//
// Memory is bounded on purpose: cars come from a fixed pool, lanes are reused,
// and node slots are recycled, so a run can last for hours without growing.

import {
    ITEM_INFO,
    type Cause,
    type ItemId,
    type NodeKind,
    type RunSummary,
    type Traffic,
} from "./content";

export const SIM_DT = 1 / 30;

const SQ2 = Math.SQRT2;
const DX = [1, 1, 0, -1, -1, -1, 0, 1] as const;
const DY = [0, 1, 1, 1, 0, -1, -1, -1] as const;

export const CAR_SPEED = 3.4;
const CAR_GAP = 0.44;
const MAX_CARS = 320;
const MAX_ATTACK_CARS = 44;
const MAX_CLIENTS = 34;
const MAX_SERVICES = 22;
const MAX_INSTANCES = 6;
export const PENDING_CAP = 10;
const SPRINT_SECONDS = 45;
const JUNCTION_SECONDS = 0.16;
const INTERCHANGE_SECONDS = 0.035;
const OVERTAKE_AFTER = 6;
const NO_ROUTE_DROP_AFTER = 4;
const DNS_TTL = 10;
const FAILOVER_SECONDS = 5;
const DEPENDENCY_GRACE = 22;
const BURN_PER_BREACH = 0.7;
const BURN_TIER_DOWN = 1.5;
const BURN_PER_STALE_CAR = 0.1;
const BURN_MAX_STALE = 1.2;
const BURN_PER_ATTACK_HIT = 0.22;
const MAX_BURN = 6;
const REGEN = 0.4;
const REGEN_DELAY = 6;
const DX_MAX_LENGTH = 10;
const DX_SPEED = 2.6;

type ServiceKind = Exclude<NodeKind, "client" | "alb">;

const SERVICE_STATS: Record<
    ServiceKind,
    { traffic: Traffic; slots: number; seconds: number }
> = {
    ec2: { traffic: "web", slots: 2, seconds: 1.5 },
    rds: { traffic: "web", slots: 2, seconds: 0.8 },
    s3: { traffic: "static", slots: 4, seconds: 0.5 },
    lambda: { traffic: "api", slots: 2, seconds: 1.3 },
    dynamo: { traffic: "api", slots: 3, seconds: 0.6 },
    sqs: { traffic: "jobs", slots: 10, seconds: 0.25 },
    worker: { traffic: "jobs", slots: 2, seconds: 1.8 },
};

const ROUTES: Record<Traffic, readonly ServiceKind[]> = {
    web: ["ec2", "rds"],
    static: ["s3"],
    api: ["lambda", "dynamo"],
    jobs: ["sqs", "worker"],
};

const BASE_RATE: Record<Traffic, number> = {
    web: 0.22,
    static: 0.26,
    api: 0.24,
    jobs: 0.2,
};

/**
 * S3, DynamoDB, SQS and Lambda are regional services, so an AZ failing doesn't
 * take them down. Anything running on your own instances is on you.
 */
export function isZonal(kind: NodeKind) {
    return kind === "ec2" || kind === "rds" || kind === "worker";
}

const CACHE_HIT = 0.5;
const CDN_HIT = 0.7;

export type CarType = Traffic | "attack";

export type Lane = {
    from: number;
    to: number;
    /** World position of the centre of the `from` cell. */
    fx: number;
    fy: number;
    len: number;
    speed: number;
    dirX: number;
    dirY: number;
    cars: Car[];
};

export type Car = {
    type: CarType;
    /** Owning client node, or -1 once a job has been acknowledged. */
    home: number;
    hop: number;
    returning: boolean;
    target: number;
    viaAlb: boolean;
    lane: Lane | null;
    s: number;
    inNode: number;
    timer: number;
    wait: number;
    noRoute: number;
    index: number;
    // Smoothed world position, owned by the renderer.
    vx: number;
    vy: number;
    hx: number;
    hy: number;
    fresh: boolean;
};

export type SimNode = {
    id: number;
    gone: boolean;
    kind: NodeKind;
    traffic: Traffic | null;
    name: string;
    x: number;
    y: number;
    size: number;
    zone: number;
    // Client state
    rate: number;
    accum: number;
    attackAccum: number;
    pending: number;
    inflight: number;
    breach: boolean;
    happy: number;
    // Service state
    instances: number;
    slots: Car[];
    incoming: number;
    dead: boolean;
    deadAt: number;
    deadUntil: number;
    cache: boolean;
    cdn: boolean;
    waf: boolean;
    role: "primary" | "standby" | null;
    peer: number;
    blocked: boolean;
    problem: string | null;
    bornAt: number;
};

export type DxLink = {
    a: number;
    b: number;
    laneAB: Lane;
    laneBA: Lane;
};

export type Banner = {
    title: string;
    detail: string;
    tone: "info" | "warn" | "danger" | "good";
    until: number;
};

export type Fx = {
    type:
        | "ripple-served"
        | "ripple-block"
        | "ripple-place"
        | "sound-place"
        | "sound-erase"
        | "sound-deny"
        | "sound-alarm"
        | "sound-good"
        | "sound-over";
    x: number;
    y: number;
    color: CarType | "neutral";
};

export type CardOption = {
    item: ItemId;
    amount: number;
};

export type Choice = {
    sprint: number;
    bonusLinks: number;
    bonusBridges: number;
    options: [CardOption, CardOption];
};

export type Phase = "ready" | "playing" | "choosing" | "over";

export type LinkResult =
    | "ok"
    | "noop"
    | "blocked"
    | "no-links"
    | "no-bridges"
    | "out-of-bounds";

export type Bounds = { x0: number; y0: number; x1: number; y1: number };

export type Inventory = Record<ItemId, number>;

type PlanEntry = { at: number; run: () => void };

function mulberry32(seed: number) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/** A small reusable min-heap, used by every distance field computation. */
class CellHeap {
    private cells: number[] = [];
    private keys: number[] = [];
    private size = 0;

    clear() {
        this.size = 0;
    }

    get empty() {
        return this.size === 0;
    }

    /** Key of the entry the next pop() will return. */
    topKey() {
        return this.keys[0];
    }

    push(cell: number, key: number) {
        let i = this.size++;
        while (i > 0) {
            const parent = (i - 1) >> 1;
            if (this.keys[parent] <= key) break;
            this.keys[i] = this.keys[parent];
            this.cells[i] = this.cells[parent];
            i = parent;
        }
        this.keys[i] = key;
        this.cells[i] = cell;
    }

    pop(): number {
        const top = this.cells[0];
        const n = --this.size;
        if (n > 0) {
            const key = this.keys[n];
            const cell = this.cells[n];
            let i = 0;
            for (;;) {
                let child = 2 * i + 1;
                if (child >= n) break;
                if (child + 1 < n && this.keys[child + 1] < this.keys[child]) {
                    child += 1;
                }
                if (this.keys[child] >= key) break;
                this.keys[i] = this.keys[child];
                this.cells[i] = this.cells[child];
                i = child;
            }
            this.keys[i] = key;
            this.cells[i] = cell;
        }
        return top;
    }
}

export class Sim {
    readonly W: number;
    readonly H: number;
    /** True when the AZ boundaries run along columns (landscape maps). */
    readonly vertical: boolean;
    readonly terrain: Uint8Array;
    readonly zone: Int8Array;
    readonly nodeAt: Int16Array;
    readonly albAt: Int16Array;
    readonly road: Uint8Array;
    readonly conn: Uint8Array;
    readonly deg: Uint8Array;
    readonly tgw: Uint8Array;
    readonly dxAt: Int16Array;
    private readonly lockUntil: Float64Array;
    private readonly lanes: Array<Lane | null>;
    private readonly dirOffset: number[];
    private readonly heap = new CellHeap();

    nodes: SimNode[] = [];
    dx: Array<DxLink | null> = [];
    cars: Car[] = [];
    private carPool: Car[] = [];
    private fields: Array<Float32Array | null> = [];
    private fieldVersion: number[] = [];

    /** Bumped whenever the road network changes. */
    graphVersion = 1;
    /** Bumped whenever anything baked into the static render layer changes. */
    staticVersion = 1;

    phase: Phase = "ready";
    clockStarted = false;
    time = 0;
    sprint = 0;
    sprintTime = 0;
    readonly sprintLength = SPRINT_SECONDS;
    budget = 100;
    served = 0;
    private servedThisWindow = 0;
    private windowTime = 0;
    rps = 0;
    peakRps = 0;
    private plan: PlanEntry[] = [];
    private lastBreachAt = -100;
    private graceUntil: Partial<Record<ServiceKind, number>> = {};

    inv: Inventory = {
        links: 34,
        bridge: 3,
        alb: 0,
        asg: 0,
        standby: 0,
        cache: 0,
        cdn: 0,
        waf: 0,
        tgw: 0,
        dx: 0,
    };

    bounds: Bounds;
    choice: Choice | null = null;
    banner: Banner | null = null;
    advice: string | null = null;
    /** Node pairs that still need a route, drawn as dashed guides. */
    hints: Array<{ from: number; to: number }> = [];
    fx: Fx[] = [];
    breachCount = 0;
    burnRate = 0;

    outage: {
        zone: number;
        phase: "warn" | "active";
        endsAt: number;
        duration: number;
    } | null = null;
    attackUntil = 0;
    spikeUntil = 0;

    private staleCars = 0;
    private outagesSurvived = 0;
    private attacksBlocked = 0;
    private burn: Record<Cause, number> = {
        noroute: 0,
        capacity: 0,
        outage: 0,
        ddos: 0,
    };
    private timeline: string[] = [];
    private offered = new Set<ItemId>();
    private adviceClock = 0;
    private kindCount: Partial<Record<NodeKind, number>> = {};
    private clientCount = 0;
    private serviceCount = 0;
    private readonly rng: () => number;

    constructor(W: number, H: number, seed = (Date.now() ^ 0x5eed) >>> 0) {
        this.W = W;
        this.H = H;
        this.vertical = W >= H;
        this.rng = mulberry32(seed);
        const n = W * H;
        this.terrain = new Uint8Array(n);
        this.zone = new Int8Array(n);
        this.nodeAt = new Int16Array(n).fill(-1);
        this.albAt = new Int16Array(n).fill(-1);
        this.road = new Uint8Array(n);
        this.conn = new Uint8Array(n);
        this.deg = new Uint8Array(n);
        this.tgw = new Uint8Array(n);
        this.dxAt = new Int16Array(n).fill(-1);
        this.lockUntil = new Float64Array(n);
        this.lanes = new Array(n * 8).fill(null);
        this.dirOffset = DX.map((dx, i) => dx + DY[i] * W);
        this.bounds = this.boundsForSprint(0);
        this.carveZones();
    }

    // ---------- Map setup ----------

    private carveZones() {
        const { W, H, vertical } = this;
        const main = vertical ? W : H;
        const cross = vertical ? H : W;
        const rivers = [Math.round(main / 3), Math.round((main * 2) / 3) - 1];
        const paths = rivers.map((base) => {
            const phase = this.rng() * Math.PI * 2;
            const out: number[] = [];
            let prev = base;
            for (let t = 0; t < cross; t++) {
                const want =
                    base + Math.round(Math.sin(t * 0.42 + phase) * 1.2);
                prev += Math.max(-1, Math.min(1, want - prev));
                out.push(prev);
            }
            return out;
        });
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                const m = vertical ? x : y;
                const t = vertical ? y : x;
                const cell = y * W + x;
                let zone = 2;
                if (m < paths[0][t]) zone = 0;
                else if (m < paths[1][t]) zone = 1;
                if (m === paths[0][t] || m === paths[1][t]) {
                    this.terrain[cell] = 1;
                }
                this.zone[cell] = zone;
            }
        }
    }

    private boundsForSprint(sprint: number): Bounds {
        const { W, H, vertical } = this;
        const mainSteps = [0.56, 0.66, 0.78, 0.9, 1];
        const crossSteps = [0.62, 0.74, 0.86, 1, 1];
        const step = Math.min(mainSteps.length - 1, Math.floor(sprint / 1.5));
        const fx = vertical ? mainSteps[step] : crossSteps[step];
        const fy = vertical ? crossSteps[step] : mainSteps[step];
        const bw = Math.min(W, Math.ceil((W * fx) / 2) * 2);
        const bh = Math.min(H, Math.ceil((H * fy) / 2) * 2);
        const x0 = Math.floor((W - bw) / 2);
        const y0 = Math.floor((H - bh) / 2);
        return { x0, y0, x1: x0 + bw - 1, y1: y0 + bh - 1 };
    }

    cellOf(x: number, y: number) {
        return y * this.W + x;
    }

    inBounds(cell: number) {
        const x = cell % this.W;
        const y = (cell - x) / this.W;
        const b = this.bounds;
        return x >= b.x0 && x <= b.x1 && y >= b.y0 && y <= b.y1;
    }

    private isAdjacent(a: number, b: number): number {
        const ax = a % this.W;
        const ay = (a - ax) / this.W;
        const bx = b % this.W;
        const by = (b - bx) / this.W;
        const dx = bx - ax;
        const dy = by - ay;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1 || (dx === 0 && dy === 0)) {
            return -1;
        }
        for (let d = 0; d < 8; d++) {
            if (DX[d] === dx && DY[d] === dy) return d;
        }
        return -1;
    }

    // ---------- Game flow ----------

    start() {
        this.phase = "playing";
        this.bounds = this.boundsForSprint(0);
        const first = this.addService("ec2", 1);
        if (first) {
            this.addClient("web", first);
            this.addClient("web", first);
        }
        this.setBanner(
            "Draw your first route",
            "Drag from a Users block to the web app. A road tile costs one link.",
            "info",
            9999,
        );
        this.planSprint(0);
    }

    choose(index: 0 | 1) {
        const choice = this.choice;
        if (!choice || this.phase !== "choosing") return;
        const option = choice.options[index];
        this.inv.links += choice.bonusLinks;
        this.inv.bridge += choice.bonusBridges;
        this.inv[option.item] += option.amount;
        this.offered.add(option.item);
        this.choice = null;
        this.sprint += 1;
        this.sprintTime = 0;
        this.bounds = this.boundsForSprint(this.sprint);
        this.staticVersion++;
        this.planSprint(this.sprint);
        this.phase = "playing";
        this.pushFx("sound-good", 0, 0, "neutral");
    }

    summary(): RunSummary {
        return {
            served: this.served,
            sprints: this.sprint,
            durationSeconds: this.time,
            peakRps: this.peakRps,
            outages: this.outagesSurvived,
            attacksBlocked: this.attacksBlocked,
            burn: { ...this.burn },
            timeline: this.timeline,
        };
    }

    private note(text: string) {
        const m = Math.floor(this.time / 60);
        const s = String(Math.floor(this.time % 60)).padStart(2, "0");
        this.timeline.push(`T+${m}m ${s}s: ${text}`);
        if (this.timeline.length > 16) this.timeline.shift();
    }

    private setBanner(
        title: string,
        detail: string,
        tone: Banner["tone"],
        seconds = 7,
    ) {
        this.banner = { title, detail, tone, until: this.time + seconds };
    }

    private pushFx(type: Fx["type"], x: number, y: number, color: Fx["color"]) {
        if (this.fx.length >= 40) return;
        this.fx.push({ type, x, y, color });
    }

    // ---------- The director: what happens and when ----------

    private planSprint(s: number) {
        const at = (when: number, run: () => void) =>
            this.plan.push({ at: when, run });
        this.plan.length = 0;

        const client = (traffic: Traffic) => {
            const near = this.nearestOfTraffic(traffic);
            if (near) this.addClient(traffic, near);
        };

        switch (s) {
            case 0:
                at(16, () => client("web"));
                at(32, () => client("web"));
                break;
            case 1:
                at(1, () => {
                    const db = this.addService("rds", 1);
                    if (db) {
                        this.graceUntil.rds = this.time + DEPENDENCY_GRACE;
                        this.setBanner(
                            "New dependency: RDS",
                            `Your web app needs a database. Connect it within ${DEPENDENCY_GRACE} seconds.`,
                            "warn",
                            10,
                        );
                    }
                });
                at(14, () => client("web"));
                at(24, () => {
                    const zone = this.rng() < 0.5 ? 0 : 2;
                    this.addService("ec2", zone);
                    this.setBanner(
                        "Second instance online",
                        "Clients only use the closest server until you add a load balancer.",
                        "info",
                        8,
                    );
                });
                break;
            case 2:
                at(2, () => {
                    const bucket = this.addService("s3", 1);
                    if (bucket) {
                        this.addClient("static", bucket);
                        this.addClient("static", bucket);
                        this.setBanner(
                            "Static traffic incoming",
                            "Green requests want the S3 bucket. Keep them off your busy roads.",
                            "info",
                            8,
                        );
                    }
                });
                at(34, () => client("web"));
                break;
            case 3:
                at(6, () => client("web"));
                at(14, () => this.beginOutage(this.zoneOfPrimaryDb(), 18));
                at(38, () => client("static"));
                break;
            case 4:
                at(2, () => {
                    const fn = this.addService("lambda", 2);
                    this.addService("dynamo", 2);
                    if (fn) {
                        this.addClient("api", fn);
                        this.addClient("api", fn);
                        this.graceUntil.dynamo = this.time + DEPENDENCY_GRACE;
                        this.setBanner(
                            "API launched",
                            "Orange calls go to Lambda, then DynamoDB. Marketing already promised a mobile app.",
                            "warn",
                            9,
                        );
                    }
                });
                at(24, () => this.beginSpike());
                at(36, () => client("web"));
                break;
            case 5:
                at(2, () => this.addService("ec2", this.leastServedZone("ec2")));
                at(8, () => client("api"));
                at(16, () => this.beginAttack(18));
                at(36, () => client("static"));
                break;
            case 6:
                at(2, () => {
                    const q = this.addService("sqs", 0);
                    this.addService("worker", 0);
                    if (q) {
                        this.addClient("jobs", q);
                        this.addClient("jobs", q);
                        this.setBanner(
                            "Background jobs enabled",
                            "Purple jobs go to the queue, then a worker. Queues hide problems. Until they don't.",
                            "warn",
                            9,
                        );
                    }
                });
                at(18, () => this.beginOutage(this.randomZone(), 20));
                at(36, () => client("web"));
                break;
            default: {
                const severity = s - 6;
                const types: Traffic[] = ["web", "api", "static", "jobs"];
                at(3, () => client(types[s % 4]));
                at(14, () => client(types[(s + 1) % 4]));
                if (s % 2 === 0) at(28, () => client(types[(s + 2) % 4]));
                if (s % 2 === 1) {
                    const kinds: ServiceKind[] = [
                        "ec2",
                        "lambda",
                        "worker",
                        "rds",
                        "s3",
                        "dynamo",
                    ];
                    const kind = kinds[((s - 7) / 2) % kinds.length];
                    at(6, () =>
                        this.addService(kind, this.leastServedZone(kind)),
                    );
                }
                if (s % 2 === 0) {
                    at(16, () =>
                        this.beginOutage(
                            this.randomZone(),
                            Math.min(40, 18 + severity * 2),
                        ),
                    );
                } else {
                    at(20, () => this.beginSpike());
                }
                if (s % 3 === 0) {
                    at(32, () => this.beginAttack(Math.min(30, 16 + severity)));
                }
                if (s % 3 === 1) at(36, () => this.badDeploy());
                break;
            }
        }
    }

    private nearestOfTraffic(traffic: Traffic): SimNode | null {
        const kind = ROUTES[traffic][0];
        const options = this.nodes.filter((n) => !n.gone && n.kind === kind);
        if (options.length === 0) return null;
        return options[Math.floor(this.rng() * options.length)];
    }

    private zoneOfPrimaryDb(): number {
        const db = this.nodes.find(
            (n) => !n.gone && n.kind === "rds" && n.role === "primary",
        );
        return db ? db.zone : this.randomZone();
    }

    private randomZone() {
        return Math.floor(this.rng() * 3);
    }

    private leastServedZone(kind: NodeKind): number {
        const counts = [0, 0, 0];
        for (const n of this.nodes) {
            if (!n.gone && n.kind === kind) counts[n.zone]++;
        }
        let best = 0;
        for (let z = 1; z < 3; z++) {
            if (counts[z] < counts[best]) best = z;
        }
        return best;
    }

    private beginOutage(zone: number, duration: number) {
        if (this.outage) return;
        this.outage = {
            zone,
            phase: "warn",
            endsAt: this.time + 10,
            duration,
        };
        this.setBanner(
            `AZ-${"abc"[zone]} is degraded`,
            "It goes dark in 10 seconds. Instances and databases that only live there go with it.",
            "warn",
            10,
        );
        this.note(`AWS Health warned that AZ-${"abc"[zone]} looked unwell.`);
        this.pushFx("sound-alarm", 0, 0, "neutral");
        this.staticVersion++;
    }

    private beginSpike() {
        this.spikeUntil = this.time + 18;
        this.setBanner(
            "You hit the front page",
            "Traffic is up 70% for the next 18 seconds. Nobody told engineering.",
            "warn",
            9,
        );
        this.note("Traffic spiked 70% after someone posted the launch.");
        this.pushFx("sound-alarm", 0, 0, "neutral");
    }

    private beginAttack(duration: number) {
        this.attackUntil = this.time + duration;
        const hasWaf = this.nodes.some(
            (n) => !n.gone && n.kind === "alb" && n.waf,
        );
        this.setBanner(
            "DDoS attack",
            hasWaf
                ? "Red traffic is inbound. Your WAF is about to have a great time."
                : "Red traffic is inbound and nothing is filtering it. A WAF on a load balancer would stop it.",
            "danger",
            9,
        );
        this.note("A botnet found the site.");
        this.pushFx("sound-alarm", 0, 0, "neutral");
    }

    private badDeploy() {
        const options = this.nodes.filter(
            (n) =>
                !n.gone &&
                !n.dead &&
                (n.kind === "ec2" || n.kind === "lambda" || n.kind === "worker"),
        );
        if (options.length === 0) return;
        const node = options[Math.floor(this.rng() * options.length)];
        this.killNode(node, this.time + 12);
        this.setBanner(
            `Bad deploy on ${node.name}`,
            "Someone merged on a Friday. Rolling back takes 12 seconds.",
            "danger",
            8,
        );
        this.note(`A bad deploy took out ${node.name}.`);
    }

    private makeChoice() {
        const s = this.sprint;
        const validity = (item: ItemId) => {
            switch (item) {
                case "standby":
                    return this.nodes.some(
                        (n) => !n.gone && n.role === "primary" && n.peer < 0,
                    );
                case "cdn":
                    return this.nodes.some(
                        (n) => !n.gone && n.kind === "s3" && !n.cdn,
                    );
                case "waf":
                    return true;
                case "cache":
                    return this.nodes.some(
                        (n) =>
                            !n.gone &&
                            (n.kind === "ec2" || n.kind === "lambda") &&
                            !n.cache,
                    );
                default:
                    return true;
            }
        };
        const amount: Partial<Record<ItemId, number>> = {
            links: 26,
            bridge: 3,
            asg: 2,
            tgw: 2,
        };
        const script: Array<[ItemId, ItemId]> = [
            ["alb", "links"],
            ["asg", "bridge"],
            ["standby", "alb"],
            ["cdn", "asg"],
            ["waf", "cache"],
            ["tgw", "standby"],
            ["dx", "asg"],
        ];
        const pool: ItemId[] = [
            "asg",
            "asg",
            "links",
            "alb",
            "bridge",
            "standby",
            "cache",
            "cdn",
            "tgw",
            "dx",
            "waf",
        ];
        const pick = (exclude: ItemId | null): ItemId => {
            for (let tries = 0; tries < 24; tries++) {
                const item = pool[Math.floor(this.rng() * pool.length)];
                if (item !== exclude && validity(item)) return item;
            }
            return exclude === "asg" ? "links" : "asg";
        };
        let [a, b]: [ItemId, ItemId] =
            s < script.length ? script[s] : [pick(null), "asg"];
        if (!validity(a)) a = pick(b);
        if (s >= script.length || !validity(b)) b = pick(a);
        this.choice = {
            sprint: s,
            bonusLinks: 12 + Math.min(10, s * 2),
            bonusBridges: 1,
            options: [
                { item: a, amount: amount[a] ?? 1 },
                { item: b, amount: amount[b] ?? 1 },
            ],
        };
        this.phase = "choosing";
        this.pushFx("sound-good", 0, 0, "neutral");
    }

    // ---------- Node placement ----------

    private allocNode(): SimNode {
        let id = this.nodes.findIndex((n) => n.gone);
        if (id < 0) id = this.nodes.length;
        const node: SimNode = {
            id,
            gone: false,
            kind: "client",
            traffic: null,
            name: "",
            x: 0,
            y: 0,
            size: 1,
            zone: 0,
            rate: 0,
            accum: 0,
            attackAccum: 0,
            pending: 0,
            inflight: 0,
            breach: false,
            happy: 0,
            instances: 1,
            slots: [],
            incoming: 0,
            dead: false,
            deadAt: 0,
            deadUntil: 0,
            cache: false,
            cdn: false,
            waf: false,
            role: null,
            peer: -1,
            blocked: false,
            problem: null,
            bornAt: this.time,
        };
        this.nodes[id] = node;
        this.fieldVersion[id] = -1;
        return node;
    }

    private footprintFree(x: number, y: number, size: number) {
        const b = this.bounds;
        if (x < b.x0 || y < b.y0 || x + size - 1 > b.x1 || y + size - 1 > b.y1) {
            return false;
        }
        const margin = 1;
        for (let j = y - margin; j < y + size + margin; j++) {
            for (let i = x - margin; i < x + size + margin; i++) {
                if (i < 0 || j < 0 || i >= this.W || j >= this.H) continue;
                const c = this.cellOf(i, j);
                const inside =
                    i >= x && i < x + size && j >= y && j < y + size;
                if (this.nodeAt[c] >= 0) return false;
                if (inside) {
                    if (
                        this.terrain[c] ||
                        this.road[c] ||
                        this.dxAt[c] >= 0
                    ) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    private claim(node: SimNode, x: number, y: number, size: number) {
        node.x = x;
        node.y = y;
        node.size = size;
        node.zone = this.zone[this.cellOf(x, y)];
        for (let j = y; j < y + size; j++) {
            for (let i = x; i < x + size; i++) {
                this.nodeAt[this.cellOf(i, j)] = node.id;
            }
        }
        this.staticVersion++;
    }

    private findSpot(
        size: number,
        score: (x: number, y: number) => number,
    ): [number, number] | null {
        const b = this.bounds;
        let bestX = -1;
        let bestY = -1;
        let best = -Infinity;
        for (let tries = 0; tries < 240; tries++) {
            const x = b.x0 + Math.floor(this.rng() * (b.x1 - b.x0 + 1));
            const y = b.y0 + Math.floor(this.rng() * (b.y1 - b.y0 + 1));
            if (!this.footprintFree(x, y, size)) continue;
            const s = score(x, y) + this.rng() * 1.5;
            if (s > best) {
                best = s;
                bestX = x;
                bestY = y;
            }
        }
        return bestX < 0 ? null : [bestX, bestY];
    }

    private addService(kind: ServiceKind, zone: number): SimNode | null {
        if (this.serviceCount >= MAX_SERVICES) return null;
        const size = 2;
        const b = this.bounds;
        const cx = (b.x0 + b.x1) / 2;
        const cy = (b.y0 + b.y1) / 2;
        const spot = this.findSpot(size, (x, y) => {
            const inZone = this.zone[this.cellOf(x, y)] === zone ? 20 : 0;
            let spacing = 0;
            for (const n of this.nodes) {
                if (n.gone || n.kind === "client" || n.kind === "alb") continue;
                const d = Math.max(Math.abs(n.x - x), Math.abs(n.y - y));
                if (d < 4) spacing -= (4 - d) * 2;
            }
            const toCenter = Math.abs(x - cx) + Math.abs(y - cy);
            return inZone + spacing - toCenter * 0.12;
        });
        if (!spot) return null;
        const node = this.allocNode();
        const stats = SERVICE_STATS[kind];
        node.kind = kind;
        node.traffic = stats.traffic;
        const count = (this.kindCount[kind] ?? 0) + 1;
        this.kindCount[kind] = count;
        node.name = `${kind}-${count}`;
        if (kind === "rds") node.role = "primary";
        this.claim(node, spot[0], spot[1], size);
        this.serviceCount++;
        return node;
    }

    private addClient(traffic: Traffic, near: SimNode): SimNode | null {
        if (this.clientCount >= MAX_CLIENTS) return null;
        const spot = this.findSpot(1, (x, y) => {
            const d = Math.max(Math.abs(near.x - x), Math.abs(near.y - y));
            const ideal = d >= 3 && d <= 7 ? 12 : -Math.abs(d - 5) * 2;
            const sameZone = this.zone[this.cellOf(x, y)] === near.zone ? 3 : 0;
            return ideal + sameZone;
        });
        if (!spot) return null;
        const node = this.allocNode();
        node.kind = "client";
        node.traffic = traffic;
        const count = (this.kindCount.client ?? 0) + 1;
        this.kindCount.client = count;
        node.name = `users-${count}`;
        node.rate = BASE_RATE[traffic];
        node.accum = this.rng();
        this.claim(node, spot[0], spot[1], 1);
        this.clientCount++;
        return node;
    }

    // ---------- Player actions: network ----------

    private ensureLane(cell: number, dir: number): Lane {
        const key = cell * 8 + dir;
        let lane = this.lanes[key];
        if (!lane) {
            const to = cell + this.dirOffset[dir];
            const len = dir % 2 === 1 ? SQ2 : 1;
            const fromX = cell % this.W;
            lane = {
                from: cell,
                to,
                fx: fromX + 0.5,
                fy: (cell - fromX) / this.W + 0.5,
                len,
                speed: 1,
                dirX: DX[dir] / len,
                dirY: DY[dir] / len,
                cars: [],
            };
            this.lanes[key] = lane;
        }
        return lane;
    }

    private refreshDegree(cell: number) {
        let bits = this.conn[cell];
        let count = 0;
        while (bits) {
            bits &= bits - 1;
            count++;
        }
        if (this.dxAt[cell] >= 0) count++;
        this.deg[cell] = count;
    }

    private networkChanged() {
        this.graphVersion++;
        this.staticVersion++;
    }

    /** Connects two adjacent cells, spending links and cross-AZ links as needed. */
    tryLink(a: number, b: number): LinkResult {
        if (a === b) return "noop";
        const d = this.isAdjacent(a, b);
        if (d < 0) return "blocked";
        if (!this.inBounds(a) || !this.inBounds(b)) return "out-of-bounds";
        const na = this.nodeAt[a];
        const nb = this.nodeAt[b];
        if (na >= 0 && na === nb) return "noop";
        if (this.conn[a] & (1 << d)) return "noop";

        if (d % 2 === 1) {
            const o1 = a + DX[d];
            const o2 = a + DY[d] * this.W;
            const crossing = this.isAdjacent(o1, o2);
            if (crossing >= 0 && this.conn[o1] & (1 << crossing)) {
                return "blocked";
            }
            if (this.terrain[o1] && this.terrain[o2]) return "blocked";
            if (this.nodeAt[o1] >= 0 && this.nodeAt[o2] >= 0) return "blocked";
        }

        let links = 0;
        let bridges = 0;
        for (const c of [a, b]) {
            if (this.nodeAt[c] >= 0 || this.road[c]) continue;
            if (this.terrain[c]) bridges++;
            else links++;
        }
        if (links > this.inv.links) return "no-links";
        if (bridges > this.inv.bridge) return "no-bridges";
        this.inv.links -= links;
        this.inv.bridge -= bridges;
        for (const c of [a, b]) {
            if (this.nodeAt[c] < 0 && !this.road[c]) {
                this.road[c] = this.terrain[c] ? 2 : 1;
            }
        }
        this.conn[a] |= 1 << d;
        this.conn[b] |= 1 << ((d + 4) % 8);
        this.ensureLane(a, d);
        this.ensureLane(b, (d + 4) % 8);
        this.refreshDegree(a);
        this.refreshDegree(b);
        this.networkChanged();
        return "ok";
    }

    /** Undoes a single link, refunding any tiles it paid for. */
    unlink(a: number, b: number) {
        const d = this.isAdjacent(a, b);
        if (d < 0 || !(this.conn[a] & (1 << d))) return;
        this.removeLink(a, d);
        this.networkChanged();
    }

    private removeLink(a: number, d: number) {
        const b = a + this.dirOffset[d];
        const back = (d + 4) % 8;
        for (const lane of [this.lanes[a * 8 + d], this.lanes[b * 8 + back]]) {
            if (!lane) continue;
            while (lane.cars.length) this.dropCar(lane.cars[0]);
        }
        this.conn[a] &= ~(1 << d);
        this.conn[b] &= ~(1 << back);
        this.refreshDegree(a);
        this.refreshDegree(b);
        this.tidyCell(a);
        this.tidyCell(b);
    }

    /** Releases a road cell that no longer has any connections. */
    private tidyCell(cell: number) {
        if (!this.road[cell] || this.conn[cell] || this.dxAt[cell] >= 0) return;
        const alb = this.albAt[cell];
        if (alb >= 0) this.removeAlb(this.nodes[alb]);
        if (this.tgw[cell]) {
            this.tgw[cell] = 0;
            this.inv.tgw++;
        }
        if (this.road[cell] === 2) this.inv.bridge++;
        else if (this.road[cell] === 1) this.inv.links++;
        this.road[cell] = 0;
    }

    private removeAlb(node: SimNode) {
        const cell = this.cellOf(node.x, node.y);
        this.albAt[cell] = -1;
        this.inv.alb++;
        if (node.waf) {
            node.waf = false;
            this.inv.waf++;
        }
        node.gone = true;
        // Cars heading for it choose again when they reach their next cell.
        for (const car of this.cars) {
            if (car.target === node.id) car.target = -1;
        }
        this.networkChanged();
    }

    /** Takes a placed item off a road tile, leaving the road itself. */
    removeFeature(cell: number): boolean {
        const alb = this.albAt[cell];
        if (alb >= 0) {
            this.removeAlb(this.nodes[alb]);
        } else if (this.tgw[cell]) {
            this.tgw[cell] = 0;
            this.inv.tgw++;
            this.staticVersion++;
        } else if (this.dxAt[cell] >= 0) {
            this.removeDx(this.dxAt[cell]);
        } else {
            return false;
        }
        this.pushFx("sound-erase", 0, 0, "neutral");
        return true;
    }

    /** Removes the road, or whatever was placed on it, at a cell. */
    eraseCell(cell: number): boolean {
        let changed = false;
        const alb = this.albAt[cell];
        if (alb >= 0) {
            this.removeAlb(this.nodes[alb]);
            changed = true;
        }
        if (this.tgw[cell]) {
            this.tgw[cell] = 0;
            this.inv.tgw++;
            changed = true;
        }
        const dxId = this.dxAt[cell];
        if (dxId >= 0) {
            this.removeDx(dxId);
            changed = true;
        }
        if (this.conn[cell]) {
            for (let d = 0; d < 8; d++) {
                if (this.conn[cell] & (1 << d)) this.removeLink(cell, d);
            }
            changed = true;
        }
        this.tidyCell(cell);
        if (changed) {
            this.networkChanged();
            this.pushFx("sound-erase", 0, 0, "neutral");
        }
        return changed;
    }

    placeAlb(cell: number): string | null {
        if (this.inv.alb <= 0) return "No load balancers left.";
        if (!this.road[cell] || this.road[cell] === 2) {
            return "Load balancers go on a road tile.";
        }
        if (this.albAt[cell] >= 0 || this.tgw[cell]) {
            return "That tile is already in use.";
        }
        const node = this.allocNode();
        node.kind = "alb";
        const count = (this.kindCount.alb ?? 0) + 1;
        this.kindCount.alb = count;
        node.name = `alb-${count}`;
        node.x = cell % this.W;
        node.y = (cell - node.x) / this.W;
        node.size = 1;
        node.zone = this.zone[cell];
        this.albAt[cell] = node.id;
        this.inv.alb--;
        this.networkChanged();
        this.pushFx("ripple-place", node.x + 0.5, node.y + 0.5, "neutral");
        this.pushFx("sound-place", 0, 0, "neutral");
        return null;
    }

    placeTgw(cell: number): string | null {
        if (this.inv.tgw <= 0) return "No transit gateways left.";
        if (!this.road[cell]) return "Transit gateways go on a road tile.";
        if (this.albAt[cell] >= 0 || this.tgw[cell]) {
            return "That tile is already in use.";
        }
        if (this.deg[cell] < 3) return "Transit gateways go on a junction.";
        this.tgw[cell] = 1;
        this.inv.tgw--;
        this.staticVersion++;
        const x = cell % this.W;
        const y = (cell - x) / this.W;
        this.pushFx("ripple-place", x + 0.5, y + 0.5, "neutral");
        this.pushFx("sound-place", 0, 0, "neutral");
        return null;
    }

    placeDx(a: number, b: number): string | null {
        if (this.inv.dx <= 0) return "No Direct Connects left.";
        if (a === b) return "Pick a different end point.";
        if (!this.inBounds(a) || !this.inBounds(b)) {
            return "Stay inside the region.";
        }
        const ax = a % this.W;
        const ay = (a - ax) / this.W;
        const bx = b % this.W;
        const by = (b - bx) / this.W;
        const len = Math.hypot(ax - bx, ay - by);
        if (len > DX_MAX_LENGTH) {
            return `Direct Connect reaches ${DX_MAX_LENGTH} tiles at most.`;
        }
        for (const c of [a, b]) {
            if (this.nodeAt[c] >= 0) return "End points can't be on a building.";
            if (this.terrain[c]) return "End points can't be on an AZ boundary.";
            if (this.dxAt[c] >= 0) return "That tile already has a link.";
            if (this.albAt[c] >= 0) return "That tile is already in use.";
        }
        const makeLane = (
            from: number,
            to: number,
            fx: number,
            fy: number,
            tx: number,
            ty: number,
        ): Lane => ({
            from,
            to,
            fx: fx + 0.5,
            fy: fy + 0.5,
            len,
            speed: DX_SPEED,
            dirX: (tx - fx) / len,
            dirY: (ty - fy) / len,
            cars: [],
        });
        let id = this.dx.findIndex((link) => link === null);
        if (id < 0) id = this.dx.length;
        this.dx[id] = {
            a,
            b,
            laneAB: makeLane(a, b, ax, ay, bx, by),
            laneBA: makeLane(b, a, bx, by, ax, ay),
        };
        for (const c of [a, b]) {
            // 3 marks a tile that exists only for this link, so it has no refund.
            this.road[c] = this.road[c] || 3;
            this.dxAt[c] = id;
            this.refreshDegree(c);
        }
        this.inv.dx--;
        this.networkChanged();
        this.pushFx("sound-place", 0, 0, "neutral");
        return null;
    }

    private removeDx(id: number) {
        const link = this.dx[id];
        if (!link) return;
        for (const lane of [link.laneAB, link.laneBA]) {
            while (lane.cars.length) this.dropCar(lane.cars[0]);
        }
        this.dx[id] = null;
        this.dxAt[link.a] = -1;
        this.dxAt[link.b] = -1;
        this.refreshDegree(link.a);
        this.refreshDegree(link.b);
        this.tidyCell(link.a);
        this.tidyCell(link.b);
        this.inv.dx++;
        this.networkChanged();
    }

    // ---------- Player actions: attachments ----------

    nodeAtCell(cell: number): SimNode | null {
        const id = this.nodeAt[cell] >= 0 ? this.nodeAt[cell] : this.albAt[cell];
        return id >= 0 ? this.nodes[id] : null;
    }

    capacityOf(node: SimNode) {
        if (node.kind === "client" || node.kind === "alb") return 0;
        return SERVICE_STATS[node.kind].slots * node.instances;
    }

    /** Returns an error message, or null when the item was attached. */
    attach(item: ItemId, node: SimNode): string | null {
        if (this.inv[item] <= 0) return "None left.";
        switch (item) {
            case "asg":
                if (node.kind === "client" || node.kind === "alb") {
                    return "Auto Scaling goes on a service or database.";
                }
                if (node.kind === "s3" || node.kind === "sqs") {
                    return `${node.name} already scales itself. That's the whole pitch.`;
                }
                if (node.role === "standby") {
                    return "Scale the primary. The standby follows.";
                }
                if (node.instances >= MAX_INSTANCES) {
                    return `${node.name} is at maximum size.`;
                }
                node.instances++;
                if (node.peer >= 0) this.nodes[node.peer].instances++;
                break;
            case "cache":
                if (node.kind !== "ec2" && node.kind !== "lambda") {
                    return "ElastiCache goes on an EC2 or Lambda service.";
                }
                if (node.cache) return `${node.name} already has a cache.`;
                node.cache = true;
                break;
            case "cdn":
                if (node.kind !== "s3") return "CloudFront goes on an S3 bucket.";
                if (node.cdn) return `${node.name} already has CloudFront.`;
                node.cdn = true;
                break;
            case "waf":
                if (node.kind !== "alb") return "A WAF goes on a load balancer.";
                if (node.waf) return `${node.name} already has a WAF.`;
                node.waf = true;
                break;
            default:
                return "That doesn't go there.";
        }
        this.inv[item]--;
        this.staticVersion++;
        this.pushFx(
            "ripple-place",
            node.x + node.size / 2,
            node.y + node.size / 2,
            "neutral",
        );
        this.pushFx("sound-place", 0, 0, "neutral");
        return null;
    }

    /** Takes the most recently added item back off a node. */
    detach(node: SimNode): boolean {
        let done = false;
        if (node.waf) {
            node.waf = false;
            this.inv.waf++;
            done = true;
        } else if (node.cdn) {
            node.cdn = false;
            this.inv.cdn++;
            done = true;
        } else if (node.cache) {
            node.cache = false;
            this.inv.cache++;
            done = true;
        } else if (node.role === "standby") {
            this.removeStandby(node);
            done = true;
        } else if (node.instances > 1) {
            node.instances--;
            if (node.peer >= 0) this.nodes[node.peer].instances--;
            this.inv.asg++;
            done = true;
        }
        if (done) {
            this.staticVersion++;
            this.pushFx("sound-erase", 0, 0, "neutral");
        }
        return done;
    }

    private removeStandby(node: SimNode) {
        for (let d = 0; d < 8; d++) {
            for (const cell of this.cellsOf(node)) {
                if (this.conn[cell] & (1 << d)) this.removeLink(cell, d);
            }
        }
        this.ejectAll(node);
        for (const car of this.cars) {
            if (car.target === node.id) this.setTarget(car, -1);
        }
        for (const cell of this.cellsOf(node)) this.nodeAt[cell] = -1;
        if (node.peer >= 0) this.nodes[node.peer].peer = -1;
        node.gone = true;
        node.peer = -1;
        this.serviceCount--;
        this.inv.standby++;
        this.networkChanged();
    }

    /** Places a standby for the nearest database in another AZ. */
    placeStandby(x: number, y: number): string | null {
        if (this.inv.standby <= 0) return "No standbys left.";
        const zoneHere = this.zone[this.cellOf(x, y)];
        let source: SimNode | null = null;
        let best = Infinity;
        let wrongZone = false;
        for (const n of this.nodes) {
            if (n.gone || n.role !== "primary" || n.peer >= 0) continue;
            if (n.zone === zoneHere) {
                wrongZone = true;
                continue;
            }
            const d = Math.abs(n.x - x) + Math.abs(n.y - y);
            if (d < best) {
                best = d;
                source = n;
            }
        }
        if (!source) {
            return wrongZone
                ? "A standby has to live in a different AZ than its primary."
                : "Every database already has a standby.";
        }
        if (!this.footprintFree(x, y, 2)) {
            return "Needs an empty 2×2 spot with a little room around it.";
        }
        const node = this.allocNode();
        node.kind = source.kind;
        node.traffic = source.traffic;
        node.name = `${source.name}-standby`;
        node.role = "standby";
        node.peer = source.id;
        node.instances = source.instances;
        source.peer = node.id;
        this.claim(node, x, y, 2);
        this.serviceCount++;
        this.inv.standby--;
        this.networkChanged();
        this.pushFx("ripple-place", x + 1, y + 1, "neutral");
        this.pushFx("sound-place", 0, 0, "neutral");
        return null;
    }

    // ---------- Routing ----------

    private *cellsOf(node: SimNode) {
        for (let j = node.y; j < node.y + node.size; j++) {
            for (let i = node.x; i < node.x + node.size; i++) {
                yield this.cellOf(i, j);
            }
        }
    }

    /** Travel cost from every cell to a node, computed lazily and cached. */
    private field(id: number): Float32Array {
        let f = this.fields[id];
        if (f && this.fieldVersion[id] === this.graphVersion) return f;
        if (!f) {
            f = new Float32Array(this.W * this.H);
            this.fields[id] = f;
        }
        this.fieldVersion[id] = this.graphVersion;
        f.fill(Infinity);
        const node = this.nodes[id];
        const heap = this.heap;
        heap.clear();
        for (let j = node.y; j < node.y + node.size; j++) {
            for (let i = node.x; i < node.x + node.size; i++) {
                const c = this.cellOf(i, j);
                f[c] = 0;
                heap.push(c, 0);
            }
        }
        const isBuilding = node.kind !== "alb";
        while (!heap.empty) {
            const key = heap.topKey();
            const c = heap.pop();
            if (key > f[c]) continue;
            const here = f[c];
            const bits = this.conn[c];
            if (bits) {
                for (let d = 0; d < 8; d++) {
                    if (!(bits & (1 << d))) continue;
                    const n = c + this.dirOffset[d];
                    const cost = here + (d % 2 === 1 ? SQ2 : 1);
                    if (cost < f[n]) {
                        f[n] = cost;
                        const nb = this.nodeAt[n];
                        // Traffic never drives through a building.
                        if (nb < 0 || (isBuilding && nb === id)) {
                            // Push the stored value: the field is 32-bit, and a
                            // 64-bit key would look stale when it is popped.
                            heap.push(n, f[n]);
                        }
                    }
                }
            }
            const dxId = this.dxAt[c];
            if (dxId >= 0) {
                const link = this.dx[dxId]!;
                const other = link.a === c ? link.b : link.a;
                const cost = here + link.laneAB.len / DX_SPEED;
                if (cost < f[other]) {
                    f[other] = cost;
                    heap.push(other, f[other]);
                }
            }
        }
        return f;
    }

    private distFrom(node: SimNode, f: Float32Array) {
        let best = Infinity;
        for (let j = node.y; j < node.y + node.size; j++) {
            for (let i = node.x; i < node.x + node.size; i++) {
                const v = f[this.cellOf(i, j)];
                if (v < best) best = v;
            }
        }
        return best;
    }

    /** Whether a node can currently take traffic. */
    private isLive(node: SimNode) {
        return !node.gone && !node.dead && node.role !== "standby";
    }

    /**
     * Without a load balancer, clients keep resolving a dead server until
     * DNS catches up. That lag is what a health-checked ALB buys you.
     */
    private isResolvable(node: SimNode) {
        if (node.gone || node.role === "standby") return false;
        return !node.dead || this.time - node.deadAt < DNS_TTL;
    }

    /** The next lane on the shortest route from a cell towards a target. */
    private nextLane(cell: number, targetId: number, f: Float32Array): Lane | null {
        const here = f[cell];
        let best: Lane | null = null;
        let bestCost = Infinity;
        const bits = this.conn[cell];
        if (bits) {
            for (let d = 0; d < 8; d++) {
                if (!(bits & (1 << d))) continue;
                const n = cell + this.dirOffset[d];
                const there = f[n];
                if (there === Infinity) continue;
                if (!(there + 1e-3 < here) && here !== Infinity) continue;
                const nb = this.nodeAt[n];
                if (nb >= 0 && nb !== targetId) continue;
                const lane = this.lanes[cell * 8 + d]!;
                const cost = there + lane.len + lane.cars.length * 0.4;
                if (cost < bestCost) {
                    bestCost = cost;
                    best = lane;
                }
            }
        }
        const dxId = this.dxAt[cell];
        if (dxId >= 0) {
            const link = this.dx[dxId]!;
            const other = link.a === cell ? link.b : link.a;
            const lane = link.a === cell ? link.laneAB : link.laneBA;
            const there = f[other];
            if (there !== Infinity && there + 1e-3 < here) {
                const cost = there + lane.len / lane.speed + lane.cars.length * 0.4;
                if (cost < bestCost) {
                    bestCost = cost;
                    best = lane;
                }
            }
        }
        return best;
    }

    private exitLane(node: SimNode, targetId: number): Lane | null {
        const f = this.field(targetId);
        let best: Lane | null = null;
        let bestCost = Infinity;
        for (let j = node.y; j < node.y + node.size; j++) {
            for (let i = node.x; i < node.x + node.size; i++) {
                const c = this.cellOf(i, j);
                if (f[c] === Infinity) continue;
                const lane = this.nextLane(c, targetId, f);
                if (!lane) continue;
                const cost = f[c] + lane.cars.length * 0.4;
                if (cost < bestCost) {
                    bestCost = cost;
                    best = lane;
                }
            }
        }
        return best;
    }

    private albFor(client: SimNode, kind: ServiceKind): SimNode | null {
        let best: SimNode | null = null;
        let bestDist = Infinity;
        for (const alb of this.nodes) {
            if (alb.gone || alb.kind !== "alb") continue;
            const d = this.distFrom(client, this.field(alb.id));
            if (d >= bestDist) continue;
            if (this.pickFromCell(this.cellOf(alb.x, alb.y), kind)) {
                bestDist = d;
                best = alb;
            }
        }
        return best;
    }

    /** Least-outstanding-requests routing, used by load balancers. */
    private pickFromCell(cell: number, kind: ServiceKind): SimNode | null {
        let best: SimNode | null = null;
        let bestScore = Infinity;
        for (const n of this.nodes) {
            if (n.kind !== kind || !this.isLive(n)) continue;
            const d = this.field(n.id)[cell];
            if (d === Infinity) continue;
            const load = (n.slots.length + n.incoming) / this.capacityOf(n);
            const score = load + d * 0.035;
            if (score < bestScore) {
                bestScore = score;
                best = n;
            }
        }
        return best;
    }

    private nearestFromNode(
        from: SimNode,
        kind: ServiceKind,
        allowStale: boolean,
    ): SimNode | null {
        let best: SimNode | null = null;
        let bestDist = Infinity;
        for (const n of this.nodes) {
            if (n.kind !== kind || n === from) continue;
            if (allowStale ? !this.isResolvable(n) : !this.isLive(n)) continue;
            const d = this.distFrom(from, this.field(n.id));
            if (d < bestDist) {
                bestDist = d;
                best = n;
            }
        }
        return best;
    }

    private firstTarget(client: SimNode, kind: ServiceKind): SimNode | null {
        // S3 and SQS have their own endpoints. Only compute sits behind an ALB.
        const balanced = kind === "ec2" || kind === "lambda";
        return (
            (balanced ? this.albFor(client, kind) : null) ??
            this.nearestFromNode(client, kind, true)
        );
    }

    // ---------- Cars ----------

    private spawnCar(type: CarType, home: number): Car {
        const car = this.carPool.pop() ?? ({} as Car);
        car.type = type;
        car.home = home;
        car.hop = 0;
        car.returning = false;
        car.target = -1;
        car.viaAlb = false;
        car.lane = null;
        car.s = 0;
        car.inNode = -1;
        car.timer = 0;
        car.wait = 0;
        car.noRoute = 0;
        car.index = this.cars.length;
        car.vx = 0;
        car.vy = 0;
        car.hx = 1;
        car.hy = 0;
        car.fresh = true;
        this.cars.push(car);
        return car;
    }

    private setTarget(car: Car, id: number) {
        if (car.target === id) return;
        if (car.target >= 0) {
            const prev = this.nodes[car.target];
            if (prev.kind !== "alb" && prev.kind !== "client") {
                prev.incoming = Math.max(0, prev.incoming - 1);
            }
        }
        car.target = id;
        if (id >= 0) {
            const next = this.nodes[id];
            if (next.kind !== "alb" && next.kind !== "client") next.incoming++;
        }
    }

    private enterLane(car: Car, lane: Lane) {
        if (car.lane) {
            const i = car.lane.cars.indexOf(car);
            if (i >= 0) car.lane.cars.splice(i, 1);
        }
        lane.cars.push(car);
        car.lane = lane;
        car.s = 0;
        car.wait = 0;
    }

    private recycle(car: Car) {
        if (car.lane) {
            const i = car.lane.cars.indexOf(car);
            if (i >= 0) car.lane.cars.splice(i, 1);
            car.lane = null;
        }
        if (car.inNode >= 0) {
            const node = this.nodes[car.inNode];
            const i = node.slots.indexOf(car);
            if (i >= 0) node.slots.splice(i, 1);
            car.inNode = -1;
        }
        this.setTarget(car, -1);
        const last = this.cars[this.cars.length - 1];
        this.cars[car.index] = last;
        last.index = car.index;
        this.cars.pop();
        this.carPool.push(car);
    }

    /** Removes a car whose request never completed and retries it from home. */
    private dropCar(car: Car) {
        if (car.home >= 0) {
            const home = this.nodes[car.home];
            home.inflight = Math.max(0, home.inflight - 1);
            if (car.type !== "attack" && !car.returning) {
                home.pending = Math.min(PENDING_CAP, home.pending + 1);
            }
        }
        this.recycle(car);
    }

    private finishCar(car: Car) {
        if (car.home >= 0) {
            const home = this.nodes[car.home];
            home.inflight = Math.max(0, home.inflight - 1);
            home.happy = 1;
        }
        this.recycle(car);
    }

    private routeKind(car: Car): ServiceKind | null {
        if (car.type === "attack") {
            const home = car.home >= 0 ? this.nodes[car.home] : null;
            return home?.traffic === "api" ? "lambda" : "ec2";
        }
        const route = ROUTES[car.type];
        return car.hop < route.length ? route[car.hop] : null;
    }

    private markServed(car: Car) {
        this.served++;
        this.servedThisWindow++;
        if (this.fx.length < 30 && car.home >= 0) {
            const home = this.nodes[car.home];
            this.pushFx(
                "ripple-served",
                home.x + 0.5,
                home.y + 0.5,
                car.type,
            );
        }
    }

    private stepCars(dt: number) {
        for (let i = this.cars.length - 1; i >= 0; i--) {
            const car = this.cars[i];
            const lane = car.lane;
            if (!lane) continue;
            const idx = lane.cars.indexOf(car);
            let limit = lane.len;
            if (idx > 0) limit = lane.cars[idx - 1].s - CAR_GAP;
            const before = car.s;
            const v = CAR_SPEED * lane.speed;
            car.s = Math.min(car.s + v * dt, Math.max(limit, car.s));
            if (car.s - before < v * dt * 0.25) car.wait += dt;
            else car.wait = 0;
            if (idx === 0 && car.s >= lane.len - 1e-3) {
                car.s = lane.len;
                this.reachEnd(car, lane, dt);
            }
        }
    }

    private reachEnd(car: Car, lane: Lane, dt: number) {
        const cell = lane.to;
        const buildingId = this.nodeAt[cell];

        if (buildingId >= 0) {
            this.arriveAtBuilding(car, this.nodes[buildingId], cell, dt);
            return;
        }

        const albId = this.albAt[cell];
        if (albId >= 0 && car.target === albId) {
            const alb = this.nodes[albId];
            if (car.type === "attack" && alb.waf) {
                this.attacksBlocked++;
                this.pushFx("ripple-block", alb.x + 0.5, alb.y + 0.5, "attack");
                this.dropCar(car);
                return;
            }
            const kind = this.routeKind(car);
            const next = kind ? this.pickFromCell(cell, kind) : null;
            if (next) {
                this.setTarget(car, next.id);
                car.viaAlb = true;
            }
        }

        if (car.target < 0) {
            this.retarget(car, cell);
            if (!car.lane) return; // Retargeting can finish the car.
        }
        if (car.target < 0) {
            this.stall(car, dt);
            return;
        }

        const f = this.field(car.target);
        if (f[cell] === Infinity) {
            this.retarget(car, cell);
            if (!car.lane) return;
            if (car.target < 0 || this.field(car.target)[cell] === Infinity) {
                this.stall(car, dt);
                return;
            }
        }
        const field = this.field(car.target);
        const next = this.nextLane(cell, car.target, field);
        if (!next) {
            this.stall(car, dt);
            return;
        }
        car.noRoute = 0;
        const forced = car.wait > OVERTAKE_AFTER;
        if (this.deg[cell] >= 3 && !forced) {
            if (this.time < this.lockUntil[cell]) return;
        }
        if (!forced && !this.laneHasRoom(next)) return;
        if (this.deg[cell] >= 3) {
            const fast = this.tgw[cell] || this.albAt[cell] >= 0;
            this.lockUntil[cell] =
                this.time + (fast ? INTERCHANGE_SECONDS : JUNCTION_SECONDS);
        }
        this.enterLane(car, next);
    }

    private laneHasRoom(lane: Lane) {
        const n = lane.cars.length;
        return n === 0 || lane.cars[n - 1].s > CAR_GAP;
    }

    private stall(car: Car, dt: number) {
        car.noRoute += dt;
        if (car.noRoute > NO_ROUTE_DROP_AFTER) this.dropCar(car);
    }

    /** Re-picks where a car is going after its target became unusable. */
    private retarget(car: Car, cell: number) {
        if (car.returning) {
            if (car.home >= 0 && this.field(car.home)[cell] !== Infinity) {
                this.setTarget(car, car.home);
            } else {
                this.setTarget(car, -1);
                this.finishCar(car);
            }
            return;
        }
        const kind = this.routeKind(car);
        const next = kind ? this.pickFromCell(cell, kind) : null;
        this.setTarget(car, next ? next.id : -1);
    }

    private arriveAtBuilding(car: Car, node: SimNode, cell: number, dt: number) {
        if (car.target !== node.id) {
            // The target changed while this car was on its way in. Turn around.
            if (car.target < 0) {
                this.retarget(car, cell);
                if (!car.lane) return;
            }
            this.leaveBuilding(car, node, cell, dt);
            return;
        }
        if (node.kind === "client") {
            this.finishCar(car);
            return;
        }
        if (!this.isLive(node)) {
            const staleOk = !car.viaAlb && this.isResolvable(node);
            if (staleOk) {
                // Sits at the door until DNS gives up, and users notice.
                this.staleCars++;
                return;
            }
            this.retarget(car, cell);
            if (!car.lane) return;
            if (car.target >= 0 && car.target !== node.id) {
                this.leaveBuilding(car, node, cell, dt);
            } else {
                this.stall(car, dt);
            }
            return;
        }
        if (node.slots.length >= this.capacityOf(node)) return;
        if (car.lane) {
            const i = car.lane.cars.indexOf(car);
            if (i >= 0) car.lane.cars.splice(i, 1);
            car.lane = null;
        }
        node.incoming = Math.max(0, node.incoming - 1);
        car.target = -1;
        car.inNode = node.id;
        car.timer = SERVICE_STATS[node.kind as ServiceKind].seconds;
        node.slots.push(car);
        if (node.kind === "sqs" && car.home >= 0) {
            // Queues acknowledge immediately. The client is free to move on.
            const home = this.nodes[car.home];
            home.inflight = Math.max(0, home.inflight - 1);
            car.home = -1;
        }
    }

    private leaveBuilding(car: Car, node: SimNode, cell: number, dt: number) {
        if (car.target < 0) {
            this.stall(car, dt);
            return;
        }
        const f = this.field(car.target);
        let lane = this.nextLane(cell, car.target, f);
        if (!lane) lane = this.exitLane(node, car.target);
        if (!lane) {
            this.stall(car, dt);
            return;
        }
        if (this.laneHasRoom(lane) || car.wait > OVERTAKE_AFTER) {
            this.enterLane(car, lane);
        }
    }

    private stepServices(dt: number) {
        for (const node of this.nodes) {
            if (node.gone) continue;
            node.blocked = false;
            for (let i = node.slots.length - 1; i >= 0; i--) {
                const car = node.slots[i];
                car.timer -= dt;
                if (car.timer <= 0) this.finishService(car, node);
            }
        }
    }

    private finishService(car: Car, node: SimNode) {
        if (car.type === "attack") {
            // Every bot that reaches a server is a real user who didn't.
            this.budget = Math.max(0, this.budget - BURN_PER_ATTACK_HIT);
            this.burn.ddos += BURN_PER_ATTACK_HIT;
            this.dropCar(car);
            return;
        }
        const route = ROUTES[car.type];
        // A hit in ElastiCache skips the database hop. This code can run many
        // times while a car waits to leave, so the roll only happens once.
        if (
            car.timer > -1000 &&
            node.cache &&
            car.hop + 1 < route.length &&
            this.rng() < CACHE_HIT
        ) {
            car.hop = route.length - 1;
        }
        car.timer = -2000;
        let hop = car.hop + 1;

        let targetId = -1;
        if (hop < route.length) {
            const kind = route[hop];
            if (node.kind === "sqs") {
                // Hold the message until a worker can actually take it.
                let bestWorker: SimNode | null = null;
                let bestLoad = Infinity;
                let reachable = false;
                for (const n of this.nodes) {
                    if (n.kind !== kind || !this.isLive(n)) continue;
                    if (this.distFrom(node, this.field(n.id)) === Infinity) continue;
                    reachable = true;
                    const load = n.slots.length + n.incoming;
                    if (load < this.capacityOf(n) && load < bestLoad) {
                        bestLoad = load;
                        bestWorker = n;
                    }
                }
                if (!bestWorker) {
                    if (!reachable) node.blocked = true;
                    return;
                }
                targetId = bestWorker.id;
            } else {
                const next = this.nearestFromNode(node, kind, false);
                const exists = this.nodes.some(
                    (n) => !n.gone && n.kind === kind,
                );
                if (next) {
                    targetId = next.id;
                } else if (
                    !exists ||
                    this.time < (this.graceUntil[kind] ?? 0)
                ) {
                    // The dependency hasn't launched, or the player is still
                    // inside the grace period for connecting it.
                    hop = route.length;
                } else {
                    node.blocked = true;
                    return;
                }
            }
        }

        if (hop >= route.length) {
            if (car.home >= 0) {
                targetId = car.home;
            } else {
                this.markServed(car);
                this.recycle(car);
                return;
            }
        }

        const lane = this.exitLane(node, targetId);
        if (!lane) {
            if (hop >= route.length) {
                // Nowhere to drive home, but the work is done.
                this.markServed(car);
                this.finishCar(car);
            } else {
                node.blocked = true;
            }
            return;
        }
        if (!this.laneHasRoom(lane)) return;

        const i = node.slots.indexOf(car);
        if (i >= 0) node.slots.splice(i, 1);
        car.inNode = -1;
        car.hop = hop;
        if (hop >= route.length) {
            car.returning = true;
            this.markServed(car);
        }
        car.viaAlb = false;
        this.setTarget(car, targetId);
        this.enterLane(car, lane);
    }

    private ejectAll(node: SimNode) {
        while (node.slots.length) this.dropCar(node.slots[0]);
    }

    private killNode(node: SimNode, until: number) {
        if (node.dead) return;
        node.dead = true;
        node.deadAt = this.time;
        node.deadUntil = until;
        this.ejectAll(node);
        this.staticVersion++;
    }

    private reviveNode(node: SimNode) {
        node.dead = false;
        this.staticVersion++;
    }

    // ---------- Clients ----------

    private maxInflight(rate: number) {
        return Math.min(12, Math.ceil(rate * 16) + 2);
    }

    private growth() {
        return 1 + 0.04 * this.sprint + (this.sprint > 8 ? 0.03 * (this.sprint - 8) : 0);
    }

    private stepClients(dt: number) {
        const spike = this.time < this.spikeUntil ? 1.7 : 1;
        const growth = this.growth();
        const attacking = this.time < this.attackUntil;
        let attackers = 0;
        if (attacking) {
            for (const car of this.cars) if (car.type === "attack") attackers++;
        }
        for (const node of this.nodes) {
            if (node.gone || node.kind !== "client" || !node.traffic) continue;
            const traffic = node.traffic;
            const rate = node.rate * growth * spike;
            node.accum += rate * dt;
            while (node.accum >= 1) {
                node.accum -= 1;
                if (traffic === "static" && this.cdnHit()) {
                    this.served++;
                    this.servedThisWindow++;
                    node.happy = 1;
                } else if (node.pending < PENDING_CAP) {
                    node.pending++;
                }
            }
            node.breach = node.pending >= PENDING_CAP;
            if (node.happy > 0) node.happy = Math.max(0, node.happy - dt * 2);

            if (node.pending > 0 && node.inflight < this.maxInflight(rate)) {
                this.dispatch(node, traffic);
            }

            if (
                attacking &&
                attackers < MAX_ATTACK_CARS &&
                (traffic === "web" || traffic === "api")
            ) {
                node.attackAccum += 0.9 * dt;
                if (node.attackAccum >= 1) {
                    node.attackAccum -= 1;
                    if (this.dispatchAttack(node, traffic)) attackers++;
                }
            }
        }
    }

    private cdnHit() {
        return (
            this.rng() < CDN_HIT &&
            this.nodes.some((n) => !n.gone && n.kind === "s3" && n.cdn)
        );
    }

    private dispatch(node: SimNode, traffic: Traffic) {
        if (this.cars.length >= MAX_CARS) return;
        const target = this.firstTarget(node, ROUTES[traffic][0]);
        if (!target) return;
        const lane = this.exitLane(node, target.id);
        if (!lane || !this.laneHasRoom(lane)) return;
        const car = this.spawnCar(traffic, node.id);
        this.setTarget(car, target.id);
        this.enterLane(car, lane);
        node.pending--;
        node.inflight++;
    }

    private dispatchAttack(node: SimNode, traffic: Traffic) {
        if (this.cars.length >= MAX_CARS) return false;
        const kind = traffic === "api" ? "lambda" : "ec2";
        const target = this.firstTarget(node, kind);
        if (!target) return false;
        const lane = this.exitLane(node, target.id);
        if (!lane || !this.laneHasRoom(lane)) return false;
        const car = this.spawnCar("attack", node.id);
        node.inflight++;
        this.setTarget(car, target.id);
        this.enterLane(car, lane);
        return true;
    }

    // ---------- Failures ----------

    private stepOutage() {
        const outage = this.outage;
        if (!outage) return;
        if (this.time < outage.endsAt) return;
        if (outage.phase === "warn") {
            outage.phase = "active";
            outage.endsAt = this.time + outage.duration;
            for (const n of this.nodes) {
                if (
                    !n.gone &&
                    n.zone === outage.zone &&
                    isZonal(n.kind)
                ) {
                    this.killNode(n, outage.endsAt);
                }
            }
            this.setBanner(
                `AZ-${"abc"[outage.zone]} is down`,
                `Every instance and database in it is offline for ${outage.duration} seconds.`,
                "danger",
                6,
            );
            this.note(`AZ-${"abc"[outage.zone]} went down.`);
            this.pushFx("sound-alarm", 0, 0, "neutral");
        } else {
            for (const n of this.nodes) {
                if (!n.gone && n.dead && n.zone === outage.zone) {
                    this.reviveNode(n);
                }
            }
            this.setBanner(
                `AZ-${"abc"[outage.zone]} is back`,
                "AWS has posted a green checkmark with a small “i” on it.",
                "good",
                5,
            );
            this.note(`AZ-${"abc"[outage.zone]} recovered.`);
            this.outagesSurvived++;
            this.outage = null;
            this.pushFx("sound-good", 0, 0, "neutral");
            this.staticVersion++;
        }
    }

    private stepFailover() {
        for (const n of this.nodes) {
            if (n.gone || n.role !== "primary" || !n.dead || n.peer < 0) continue;
            const standby = this.nodes[n.peer];
            if (standby.dead) continue;
            if (this.time - n.deadAt < FAILOVER_SECONDS) continue;
            n.role = "standby";
            standby.role = "primary";
            this.setBanner(
                `${standby.name} promoted`,
                "Multi-AZ failover complete. Someone will take credit for this.",
                "good",
                6,
            );
            this.note(`RDS failed over to ${standby.name}.`);
            this.pushFx("sound-good", 0, 0, "neutral");
            this.staticVersion++;
        }
        for (const n of this.nodes) {
            if (
                !n.gone &&
                n.dead &&
                n.deadUntil > 0 &&
                this.time >= n.deadUntil &&
                !(this.outage?.phase === "active" && this.outage.zone === n.zone)
            ) {
                this.reviveNode(n);
            }
        }
    }

    private classifyBreach(client: SimNode): Cause {
        if (this.time < this.attackUntil) return "ddos";
        const traffic = client.traffic!;
        const kind = ROUTES[traffic][0];
        const reachable = this.nodes.some(
            (n) =>
                n.kind === kind &&
                !n.gone &&
                n.role !== "standby" &&
                this.distFrom(client, this.field(n.id)) !== Infinity,
        );
        if (!reachable) return "noroute";
        if (this.outage?.phase === "active") return "outage";
        const stuck = this.nodes.some(
            (n) => !n.gone && n.blocked && n.traffic === traffic,
        );
        return stuck ? "noroute" : "capacity";
    }

    /** True when a tier that exists has no healthy node left to serve it. */
    private tierDown(kind: ServiceKind) {
        let exists = false;
        for (const n of this.nodes) {
            if (n.gone || n.kind !== kind) continue;
            exists = true;
            if (this.isLive(n)) return false;
        }
        return exists;
    }

    private stepBudget(dt: number) {
        let breaches = 0;
        for (const n of this.nodes) {
            if (n.gone || n.kind !== "client" || !n.breach) continue;
            breaches++;
            const cause = this.classifyBreach(n);
            this.burn[cause] += BURN_PER_BREACH * dt;
        }
        this.breachCount = breaches;

        // Availability is the point: a dead tier burns budget immediately, long
        // before any backlog fills up. This is what a standby protects against.
        let downTiers = 0;
        if (this.tierDown("ec2")) downTiers++;
        if (this.tierDown("rds")) downTiers++;
        if (this.tierDown("lambda")) downTiers++;

        const stale = Math.min(BURN_MAX_STALE, this.staleCars * BURN_PER_STALE_CAR);
        this.staleCars = 0;
        const outageBurn = downTiers * BURN_TIER_DOWN + stale;
        this.burn.outage += outageBurn * dt;

        const total = breaches * BURN_PER_BREACH + outageBurn;
        if (total > 0) {
            this.lastBreachAt = this.time;
            this.burnRate = Math.min(MAX_BURN, total);
            this.budget = Math.max(0, this.budget - this.burnRate * dt);
        } else {
            this.burnRate = 0;
            if (this.time - this.lastBreachAt > REGEN_DELAY) {
                this.budget = Math.min(100, this.budget + REGEN * dt);
            }
        }
        if (this.budget <= 0) {
            this.phase = "over";
            this.pushFx("sound-over", 0, 0, "neutral");
        }
    }

    // ---------- Trusted Advisor ----------

    private stepAdvice() {
        let advice: string | null = null;
        const add = (text: string) => {
            if (!advice) advice = text;
        };
        const live = this.nodes.filter((n) => !n.gone);
        const hints: Array<{ from: number; to: number }> = [];
        const closest = (from: SimNode, kind: NodeKind) => {
            let best: SimNode | null = null;
            let bestDist = Infinity;
            for (const s of live) {
                if (s.kind !== kind || s.role === "standby") continue;
                const d = Math.hypot(s.x - from.x, s.y - from.y);
                if (d < bestDist) {
                    bestDist = d;
                    best = s;
                }
            }
            return best as SimNode | null;
        };

        for (const n of live) n.problem = null;

        for (const client of live) {
            if (client.kind !== "client" || !client.traffic) continue;
            const kind = ROUTES[client.traffic][0];
            const target = live.some(
                (s) =>
                    s.kind === kind &&
                    s.role !== "standby" &&
                    this.distFrom(client, this.field(s.id)) !== Infinity,
            );
            if (!target) {
                client.problem = `No route to ${kind}.`;
                add(`${client.name} has no route to ${kind}. Draw a link.`);
                const to = closest(client, kind);
                if (to) hints.push({ from: client.id, to: to.id });
            }
        }

        for (const service of live) {
            if (service.kind === "client" || service.kind === "alb") continue;
            const route = ROUTES[service.traffic!];
            const i = route.indexOf(service.kind as ServiceKind);
            if (i < 0 || i + 1 >= route.length) continue;
            if (service.role === "standby") continue;
            const nextKind = route[i + 1];
            const reachable = live.some(
                (s) =>
                    s.kind === nextKind &&
                    s.role !== "standby" &&
                    this.distFrom(service, this.field(s.id)) !== Infinity,
            );
            if (!reachable && live.some((s) => s.kind === nextKind)) {
                service.problem = `No route to ${nextKind}.`;
                add(`${service.name} can't reach ${nextKind}. Connect them.`);
                const to = closest(service, nextKind);
                if (to) hints.push({ from: service.id, to: to.id });
            }
        }

        for (const db of live) {
            if (db.role !== "standby") continue;
            const reach = live.some(
                (s) =>
                    s.kind === "ec2" &&
                    this.distFrom(s, this.field(db.id)) !== Infinity,
            );
            if (!reach) {
                db.problem = "No route from a web app, so failover goes nowhere.";
                add(`${db.name} isn't connected. Failover would go nowhere.`);
                const from = closest(db, "ec2");
                if (from) hints.push({ from: from.id, to: db.id });
            }
        }

        const held = (Object.keys(this.inv) as ItemId[]).find(
            (k) => k !== "links" && k !== "bridge" && this.inv[k] > 0,
        );
        if (held) add(`You have an unused ${ITEM_INFO[held].name}. Select it below to place it.`);

        const multiEc2 = live.filter((n) => n.kind === "ec2").length > 1;
        const hasAlb = live.some((n) => n.kind === "alb");
        if (multiEc2 && !hasAlb) {
            add("Clients only use their closest EC2. A load balancer would spread them out.");
        }

        const single = live.find((n) => n.role === "primary" && n.peer < 0);
        if (single && this.sprint >= 2) {
            add(`${single.name} is single-AZ. An AZ outage will take it down.`);
        }

        this.advice = advice;
        this.hints = hints;
    }

    // ---------- Main update ----------

    private anyClientConnected() {
        for (const n of this.nodes) {
            if (n.gone || n.kind !== "client" || !n.traffic) continue;
            if (this.firstTarget(n, ROUTES[n.traffic][0])) return true;
        }
        return false;
    }

    /** Advances the world by one fixed step. */
    step() {
        if (this.phase !== "playing") return;
        const dt = SIM_DT;

        this.adviceClock -= dt;
        if (this.adviceClock <= 0) {
            this.adviceClock = 1;
            this.stepAdvice();
        }

        if (!this.clockStarted) {
            if (!this.anyClientConnected()) return;
            this.clockStarted = true;
            this.setBanner(
                "Requests are flowing",
                "Demand keeps growing. Survive each sprint to choose an upgrade.",
                "good",
                6,
            );
        }

        this.time += dt;
        this.sprintTime += dt;

        for (let i = 0; i < this.plan.length; i++) {
            if (this.sprintTime >= this.plan[i].at) {
                const entry = this.plan[i];
                this.plan.splice(i, 1);
                i--;
                entry.run();
            }
        }

        this.stepOutage();
        this.stepFailover();
        this.stepClients(dt);
        this.stepServices(dt);
        this.stepCars(dt);
        this.stepBudget(dt);

        this.windowTime += dt;
        if (this.windowTime >= 1) {
            this.rps = this.rps * 0.6 + (this.servedThisWindow / this.windowTime) * 0.4;
            if (this.rps > this.peakRps) this.peakRps = this.rps;
            this.servedThisWindow = 0;
            this.windowTime = 0;
        }

        if (this.banner && this.time > this.banner.until) this.banner = null;

        if (this.phase === "playing" && this.sprintTime >= this.sprintLength) {
            this.makeChoice();
        }
    }
}
