// Canvas renderer. The map and roads rarely change, so they are baked into an
// offscreen layer and only rebuilt when the simulation says something moved.
// Cars are batched into one path per colour, which keeps a busy late game cheap.

import type { ItemId, Traffic } from "./content";
import {
    PENDING_CAP,
    type Car,
    type CarType,
    type Sim,
    type SimNode,
} from "./sim";

export type Insets = { top: number; right: number; bottom: number; left: number };

type Palette = {
    letterbox: string;
    land: [string, string, string];
    outside: string;
    edge: string;
    river: string;
    grid: string;
    road: string;
    roadLine: string;
    bridge: string;
    label: string;
    nodeText: string;
    albBody: string;
    shadow: string;
    dead: string;
    outage: string;
    warn: string;
    dx: string;
    highlight: string;
};

const LIGHT: Palette = {
    letterbox: "#ece6d8",
    land: ["#f6f2e8", "#fbf8f1", "#f6f2e8"],
    outside: "#e9e3d5",
    edge: "rgba(70,60,40,0.22)",
    river: "#b9d6e8",
    grid: "rgba(70,60,40,0.1)",
    road: "#57524a",
    roadLine: "rgba(255,255,255,0.28)",
    bridge: "#8b7f6c",
    label: "rgba(70,60,40,0.42)",
    nodeText: "rgba(50,44,32,0.72)",
    albBody: "#2a2723",
    shadow: "rgba(40,30,10,0.16)",
    dead: "#a39c8e",
    outage: "rgba(220,50,40,",
    warn: "rgba(235,140,20,",
    dx: "#e8590c",
    highlight: "#e8590c",
};

const DARK: Palette = {
    letterbox: "#0e0e0d",
    land: ["#191917", "#1e1e1b", "#191917"],
    outside: "#111110",
    edge: "rgba(240,230,210,0.16)",
    river: "#1d3a4f",
    grid: "rgba(240,230,210,0.07)",
    road: "#77736b",
    roadLine: "rgba(20,20,18,0.35)",
    bridge: "#9b907e",
    label: "rgba(240,230,210,0.3)",
    nodeText: "rgba(240,230,210,0.66)",
    albBody: "#f1ece0",
    shadow: "rgba(0,0,0,0.35)",
    dead: "#4d4a44",
    outage: "rgba(240,70,60,",
    warn: "rgba(245,160,50,",
    dx: "#fb8a3c",
    highlight: "#fb8a3c",
};

const TRAFFIC_COLOR: Record<CarType, string> = {
    web: "#3b82f6",
    static: "#0ea371",
    api: "#ea8a00",
    jobs: "#a855f7",
    attack: "#ef4444",
};

const CAR_TYPES: CarType[] = ["web", "static", "api", "jobs", "attack"];

// Icons live in a unit box centred on the origin and are stroked with a light
// colour on top of the building's body.
const ICON_SOURCES: Record<string, string> = {
    ec2: "M-.26-.26h.52v.52h-.52zM-.1-.1h.2v.2h-.2zM-.13-.26v-.13M.13-.26v-.13M-.13.39v-.13M.13.39v-.13M-.26-.13h-.13M-.26.13h-.13M.39-.13h-.13M.39.13h-.13",
    rds: "M-.32-.24C-.32-.42.32-.42.32-.24C.32-.06-.32-.06-.32-.24M-.32-.24V.24C-.32.42.32.42.32.24V-.24M-.32 0C-.32.18.32.18.32 0",
    s3: "M-.34-.24C-.34-.4.34-.4.34-.24C.34-.08-.34-.08-.34-.24M-.34-.24L-.22.3C-.2.42.2.42.22.3L.34-.24",
    lambda: "M-.26-.38H-.1L.28.38M-.03-.08L-.28.38",
    dynamo: "M.08-.4L-.24.06H0L-.08.4L.24-.06H0Z",
    sqs: "M-.38-.18h.18v.36h-.18zM-.12-.18h.18v.36h-.18zM.14-.18L.38 0L.14.18",
    worker: "M0-.15A.15.15 0 1 1 0 .15A.15.15 0 1 1 0-.15M0-.4V-.26M0 .26V.4M-.35-.2L-.23-.13M.23.13L.35.2M-.35.2L-.23.13M.23-.13L.35-.2",
    person: "M0-.34A.15.15 0 1 1 0-.04A.15.15 0 1 1 0-.34M-.3.34C-.3.04.3.04.3.34",
    alb: "M-.36 0H-.08M-.08 0L.3-.3M-.08 0H.3M-.08 0L.3.3",
    x: "M-.28-.28L.28.28M.28-.28L-.28.28",
};

type Ripple = {
    active: boolean;
    x: number;
    y: number;
    age: number;
    life: number;
    color: string;
};

export type ToolHighlight = {
    tool: ItemId | "draw" | "erase";
    dxStart: number;
    hoverCell: number;
};

export class Renderer {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly layer: HTMLCanvasElement;
    private readonly layerCtx: CanvasRenderingContext2D;
    private readonly icons = new Map<string, Path2D>();
    private palette: Palette = LIGHT;
    private font = "ui-monospace, monospace";

    private cssW = 1;
    private cssH = 1;
    private ratio = 1;
    private quality = 1;
    private insets: Insets = { top: 0, right: 0, bottom: 0, left: 0 };

    // Camera: the fitted view, plus whatever the player has pinched to.
    private scale = 20;
    private ox = 0;
    private oy = 0;
    private fitReady = false;
    userZoom = 1;
    userPanX = 0;
    userPanY = 0;

    private bakedVersion = -1;
    private bakedKey = "";
    private ripples: Ripple[] = [];
    private readonly reducedMotion: boolean;
    private carPaths: Array<Array<number>> = [];

    constructor(private readonly canvas: HTMLCanvasElement) {
        this.ctx = canvas.getContext("2d", { alpha: false })!;
        this.layer = document.createElement("canvas");
        this.layerCtx = this.layer.getContext("2d", { alpha: false })!;
        for (const key of Object.keys(ICON_SOURCES)) {
            this.icons.set(key, new Path2D(ICON_SOURCES[key]));
        }
        for (let i = 0; i < 28; i++) {
            this.ripples.push({
                active: false,
                x: 0,
                y: 0,
                age: 0,
                life: 1,
                color: "#fff",
            });
        }
        for (let i = 0; i < CAR_TYPES.length * 2; i++) {
            this.carPaths.push([]);
        }
        this.reducedMotion =
            window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ??
            false;
        const mono = getComputedStyle(document.body)
            .getPropertyValue("--font-jetbrains-mono")
            .trim();
        if (mono) this.font = `${mono}, ui-monospace, monospace`;
    }

    setTheme(dark: boolean) {
        const next = dark ? DARK : LIGHT;
        if (next !== this.palette) {
            this.palette = next;
            this.bakedVersion = -1;
        }
    }

    setInsets(insets: Insets) {
        this.insets = insets;
        this.fitReady = false;
    }

    resize(cssW: number, cssH: number) {
        this.cssW = Math.max(1, cssW);
        this.cssH = Math.max(1, cssH);
        this.applyResolution();
        this.fitReady = false;
    }

    /** Called when frames run long. Trades sharpness for speed. */
    lowerQuality(): boolean {
        if (this.quality <= 0.55) return false;
        this.quality = Math.max(0.55, this.quality * 0.8);
        this.applyResolution();
        return true;
    }

    private applyResolution() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        // Cap the buffer at roughly 1440p so huge displays can't balloon memory.
        const maxPixels = 3_700_000;
        const pixels = this.cssW * this.cssH * dpr * dpr;
        const limit = pixels > maxPixels ? Math.sqrt(maxPixels / pixels) : 1;
        this.ratio = dpr * limit * this.quality;
        const w = Math.round(this.cssW * this.ratio);
        const h = Math.round(this.cssH * this.ratio);
        if (this.canvas.width !== w || this.canvas.height !== h) {
            this.canvas.width = w;
            this.canvas.height = h;
        }
        if (this.layer.width !== w || this.layer.height !== h) {
            this.layer.width = w;
            this.layer.height = h;
        }
        this.bakedVersion = -1;
    }

    // ---------- Camera ----------

    private fitTarget(sim: Sim) {
        const b = sim.bounds;
        const pad = 0.5;
        const areaW = Math.max(40, this.cssW - this.insets.left - this.insets.right);
        const areaH = Math.max(40, this.cssH - this.insets.top - this.insets.bottom);
        const worldW = b.x1 - b.x0 + 1 + pad * 2;
        const worldH = b.y1 - b.y0 + 1 + pad * 2;
        const fit = Math.min(areaW / worldW, areaH / worldH);
        const scale = fit * this.userZoom;
        const cx = (b.x0 + b.x1 + 1) / 2;
        const cy = (b.y0 + b.y1 + 1) / 2;
        const ox = this.insets.left + areaW / 2 - cx * scale + this.userPanX;
        const oy = this.insets.top + areaH / 2 - cy * scale + this.userPanY;
        return { scale, ox, oy, fit };
    }

    /** Zooms around a screen point and keeps the map on screen. */
    zoomAt(sim: Sim, factor: number, sx: number, sy: number) {
        const before = this.userZoom;
        const next = Math.max(1, Math.min(3, before * factor));
        if (next === before) return;
        const target = this.fitTarget(sim);
        const wx = (sx - target.ox) / target.scale;
        const wy = (sy - target.oy) / target.scale;
        this.userZoom = next;
        const after = this.fitTarget(sim);
        this.userPanX += sx - (wx * after.scale + after.ox);
        this.userPanY += sy - (wy * after.scale + after.oy);
        this.clampPan(sim);
    }

    panBy(sim: Sim, dx: number, dy: number) {
        this.userPanX += dx;
        this.userPanY += dy;
        this.clampPan(sim);
    }

    private clampPan(sim: Sim) {
        if (this.userZoom <= 1) {
            this.userPanX = 0;
            this.userPanY = 0;
            return;
        }
        const b = sim.bounds;
        const target = this.fitTarget(sim);
        const worldW = (b.x1 - b.x0 + 2) * target.scale;
        const worldH = (b.y1 - b.y0 + 2) * target.scale;
        const areaW = this.cssW - this.insets.left - this.insets.right;
        const areaH = this.cssH - this.insets.top - this.insets.bottom;
        const limitX = Math.max(0, (worldW - areaW) / 2 + 12);
        const limitY = Math.max(0, (worldH - areaH) / 2 + 12);
        this.userPanX = Math.max(-limitX, Math.min(limitX, this.userPanX));
        this.userPanY = Math.max(-limitY, Math.min(limitY, this.userPanY));
    }

    resetView() {
        this.userZoom = 1;
        this.userPanX = 0;
        this.userPanY = 0;
    }

    private updateCamera(sim: Sim, dt: number): boolean {
        const t = this.fitTarget(sim);
        if (!this.fitReady || this.reducedMotion) {
            this.fitReady = true;
            const moved =
                this.scale !== t.scale || this.ox !== t.ox || this.oy !== t.oy;
            this.scale = t.scale;
            this.ox = t.ox;
            this.oy = t.oy;
            return moved;
        }
        const k = Math.min(1, dt * 5);
        const dScale = t.scale - this.scale;
        const dx = t.ox - this.ox;
        const dy = t.oy - this.oy;
        if (Math.abs(dScale) < 0.01 && Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
            const moved = dScale !== 0 || dx !== 0 || dy !== 0;
            this.scale = t.scale;
            this.ox = t.ox;
            this.oy = t.oy;
            return moved;
        }
        this.scale += dScale * k;
        this.ox += dx * k;
        this.oy += dy * k;
        return true;
    }

    /** Converts a screen position to a cell index, or -1 when off the map. */
    cellAt(sim: Sim, sx: number, sy: number): number {
        const x = Math.floor((sx - this.ox) / this.scale);
        const y = Math.floor((sy - this.oy) / this.scale);
        if (x < 0 || y < 0 || x >= sim.W || y >= sim.H) return -1;
        return sim.cellOf(x, y);
    }

    // ---------- Static layer ----------

    private bake(sim: Sim) {
        const ctx = this.layerCtx;
        const p = this.palette;
        const { W, H } = sim;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillStyle = p.letterbox;
        ctx.fillRect(0, 0, this.layer.width, this.layer.height);

        const r = this.ratio;
        const s = this.scale;
        ctx.setTransform(r * s, 0, 0, r * s, r * this.ox, r * this.oy);

        // Land, tinted per AZ. Merging runs keeps seams out of the fill.
        for (let y = 0; y < H; y++) {
            let start = 0;
            for (let x = 1; x <= W; x++) {
                const a = sim.zone[sim.cellOf(start, y)];
                if (x === W || sim.zone[sim.cellOf(x, y)] !== a) {
                    ctx.fillStyle = p.land[a];
                    ctx.fillRect(start, y, x - start, 1.02);
                    start = x;
                }
            }
        }

        this.bakeRivers(ctx, sim);

        const b = sim.bounds;
        if (s >= 13) {
            ctx.fillStyle = p.grid;
            const d = 0.05;
            for (let y = b.y0; y <= b.y1 + 1; y++) {
                for (let x = b.x0; x <= b.x1 + 1; x++) {
                    ctx.fillRect(x - d, y - d, d * 2, d * 2);
                }
            }
        }

        this.bakeRoads(ctx, sim);

        // Anything past the current region boundary is out of reach for now.
        ctx.fillStyle = p.outside;
        const margin = Math.max(W, H);
        ctx.globalAlpha = 0.86;
        ctx.fillRect(-margin, -margin, W + margin * 2, b.y0 + margin);
        ctx.fillRect(-margin, b.y1 + 1, W + margin * 2, H - b.y1 + margin);
        ctx.fillRect(-margin, b.y0, b.x0 + margin, b.y1 - b.y0 + 1);
        ctx.fillRect(b.x1 + 1, b.y0, W - b.x1 + margin, b.y1 - b.y0 + 1);
        ctx.globalAlpha = 1;
        ctx.strokeStyle = p.edge;
        ctx.lineWidth = 0.05;
        ctx.setLineDash([0.25, 0.2]);
        ctx.strokeRect(b.x0, b.y0, b.x1 - b.x0 + 1, b.y1 - b.y0 + 1);
        ctx.setLineDash([]);

        this.bakeLabels(ctx, sim);
    }

    private bakeRivers(ctx: CanvasRenderingContext2D, sim: Sim) {
        const { W, H, vertical } = sim;
        const cross = vertical ? H : W;
        const main = vertical ? W : H;
        const paths: Array<Array<[number, number]>> = [[], []];
        for (let t = 0; t < cross; t++) {
            let which = 0;
            for (let m = 0; m < main; m++) {
                const c = vertical ? sim.cellOf(m, t) : sim.cellOf(t, m);
                if (sim.terrain[c]) {
                    const pt: [number, number] = vertical
                        ? [m + 0.5, t + 0.5]
                        : [t + 0.5, m + 0.5];
                    paths[which++]?.push(pt);
                }
            }
        }
        ctx.strokeStyle = this.palette.river;
        ctx.lineWidth = 0.96;
        ctx.lineJoin = "round";
        ctx.lineCap = "square";
        for (const path of paths) {
            if (path.length < 2) continue;
            ctx.beginPath();
            ctx.moveTo(path[0][0], path[0][1]);
            for (let i = 1; i < path.length; i++) {
                ctx.lineTo(path[i][0], path[i][1]);
            }
            ctx.stroke();
        }
    }

    private bakeRoads(ctx: CanvasRenderingContext2D, sim: Sim) {
        const p = this.palette;
        const { W, H } = sim;

        const trace = (only: (a: number, b: number) => boolean) => {
            ctx.beginPath();
            for (let y = 0; y < H; y++) {
                for (let x = 0; x < W; x++) {
                    const a = sim.cellOf(x, y);
                    const bits = sim.conn[a];
                    if (!bits) continue;
                    // Each link is stored both ways, so draw half the directions.
                    if (bits & 1 && only(a, a + 1)) {
                        ctx.moveTo(x + 0.5, y + 0.5);
                        ctx.lineTo(x + 1.5, y + 0.5);
                    }
                    if (bits & 2 && only(a, a + W + 1)) {
                        ctx.moveTo(x + 0.5, y + 0.5);
                        ctx.lineTo(x + 1.5, y + 1.5);
                    }
                    if (bits & 4 && only(a, a + W)) {
                        ctx.moveTo(x + 0.5, y + 0.5);
                        ctx.lineTo(x + 0.5, y + 1.5);
                    }
                    if (bits & 8 && only(a, a + W - 1)) {
                        ctx.moveTo(x + 0.5, y + 0.5);
                        ctx.lineTo(x - 0.5, y + 1.5);
                    }
                }
            }
        };

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        trace((a, b) => sim.road[a] === 2 || sim.road[b] === 2);
        ctx.strokeStyle = p.bridge;
        ctx.lineWidth = 0.72;
        ctx.stroke();

        trace(() => true);
        ctx.strokeStyle = p.road;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        if (this.scale >= 18) {
            ctx.strokeStyle = p.roadLine;
            ctx.lineWidth = 0.035;
            ctx.setLineDash([0.12, 0.16]);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // Direct Connect arcs sit on top of everything else.
        for (const link of sim.dx) {
            if (!link) continue;
            const ax = link.a % W;
            const ay = (link.a - ax) / W;
            const bx = link.b % W;
            const by = (link.b - bx) / W;
            ctx.strokeStyle = p.dx;
            ctx.lineWidth = 0.28;
            ctx.beginPath();
            ctx.moveTo(ax + 0.5, ay + 0.5);
            ctx.lineTo(bx + 0.5, by + 0.5);
            ctx.stroke();
            ctx.strokeStyle = "rgba(255,255,255,0.75)";
            ctx.lineWidth = 0.05;
            ctx.setLineDash([0.2, 0.24]);
            ctx.stroke();
            ctx.setLineDash([]);
            for (const [x, y] of [
                [ax, ay],
                [bx, by],
            ]) {
                ctx.fillStyle = p.dx;
                ctx.beginPath();
                ctx.arc(x + 0.5, y + 0.5, 0.26, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Dotted replication lines between each primary and its standby.
        for (const n of sim.nodes) {
            if (n.gone || n.role !== "primary" || n.peer < 0) continue;
            const peer = sim.nodes[n.peer];
            ctx.strokeStyle = TRAFFIC_COLOR.web;
            ctx.globalAlpha = 0.45;
            ctx.lineWidth = 0.06;
            ctx.setLineDash([0.1, 0.18]);
            ctx.beginPath();
            ctx.moveTo(n.x + 1, n.y + 1);
            ctx.lineTo(peer.x + 1, peer.y + 1);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.globalAlpha = 1;
        }
    }

    private bakeLabels(ctx: CanvasRenderingContext2D, sim: Sim) {
        const p = this.palette;
        const r = this.ratio;
        const s = this.scale;
        ctx.setTransform(r, 0, 0, r, 0, 0);
        const b = sim.bounds;

        // AZ names, placed at the top of each zone's visible strip.
        ctx.fillStyle = p.label;
        ctx.font = `600 ${Math.max(10, Math.min(13, s * 0.46))}px ${this.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let zone = 0; zone < 3; zone++) {
            let sumX = 0;
            let sumY = 0;
            let count = 0;
            let minCross = Infinity;
            for (let y = b.y0; y <= b.y1; y++) {
                for (let x = b.x0; x <= b.x1; x++) {
                    const c = sim.cellOf(x, y);
                    if (sim.zone[c] !== zone || sim.terrain[c]) continue;
                    sumX += x;
                    sumY += y;
                    count++;
                    minCross = Math.min(minCross, sim.vertical ? y : x);
                }
            }
            if (count < 6) continue;
            const wx = sim.vertical ? sumX / count + 0.5 : minCross + 1.4;
            const wy = sim.vertical ? minCross + 0.55 : sumY / count + 0.5;
            ctx.fillText(
                `AZ-${"ABC"[zone]}`,
                wx * s + this.ox,
                wy * s + this.oy,
            );
        }

        if (s >= 17) {
            ctx.font = `500 ${Math.min(11, s * 0.36)}px ${this.font}`;
            ctx.fillStyle = p.nodeText;
            ctx.textBaseline = "top";
            for (const n of sim.nodes) {
                if (n.gone || n.kind === "client" || n.kind === "alb") continue;
                ctx.fillText(
                    n.name,
                    (n.x + n.size / 2) * s + this.ox,
                    (n.y + n.size + 0.04) * s + this.oy,
                );
            }
        }
    }

    // ---------- Frame ----------

    draw(sim: Sim, tool: ToolHighlight, dt: number, now: number) {
        const cameraMoved = this.updateCamera(sim, dt);
        const key = `${sim.bounds.x0}:${sim.bounds.x1}:${sim.bounds.y0}`;
        if (
            cameraMoved ||
            this.bakedVersion !== sim.staticVersion ||
            this.bakedKey !== key
        ) {
            this.bake(sim);
            this.bakedVersion = sim.staticVersion;
            this.bakedKey = key;
        }

        const ctx = this.ctx;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.drawImage(this.layer, 0, 0);

        const r = this.ratio;
        const s = this.scale;
        ctx.setTransform(r * s, 0, 0, r * s, r * this.ox, r * this.oy);

        this.drawOutage(ctx, sim, now);
        this.drawHints(ctx, sim, now);
        this.drawToolHints(ctx, sim, tool, now);
        this.drawCars(ctx, sim, dt);
        this.drawNodes(ctx, sim, now);
        this.consumeFx(sim);
        this.drawRipples(ctx, dt);

        return cameraMoved;
    }

    /** True while something needs animating, even when the game is paused. */
    get busy() {
        return this.ripples.some((ripple) => ripple.active);
    }

    private drawOutage(ctx: CanvasRenderingContext2D, sim: Sim, now: number) {
        const outage = sim.outage;
        if (!outage) return;
        const p = this.palette;
        const active = outage.phase === "active";
        const pulse = this.reducedMotion ? 0.5 : 0.5 + 0.5 * Math.sin(now * 0.006);
        ctx.fillStyle = active
            ? `${p.outage}0.13)`
            : `${p.warn}${(0.05 + pulse * 0.1).toFixed(3)})`;
        const { W, H } = sim;
        for (let y = 0; y < H; y++) {
            let start = -1;
            for (let x = 0; x <= W; x++) {
                const inside =
                    x < W && sim.zone[sim.cellOf(x, y)] === outage.zone;
                if (inside && start < 0) start = x;
                if (!inside && start >= 0) {
                    ctx.fillRect(start, y, x - start, 1.01);
                    start = -1;
                }
            }
        }
    }

    private drawHints(ctx: CanvasRenderingContext2D, sim: Sim, now: number) {
        if (sim.hints.length === 0) return;
        ctx.lineWidth = 0.09;
        ctx.lineCap = "round";
        ctx.setLineDash([0.12, 0.28]);
        ctx.lineDashOffset = this.reducedMotion ? 0 : -(now * 0.0012) % 0.4;
        for (const hint of sim.hints) {
            const a = sim.nodes[hint.from];
            const b = sim.nodes[hint.to];
            if (!a || !b) continue;
            ctx.strokeStyle = TRAFFIC_COLOR[a.traffic ?? "web"];
            ctx.globalAlpha = 0.65;
            ctx.beginPath();
            ctx.moveTo(a.x + a.size / 2, a.y + a.size / 2);
            ctx.lineTo(b.x + b.size / 2, b.y + b.size / 2);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0;
    }

    private toolAccepts(tool: ItemId | "draw" | "erase", n: SimNode) {
        switch (tool) {
            case "asg":
                return (
                    ["ec2", "rds", "lambda", "dynamo", "worker"].includes(n.kind) &&
                    n.role !== "standby" &&
                    n.instances < 6
                );
            case "cache":
                return (n.kind === "ec2" || n.kind === "lambda") && !n.cache;
            case "cdn":
                return n.kind === "s3" && !n.cdn;
            case "waf":
                return n.kind === "alb" && !n.waf;
            default:
                return false;
        }
    }

    private drawToolHints(
        ctx: CanvasRenderingContext2D,
        sim: Sim,
        h: ToolHighlight,
        now: number,
    ) {
        const p = this.palette;
        const pulse = this.reducedMotion ? 0.7 : 0.55 + 0.45 * Math.sin(now * 0.006);

        // Valid road tiles for items that sit on the network.
        if (h.tool === "alb" || h.tool === "tgw") {
            ctx.fillStyle = p.highlight;
            ctx.globalAlpha = 0.35 + pulse * 0.4;
            const b = sim.bounds;
            for (let y = b.y0; y <= b.y1; y++) {
                for (let x = b.x0; x <= b.x1; x++) {
                    const c = sim.cellOf(x, y);
                    if (!sim.road[c] || sim.road[c] === 2) continue;
                    if (sim.albAt[c] >= 0 || sim.tgw[c]) continue;
                    if (h.tool === "tgw" && sim.deg[c] < 3) continue;
                    ctx.beginPath();
                    ctx.arc(x + 0.5, y + 0.5, 0.17, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            ctx.globalAlpha = 1;
        }

        // Valid buildings for items that attach to one.
        ctx.lineWidth = 0.1;
        for (const n of sim.nodes) {
            if (n.gone || !this.toolAccepts(h.tool, n)) continue;
            ctx.strokeStyle = p.highlight;
            ctx.globalAlpha = 0.4 + pulse * 0.6;
            ctx.beginPath();
            if (n.kind === "alb") {
                ctx.arc(n.x + 0.5, n.y + 0.5, 0.62, 0, Math.PI * 2);
            } else {
                ctx.roundRect(n.x - 0.12, n.y - 0.12, n.size + 0.24, n.size + 0.24, 0.4);
            }
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        if (h.tool === "standby") {
            for (const n of sim.nodes) {
                if (n.gone || n.role !== "primary" || n.peer >= 0) continue;
                // Tint the AZs a standby could go in.
                ctx.fillStyle = p.highlight;
                ctx.globalAlpha = 0.05 + pulse * 0.07;
                const { W, H } = sim;
                for (let y = 0; y < H; y++) {
                    for (let x = 0; x < W; x++) {
                        const c = sim.cellOf(x, y);
                        if (sim.zone[c] !== n.zone && sim.inBounds(c) && !sim.terrain[c]) {
                            ctx.fillRect(x, y, 1.01, 1.01);
                        }
                    }
                }
                ctx.globalAlpha = 1;
                break;
            }
        }

        if (h.tool === "dx" && h.dxStart >= 0) {
            const x = h.dxStart % sim.W;
            const y = (h.dxStart - x) / sim.W;
            ctx.fillStyle = p.dx;
            ctx.beginPath();
            ctx.arc(x + 0.5, y + 0.5, 0.3, 0, Math.PI * 2);
            ctx.fill();
            if (h.hoverCell >= 0) {
                const hx = h.hoverCell % sim.W;
                const hy = (h.hoverCell - hx) / sim.W;
                ctx.strokeStyle = p.dx;
                ctx.lineWidth = 0.1;
                ctx.setLineDash([0.2, 0.2]);
                ctx.beginPath();
                ctx.moveTo(x + 0.5, y + 0.5);
                ctx.lineTo(hx + 0.5, hy + 0.5);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        if (h.hoverCell >= 0 && sim.inBounds(h.hoverCell)) {
            const x = h.hoverCell % sim.W;
            const y = (h.hoverCell - x) / sim.W;
            const erasing = h.tool === "erase";
            ctx.strokeStyle = erasing ? "#ef4444" : p.highlight;
            ctx.globalAlpha = 0.65;
            ctx.lineWidth = 0.06;
            ctx.beginPath();
            const size = h.tool === "standby" ? 2 : 1;
            ctx.roundRect(x + 0.06, y + 0.06, size - 0.12, size - 0.12, 0.16);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
    }

    private drawCars(ctx: CanvasRenderingContext2D, sim: Sim, dt: number) {
        const paths = this.carPaths;
        for (const path of paths) path.length = 0;
        const k = this.reducedMotion ? 1 : Math.min(1, dt * 16);
        const offset = 0.11;
        const halfLen = 0.16;
        const halfWid = 0.085;
        const cars: Car[] = sim.cars;
        for (let i = 0; i < cars.length; i++) {
            const car = cars[i];
            const lane = car.lane;
            if (!lane) {
                car.fresh = true;
                continue;
            }
            const tx = lane.fx + lane.dirX * car.s - lane.dirY * offset;
            const ty = lane.fy + lane.dirY * car.s + lane.dirX * offset;
            if (car.fresh) {
                car.vx = tx;
                car.vy = ty;
                car.hx = lane.dirX;
                car.hy = lane.dirY;
                car.fresh = false;
            } else {
                // Easing towards the lane position rounds off the corners.
                car.vx += (tx - car.vx) * k;
                car.vy += (ty - car.vy) * k;
                car.hx += (lane.dirX - car.hx) * k;
                car.hy += (lane.dirY - car.hy) * k;
            }
            const mag = Math.hypot(car.hx, car.hy) || 1;
            const fx = car.hx / mag;
            const fy = car.hy / mag;
            const x = car.vx;
            const y = car.vy;
            const index =
                CAR_TYPES.indexOf(car.type) * 2 + (car.returning ? 1 : 0);
            paths[index].push(
                x + fx * halfLen - fy * halfWid,
                y + fy * halfLen + fx * halfWid,
                x + fx * halfLen + fy * halfWid,
                y + fy * halfLen - fx * halfWid,
                x - fx * halfLen + fy * halfWid,
                y - fy * halfLen - fx * halfWid,
                x - fx * halfLen - fy * halfWid,
                y - fy * halfLen + fx * halfWid,
            );
        }
        for (let t = 0; t < CAR_TYPES.length; t++) {
            for (let returning = 0; returning < 2; returning++) {
                const path = paths[t * 2 + returning];
                if (path.length === 0) continue;
                ctx.fillStyle = TRAFFIC_COLOR[CAR_TYPES[t]];
                // Responses are paler than requests, so direction reads at a glance.
                ctx.globalAlpha = returning ? 0.55 : 1;
                ctx.beginPath();
                for (let i = 0; i < path.length; i += 8) {
                    ctx.moveTo(path[i], path[i + 1]);
                    ctx.lineTo(path[i + 2], path[i + 3]);
                    ctx.lineTo(path[i + 4], path[i + 5]);
                    ctx.lineTo(path[i + 6], path[i + 7]);
                    ctx.closePath();
                }
                ctx.fill();
            }
        }
        ctx.globalAlpha = 1;
    }

    private icon(
        ctx: CanvasRenderingContext2D,
        name: string,
        cx: number,
        cy: number,
        size: number,
        color: string,
        fill = false,
    ) {
        const path = this.icons.get(name);
        if (!path) return;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(size, size);
        if (fill) {
            ctx.fillStyle = color;
            ctx.fill(path);
        } else {
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.09;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.stroke(path);
        }
        ctx.restore();
    }

    private clientShape(
        ctx: CanvasRenderingContext2D,
        traffic: Traffic,
        cx: number,
        cy: number,
        r: number,
    ) {
        ctx.beginPath();
        switch (traffic) {
            case "web":
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                break;
            case "static":
                ctx.roundRect(cx - r * 0.92, cy - r * 0.92, r * 1.84, r * 1.84, r * 0.3);
                break;
            case "api":
                ctx.moveTo(cx, cy - r * 1.14);
                ctx.lineTo(cx + r * 1.12, cy + r * 0.82);
                ctx.lineTo(cx - r * 1.12, cy + r * 0.82);
                ctx.closePath();
                break;
            case "jobs":
                ctx.moveTo(cx, cy - r * 1.2);
                ctx.lineTo(cx + r * 1.2, cy);
                ctx.lineTo(cx, cy + r * 1.2);
                ctx.lineTo(cx - r * 1.2, cy);
                ctx.closePath();
                break;
        }
    }

    private drawNodes(ctx: CanvasRenderingContext2D, sim: Sim, now: number) {
        const p = this.palette;
        const pulse = this.reducedMotion ? 0.5 : 0.5 + 0.5 * Math.sin(now * 0.008);
        for (const n of sim.nodes) {
            if (n.gone) continue;
            if (n.kind === "client") this.drawClient(ctx, n, pulse);
            else if (n.kind === "alb") this.drawAlb(ctx, n);
            else this.drawService(ctx, sim, n, pulse);
            // New arrivals pulse for a few seconds so they're hard to miss.
            const age = sim.time - n.bornAt;
            if (age < 5 && n.kind !== "alb" && !this.reducedMotion) {
                ctx.strokeStyle = p.highlight;
                ctx.lineWidth = 0.07;
                ctx.globalAlpha = (1 - age / 5) * (0.35 + 0.5 * pulse);
                ctx.beginPath();
                ctx.arc(
                    n.x + n.size / 2,
                    n.y + n.size / 2,
                    n.size * 0.72 + pulse * 0.16,
                    0,
                    Math.PI * 2,
                );
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }

        // Transit gateways are drawn over the road, under nothing.
        const b = sim.bounds;
        for (let y = b.y0; y <= b.y1; y++) {
            for (let x = b.x0; x <= b.x1; x++) {
                if (!sim.tgw[sim.cellOf(x, y)]) continue;
                ctx.strokeStyle = p.highlight;
                ctx.lineWidth = 0.09;
                ctx.beginPath();
                ctx.arc(x + 0.5, y + 0.5, 0.36, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }

    private drawClient(ctx: CanvasRenderingContext2D, n: SimNode, pulse: number) {
        const traffic = n.traffic as Traffic;
        const cx = n.x + 0.5;
        const cy = n.y + 0.5;
        const r = 0.38 + n.happy * 0.03;
        const p = this.palette;

        this.clientShape(ctx, traffic, cx + 0.02, cy + 0.05, r);
        ctx.fillStyle = p.shadow;
        ctx.fill();

        this.clientShape(ctx, traffic, cx, cy, r);
        ctx.fillStyle = TRAFFIC_COLOR[traffic];
        ctx.fill();
        this.icon(ctx, "person", cx, cy + (traffic === "api" ? 0.05 : 0), 0.58, "#fff");

        // The ring is the request backlog. A full ring burns error budget.
        const fill = n.pending / PENDING_CAP;
        if (fill > 0.18) {
            const danger = n.breach;
            ctx.lineWidth = danger ? 0.13 : 0.1;
            ctx.lineCap = "round";
            ctx.strokeStyle = danger
                ? "#ef4444"
                : fill > 0.6
                  ? "#f97316"
                  : TRAFFIC_COLOR[traffic];
            ctx.globalAlpha = danger ? 0.55 + pulse * 0.45 : 0.95;
            ctx.beginPath();
            ctx.arc(
                cx,
                cy,
                0.6 + (danger ? pulse * 0.07 : 0),
                -Math.PI / 2,
                -Math.PI / 2 + Math.PI * 2 * Math.min(1, fill),
            );
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        if (n.problem) this.badge(ctx, cx + 0.42, cy - 0.42, 0.17, "!", "#ef4444");
    }

    private drawAlb(ctx: CanvasRenderingContext2D, n: SimNode) {
        const cx = n.x + 0.5;
        const cy = n.y + 0.5;
        const p = this.palette;
        ctx.fillStyle = p.albBody;
        ctx.beginPath();
        ctx.arc(cx, cy, 0.46, 0, Math.PI * 2);
        ctx.fill();
        this.icon(ctx, "alb", cx, cy, 0.62, p === DARK ? "#1a1a18" : "#fff");
        if (n.waf) {
            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 0.09;
            ctx.beginPath();
            ctx.arc(cx, cy, 0.54, 0, Math.PI * 2);
            ctx.stroke();
        }
    }

    private drawService(
        ctx: CanvasRenderingContext2D,
        sim: Sim,
        n: SimNode,
        pulse: number,
    ) {
        const p = this.palette;
        const x = n.x + 0.07;
        const y = n.y + 0.07;
        const size = n.size - 0.14;
        const radius = 0.32;
        const standby = n.role === "standby";
        const color = n.dead ? p.dead : TRAFFIC_COLOR[n.traffic as Traffic];

        ctx.fillStyle = p.shadow;
        ctx.beginPath();
        ctx.roundRect(x + 0.03, y + 0.08, size, size, radius);
        ctx.fill();

        ctx.fillStyle = color;
        ctx.globalAlpha = standby && !n.dead ? 0.5 : 1;
        ctx.beginPath();
        ctx.roundRect(x, y, size, size, radius);
        ctx.fill();
        ctx.globalAlpha = 1;

        if (standby) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 0.07;
            ctx.setLineDash([0.16, 0.12]);
            ctx.beginPath();
            ctx.roundRect(x, y, size, size, radius);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        const cx = n.x + n.size / 2;
        const cy = n.y + n.size / 2 - 0.14;
        this.icon(ctx, n.dead ? "x" : n.kind, cx, cy, 1.02, "#fff");

        // Capacity meter: how full this service is right now.
        const cap = sim.capacityOf(n);
        const barW = size - 0.44;
        const barX = x + 0.22;
        const barY = y + size - 0.3;
        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.beginPath();
        ctx.roundRect(barX, barY, barW, 0.14, 0.07);
        ctx.fill();
        const load = Math.min(1, n.slots.length / Math.max(1, cap));
        if (load > 0) {
            ctx.fillStyle = load >= 1 ? "#fecaca" : "#fff";
            ctx.beginPath();
            ctx.roundRect(barX, barY, Math.max(0.14, barW * load), 0.14, 0.07);
            ctx.fill();
        }

        // Instance count, as small stacked ticks in the corner.
        if (n.instances > 1) {
            ctx.fillStyle = "#fff";
            for (let i = 0; i < n.instances; i++) {
                ctx.fillRect(x + 0.14 + i * 0.13, y + 0.13, 0.08, 0.14);
            }
        }

        let bx = x + size - 0.08;
        const by = y + 0.08;
        if (n.cache) {
            this.badge(ctx, bx, by, 0.17, "C", "#0f766e");
            bx -= 0.34;
        }
        if (n.cdn) {
            this.badge(ctx, bx, by, 0.17, "F", "#7c3aed");
            bx -= 0.34;
        }
        if (standby) this.badge(ctx, bx, by, 0.17, "S", "#475569");
        if (n.problem) {
            ctx.globalAlpha = 0.6 + pulse * 0.4;
            this.badge(ctx, x + 0.08, y + 0.08, 0.2, "!", "#ef4444");
            ctx.globalAlpha = 1;
        }
    }

    private badge(
        ctx: CanvasRenderingContext2D,
        cx: number,
        cy: number,
        r: number,
        letter: string,
        color: string,
    ) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        // Text at tiny world units is unreliable, so it is drawn in screen space.
        const t = ctx.getTransform();
        ctx.setTransform(this.ratio, 0, 0, this.ratio, 0, 0);
        const px = Math.max(8, r * this.scale * 1.25);
        ctx.font = `700 ${px}px ${this.font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.fillText(letter, cx * this.scale + this.ox, cy * this.scale + this.oy + 0.5);
        ctx.setTransform(t);
    }

    private consumeFx(sim: Sim) {
        for (const fx of sim.fx) {
            if (!fx.type.startsWith("ripple")) continue;
            const ripple = this.ripples.find((candidate) => !candidate.active);
            if (!ripple) continue;
            ripple.active = true;
            ripple.x = fx.x;
            ripple.y = fx.y;
            ripple.age = 0;
            ripple.life = fx.type === "ripple-served" ? 0.45 : 0.6;
            ripple.color =
                fx.color === "neutral"
                    ? this.palette.highlight
                    : TRAFFIC_COLOR[fx.color];
        }
    }

    private drawRipples(ctx: CanvasRenderingContext2D, dt: number) {
        for (const ripple of this.ripples) {
            if (!ripple.active) continue;
            ripple.age += dt;
            if (ripple.age >= ripple.life) {
                ripple.active = false;
                continue;
            }
            const t = ripple.age / ripple.life;
            ctx.strokeStyle = ripple.color;
            ctx.lineWidth = 0.07;
            ctx.globalAlpha = 1 - t;
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, 0.3 + t * 0.7, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    }
}
