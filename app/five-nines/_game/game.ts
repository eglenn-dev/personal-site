// Ties the simulation, renderer and player input together, and publishes a small
// snapshot for the React HUD. The HUD only re-renders when the snapshot changes.

import { GameAudio } from "./audio";
import {
    ITEM_INFO,
    KIND_INFO,
    TRAFFIC_LABEL,
    buildPostmortem,
    type ItemId,
    type Postmortem,
    type RunSummary,
} from "./content";
import { Renderer, type Insets } from "./render";
import {
    PENDING_CAP,
    SIM_DT,
    Sim,
    isZonal,
    type Banner,
    type Choice,
    type Inventory,
    type Phase,
    type SimNode,
} from "./sim";

export type Tool = "draw" | "erase" | Exclude<ItemId, "links" | "bridge">;

export type NodeInfo = {
    title: string;
    subtitle: string;
    lines: string[];
    problem: string | null;
};

export type Snapshot = {
    phase: Phase;
    paused: boolean;
    speed: number;
    tool: Tool;
    toolPrompt: string | null;
    sprint: number;
    sprintProgress: number;
    budget: number;
    burning: boolean;
    served: number;
    rps: number;
    clockStarted: boolean;
    inv: Inventory;
    banner: Banner | null;
    advice: string | null;
    toast: string | null;
    choice: Choice | null;
    info: NodeInfo | null;
    run: RunSummary | null;
    postmortem: Postmortem | null;
    best: number;
    isNewBest: boolean;
    sound: boolean;
    /** The screen was rotated away from the shape this run's map was built for. */
    rotateHint: boolean;
};

const BEST_KEY = "five-nines-best";
const SOUND_KEY = "five-nines-sound";

function readStorage(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeStorage(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Private browsing can refuse storage. The game doesn't depend on it.
    }
}

/** Chooses map dimensions that suit the shape of the player's screen. */
function dimensionsFor(width: number, height: number): [number, number] {
    const aspect = width / Math.max(1, height);
    if (aspect >= 2) return [32, 14];
    if (aspect >= 1.55) return [30, 16];
    if (aspect >= 1.05) return [26, 18];
    if (aspect >= 0.72) return [20, 24];
    return [15, 26];
}

export class Game {
    private sim: Sim;
    private readonly renderer: Renderer;
    private readonly audio = new GameAudio();
    private listeners = new Set<() => void>();
    private snapshot: Snapshot;
    private snapshotKey = "";

    private raf = 0;
    private lastFrame = 0;
    private accumulator = 0;
    private lastPublish = 0;
    private paused = false;
    private autoPaused = false;
    private speed = 1;
    private visible = true;
    private needsDraw = true;
    private slowFrames = 0;
    private destroyed = false;

    private tool: Tool = "draw";
    private dxStart = -1;
    private hoverCell = -1;
    private selectedNode = -1;
    private toast: { text: string; until: number } | null = null;
    private best = 0;
    private isNewBest = false;
    private rotateHint = false;
    private cssW = 1;
    private cssH = 1;
    private insets: Insets = { top: 0, right: 0, bottom: 0, left: 0 };
    private postmortem: Postmortem | null = null;
    private run: RunSummary | null = null;

    // Pointer state
    private pointers = new Map<number, { x: number; y: number }>();
    private strokeId = -1;
    private strokeMode: "draw" | "erase" | null = null;
    private strokeLast = -1;
    private strokeStart = 0;
    private strokeMoved = false;
    private strokeDownX = 0;
    private strokeDownY = 0;
    private strokeLinks: Array<[number, number]> = [];
    private strokeFailed = false;
    private pinch: { dist: number; cx: number; cy: number } | null = null;
    private panning = false;

    private readonly resizeObserver: ResizeObserver;
    private readonly visibilityHandler: () => void;
    private readonly intersection: IntersectionObserver;

    constructor(
        private readonly canvas: HTMLCanvasElement,
        private readonly stage: HTMLElement,
    ) {
        this.renderer = new Renderer(canvas);
        const rect = stage.getBoundingClientRect();
        this.cssW = rect.width;
        this.cssH = rect.height;
        this.renderer.resize(rect.width, rect.height);
        const [w, h] = dimensionsFor(rect.width, rect.height);
        this.sim = new Sim(w, h);
        this.best = Number(readStorage(BEST_KEY)) || 0;
        const sound = readStorage(SOUND_KEY) === "1";
        this.audio.enabled = sound;
        this.snapshot = this.buildSnapshot();

        this.resizeObserver = new ResizeObserver((entries) => {
            const box = entries[0].contentRect;
            this.cssW = box.width;
            this.cssH = box.height;
            this.renderer.resize(box.width, box.height);
            this.needsDraw = true;
            this.checkOrientation();
        });
        this.resizeObserver.observe(stage);

        this.visibilityHandler = () => {
            if (document.hidden) this.autoPause();
            else this.autoResume();
        };
        document.addEventListener("visibilitychange", this.visibilityHandler);

        this.intersection = new IntersectionObserver(
            (entries) => {
                this.visible = entries[0].isIntersecting;
                if (this.visible) this.autoResume();
                else this.autoPause();
            },
            { threshold: 0.2 },
        );
        this.intersection.observe(stage);

        canvas.addEventListener("pointerdown", this.onPointerDown);
        canvas.addEventListener("pointermove", this.onPointerMove);
        canvas.addEventListener("pointerup", this.onPointerUp);
        canvas.addEventListener("pointercancel", this.onPointerCancel);
        canvas.addEventListener("pointerleave", this.onPointerLeave);
        canvas.addEventListener("contextmenu", this.onContextMenu);
        canvas.addEventListener("wheel", this.onWheel, { passive: false });
        window.addEventListener("keydown", this.onKeyDown);

        this.raf = requestAnimationFrame(this.frame);

        if (process.env.NODE_ENV !== "production") {
            // Lets browser tests read the world without any production surface.
            (window as unknown as { __fiveNines?: Game }).__fiveNines = this;
        }
    }

    /** Read-only access for development tooling. */
    get debugSim() {
        return this.sim;
    }

    destroy() {
        this.destroyed = true;
        cancelAnimationFrame(this.raf);
        this.resizeObserver.disconnect();
        this.intersection.disconnect();
        document.removeEventListener("visibilitychange", this.visibilityHandler);
        const c = this.canvas;
        c.removeEventListener("pointerdown", this.onPointerDown);
        c.removeEventListener("pointermove", this.onPointerMove);
        c.removeEventListener("pointerup", this.onPointerUp);
        c.removeEventListener("pointercancel", this.onPointerCancel);
        c.removeEventListener("pointerleave", this.onPointerLeave);
        c.removeEventListener("contextmenu", this.onContextMenu);
        c.removeEventListener("wheel", this.onWheel);
        window.removeEventListener("keydown", this.onKeyDown);
        this.audio.destroy();
        this.listeners.clear();
    }

    // ---------- React bindings ----------

    subscribe = (listener: () => void) => {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    };

    getSnapshot = () => this.snapshot;

    // ---------- Commands from the HUD ----------

    start() {
        // Shape the map to the area the HUD leaves free, not the whole stage.
        const [w, h] = dimensionsFor(
            this.cssW - this.insets.left - this.insets.right,
            this.cssH - this.insets.top - this.insets.bottom,
        );
        this.sim = new Sim(w, h);
        this.renderer.resetView();
        this.renderer.resize(this.cssW, this.cssH);
        this.tool = "draw";
        this.dxStart = -1;
        this.selectedNode = -1;
        this.paused = false;
        this.autoPaused = false;
        this.speed = 1;
        this.postmortem = null;
        this.run = null;
        this.isNewBest = false;
        this.accumulator = 0;
        this.toast = null;
        this.rotateHint = false;
        this.sim.start();
        this.needsDraw = true;
        this.publish(true);
    }

    setTool(tool: Tool) {
        this.tool = this.tool === tool && tool !== "draw" ? "draw" : tool;
        this.dxStart = -1;
        this.selectedNode = -1;
        this.needsDraw = true;
        this.publish(true);
    }

    togglePause() {
        if (this.sim.phase !== "playing") return;
        this.paused = !this.paused;
        this.autoPaused = false;
        this.needsDraw = true;
        this.publish(true);
    }

    cycleSpeed() {
        this.speed = this.speed === 1 ? 2 : this.speed === 2 ? 3 : 1;
        this.publish(true);
    }

    choose(index: 0 | 1) {
        this.sim.choose(index);
        this.needsDraw = true;
        this.publish(true);
    }

    toggleSound() {
        const next = !this.audio.enabled;
        this.audio.setEnabled(next);
        writeStorage(SOUND_KEY, next ? "1" : "0");
        if (next) this.audio.play("place");
        this.publish(true);
    }

    closeInfo() {
        this.selectedNode = -1;
        this.publish(true);
    }

    setInsets(insets: Insets) {
        this.insets = insets;
        this.renderer.setInsets(insets);
        this.needsDraw = true;
        this.checkOrientation();
    }

    setTheme(dark: boolean) {
        this.renderer.setTheme(dark);
        this.needsDraw = true;
    }

    /**
     * A portrait map on a landscape phone would shrink to an unplayable size, so
     * pause and ask for the phone back instead. Bigger screens just letterbox.
     */
    private isWrongOrientation() {
        const sim = this.sim;
        if (sim.phase === "ready" || sim.phase === "over") return false;
        const areaW = this.cssW - this.insets.left - this.insets.right;
        const areaH = this.cssH - this.insets.top - this.insets.bottom;
        // Judge by the full map: the visible region only gets bigger from here.
        const fit = Math.min(areaW / sim.W, areaH / sim.H);
        return sim.H > sim.W !== areaH > areaW && fit < 16;
    }

    private checkOrientation() {
        const wrong = this.isWrongOrientation();
        if (wrong === this.rotateHint) return;
        this.rotateHint = wrong;
        if (wrong) this.autoPause();
        else this.autoResume();
        this.publish(true);
    }

    private autoPause() {
        if (this.sim.phase === "playing" && !this.paused) {
            this.paused = true;
            this.autoPaused = true;
            this.publish(true);
        }
    }

    private autoResume() {
        if (
            this.autoPaused &&
            !document.hidden &&
            this.visible &&
            !this.rotateHint
        ) {
            this.paused = false;
            this.autoPaused = false;
            this.lastFrame = 0;
            this.publish(true);
        }
    }

    // ---------- Main loop ----------

    private frame = (now: number) => {
        if (this.destroyed) return;
        this.raf = requestAnimationFrame(this.frame);
        if (!this.visible || document.hidden) {
            this.lastFrame = 0;
            return;
        }
        const raw = this.lastFrame ? (now - this.lastFrame) / 1000 : 1 / 60;
        this.lastFrame = now;
        const dt = Math.min(raw, 0.1);

        const sim = this.sim;
        const running = sim.phase === "playing" && !this.paused;
        if (running) {
            this.accumulator += dt * this.speed;
            let steps = 0;
            while (this.accumulator >= SIM_DT && steps < 12) {
                sim.step();
                this.accumulator -= SIM_DT;
                steps++;
            }
            if (steps === 12) this.accumulator = 0;
        }
        if (sim.phase === "over" && !this.run) this.onGameOver();

        this.playSounds();

        // A paused, settled game draws nothing at all, which saves battery.
        const moving =
            running ||
            this.renderer.busy ||
            this.needsDraw ||
            sim.fx.length > 0;
        if (moving) {
            const camera = this.renderer.draw(
                sim,
                {
                    tool: this.tool,
                    dxStart: this.dxStart,
                    hoverCell: this.hoverCell,
                },
                dt,
                now,
            );
            this.needsDraw =
                camera || this.tool !== "draw" || sim.outage !== null;
            sim.fx.length = 0;
        }

        // Drop resolution if this device can't keep up, then stop checking.
        if (running && raw > 0.03 && raw < 0.2) {
            this.slowFrames++;
            if (this.slowFrames > 90) {
                this.slowFrames = 0;
                this.renderer.lowerQuality();
                this.needsDraw = true;
            }
        } else if (this.slowFrames > 0) {
            this.slowFrames--;
        }

        if (now - this.lastPublish > 200) {
            this.lastPublish = now;
            this.publish(false);
        }
    };

    private playSounds() {
        for (const fx of this.sim.fx) {
            switch (fx.type) {
                case "sound-place":
                    this.audio.play("place");
                    break;
                case "sound-erase":
                    this.audio.play("erase");
                    break;
                case "sound-deny":
                    this.audio.play("deny");
                    break;
                case "sound-alarm":
                    this.audio.play("alarm");
                    break;
                case "sound-good":
                    this.audio.play("good");
                    break;
                case "sound-over":
                    this.audio.play("over");
                    break;
            }
        }
    }

    private onGameOver() {
        this.cancelStroke();
        const run = this.sim.summary();
        this.run = run;
        this.postmortem = buildPostmortem(run);
        if (run.served > this.best) {
            this.best = run.served;
            this.isNewBest = true;
            writeStorage(BEST_KEY, String(run.served));
        }
        this.publish(true);
    }

    // ---------- Snapshot ----------

    private describeNode(node: SimNode): NodeInfo {
        const sim = this.sim;
        const zone = `AZ-${"abc"[node.zone]}`;
        if (node.kind === "client") {
            const traffic = node.traffic!;
            return {
                title: node.name,
                subtitle: `${TRAFFIC_LABEL[traffic]} · ${zone}`,
                lines: [
                    `Backlog: ${node.pending} of ${PENDING_CAP} requests`,
                    `In flight: ${node.inflight}`,
                    "A full backlog burns error budget.",
                ],
                problem: node.problem,
            };
        }
        if (node.kind === "alb") {
            return {
                title: node.name,
                subtitle: `Load balancer${node.waf ? " + WAF" : ""}`,
                lines: [
                    "Clients that can reach this route through it.",
                    "Sends each request to the least busy healthy target.",
                ],
                problem: null,
            };
        }
        const info = KIND_INFO[node.kind];
        const lines = [
            info.blurb,
            `Busy: ${node.slots.length} of ${sim.capacityOf(node)} slots`,
            `Size: ${node.instances} ${node.instances === 1 ? "instance" : "instances"}`,
        ];
        lines.push(
            isZonal(node.kind)
                ? `Runs in ${zone}. Dies if that AZ does.`
                : "Regional service. Survives an AZ outage.",
        );
        if (node.dead) lines.unshift("Offline.");
        if (node.cache) lines.push("ElastiCache: half of requests skip the database.");
        if (node.cdn) lines.push("CloudFront: most requests never reach this bucket.");
        if (node.role === "standby") lines.push("Hot standby. Takes over if the primary dies.");
        if (node.role === "primary") {
            lines.push(node.peer >= 0 ? "Multi-AZ: protected." : "Single-AZ: at risk.");
        }
        return {
            title: node.name,
            subtitle: `${info.label} · ${zone}`,
            lines,
            problem: node.problem,
        };
    }

    private buildSnapshot(): Snapshot {
        const sim = this.sim;
        const node = this.selectedNode >= 0 ? sim.nodes[this.selectedNode] : null;
        const now = performance.now();
        if (this.toast && now > this.toast.until) this.toast = null;
        let toolPrompt: string | null = null;
        if (this.tool === "dx") {
            toolPrompt = this.dxStart >= 0 ? "Now tap the end point" : "Tap the start point";
        } else if (this.tool === "erase") {
            toolPrompt = "Drag over roads to remove them. Tap a building to remove its upgrades.";
        } else if (this.tool !== "draw") {
            toolPrompt = ITEM_INFO[this.tool].placement;
        }
        return {
            phase: sim.phase,
            paused: this.paused,
            speed: this.speed,
            tool: this.tool,
            toolPrompt,
            sprint: sim.sprint,
            sprintProgress: sim.sprintTime / sim.sprintLength,
            budget: sim.budget,
            burning: sim.burnRate > 0,
            served: sim.served,
            rps: sim.rps,
            clockStarted: sim.clockStarted,
            inv: { ...sim.inv },
            banner: sim.banner,
            advice: sim.advice,
            toast: this.toast?.text ?? null,
            choice: sim.choice,
            info: node && !node.gone ? this.describeNode(node) : null,
            run: this.run,
            postmortem: this.postmortem,
            best: this.best,
            isNewBest: this.isNewBest,
            sound: this.audio.enabled,
            rotateHint: this.rotateHint,
        };
    }

    private publish(force: boolean) {
        const next = this.buildSnapshot();
        const key = JSON.stringify(next, (k, v) => {
            if (k === "sprintProgress" || k === "budget") return Math.round(v * 200);
            if (k === "rps") return Math.round(v * 10);
            return v;
        });
        if (!force && key === this.snapshotKey) return;
        this.snapshotKey = key;
        this.snapshot = next;
        for (const listener of this.listeners) listener();
    }

    private say(text: string) {
        this.toast = { text, until: performance.now() + 2600 };
        this.audio.play("deny");
        this.publish(true);
    }

    // ---------- Input ----------

    private localPoint(e: { clientX: number; clientY: number }) {
        const rect = this.canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    private onPointerDown = (e: PointerEvent) => {
        const sim = this.sim;
        if (sim.phase !== "playing") return;
        const p = this.localPoint(e);
        this.pointers.set(e.pointerId, p);
        this.canvas.setPointerCapture?.(e.pointerId);
        e.preventDefault();

        if (this.pointers.size >= 2) {
            this.beginPinch();
            return;
        }

        if (e.pointerType === "mouse" && e.button === 1) {
            this.panning = true;
            return;
        }

        const cell = this.renderer.cellAt(sim, p.x, p.y);
        this.hoverCell = e.pointerType === "mouse" ? cell : -1;
        this.strokeId = e.pointerId;
        this.strokeStart = performance.now();
        this.strokeMoved = false;
        this.strokeDownX = p.x;
        this.strokeDownY = p.y;
        this.strokeLinks.length = 0;
        this.strokeFailed = false;
        this.strokeLast = cell;
        const erasing =
            this.tool === "erase" || (e.pointerType === "mouse" && e.button === 2);
        if (erasing) this.strokeMode = "erase";
        else if (this.tool === "draw") this.strokeMode = "draw";
        else this.strokeMode = null;
        this.needsDraw = true;
    };

    private onPointerMove = (e: PointerEvent) => {
        const sim = this.sim;
        const p = this.localPoint(e);
        const known = this.pointers.get(e.pointerId);
        if (known) {
            if (this.panning) {
                this.renderer.panBy(sim, p.x - known.x, p.y - known.y);
                this.needsDraw = true;
            }
            known.x = p.x;
            known.y = p.y;
        }

        if (this.pinch) {
            this.updatePinch();
            return;
        }

        const cell = this.renderer.cellAt(sim, p.x, p.y);
        if (e.pointerType === "mouse" && cell !== this.hoverCell) {
            this.hoverCell = cell;
            this.needsDraw = true;
        }

        if (e.pointerId !== this.strokeId || !this.strokeMode) return;
        const moved = Math.hypot(p.x - this.strokeDownX, p.y - this.strokeDownY);
        if (moved < 4 && !this.strokeMoved) return;

        if (this.strokeMode === "erase") {
            if (cell >= 0 && cell !== this.strokeLast) {
                this.walk(this.strokeLast, cell, (c) => this.sim.eraseCell(c));
                this.strokeLast = cell;
                this.strokeMoved = true;
            } else if (cell >= 0 && moved > 8) {
                this.strokeMoved = true;
                if (this.sim.eraseCell(cell)) this.needsDraw = true;
            }
            this.needsDraw = true;
            return;
        }
        if (cell >= 0 && cell !== this.strokeLast && !this.strokeFailed) {
            this.strokeMoved = true;
            this.extendStroke(cell);
        }
    };

    /** Visits each cell on a straight line from one cell to another. */
    private walk(from: number, to: number, visit: (cell: number) => void) {
        const W = this.sim.W;
        if (from < 0) {
            visit(to);
            return;
        }
        let x = from % W;
        let y = (from - x) / W;
        const tx = to % W;
        const ty = (to - tx) / W;
        visit(from);
        let guard = 0;
        while ((x !== tx || y !== ty) && guard++ < 64) {
            x += Math.sign(tx - x);
            y += Math.sign(ty - y);
            visit(y * W + x);
        }
    }

    private extendStroke(target: number) {
        const sim = this.sim;
        if (this.strokeLast < 0) {
            this.strokeLast = target;
            return;
        }
        const W = sim.W;
        let guard = 0;
        while (this.strokeLast !== target && guard++ < 64) {
            const cx = this.strokeLast % W;
            const cy = (this.strokeLast - cx) / W;
            const tx = target % W;
            const ty = (target - tx) / W;
            const sx = Math.sign(tx - cx);
            const sy = Math.sign(ty - cy);
            // Prefer the direct step, then fall back to a straight one when a
            // diagonal isn't legal, so fast drags don't simply stop.
            const options = [(cy + sy) * W + cx + sx];
            if (sx !== 0 && sy !== 0) {
                const dx = Math.abs(tx - cx);
                const dy = Math.abs(ty - cy);
                const horizontal = cy * W + cx + sx;
                const vertical = (cy + sy) * W + cx;
                if (dx >= dy) options.push(horizontal, vertical);
                else options.push(vertical, horizontal);
            }
            let advanced = false;
            for (const next of options) {
                const result = sim.tryLink(this.strokeLast, next);
                if (result === "ok") {
                    this.strokeLinks.push([this.strokeLast, next]);
                    this.strokeLast = next;
                    advanced = true;
                    this.needsDraw = true;
                    break;
                }
                if (result === "noop") {
                    this.strokeLast = next;
                    advanced = true;
                    break;
                }
                if (result === "no-links") {
                    this.say("Out of network links. Erase some road, or survive to the next sprint.");
                    this.strokeFailed = true;
                    return;
                }
                if (result === "no-bridges") {
                    this.say("Out of cross-AZ links. Reuse an existing crossing.");
                    this.strokeFailed = true;
                    return;
                }
                if (result === "out-of-bounds") {
                    this.strokeFailed = true;
                    return;
                }
            }
            if (!advanced) return;
        }
    }

    private onPointerUp = (e: PointerEvent) => {
        this.pointers.delete(e.pointerId);
        if (this.pinch) {
            if (this.pointers.size < 2) this.pinch = null;
            this.strokeId = -1;
            this.strokeMode = null;
            return;
        }
        if (this.panning) {
            this.panning = false;
            return;
        }
        if (e.pointerId !== this.strokeId) return;
        const p = this.localPoint(e);
        const moved = Math.hypot(p.x - this.strokeDownX, p.y - this.strokeDownY);
        const wasTap = !this.strokeMoved && moved < 12;
        this.strokeId = -1;
        const mode = this.strokeMode;
        this.strokeMode = null;
        if (wasTap) {
            const cell = this.renderer.cellAt(this.sim, p.x, p.y);
            this.tap(cell, mode === "erase");
        }
        this.needsDraw = true;
        this.publish(true);
    };

    private onPointerCancel = (e: PointerEvent) => {
        this.pointers.delete(e.pointerId);
        if (this.pointers.size < 2) this.pinch = null;
        if (e.pointerId === this.strokeId) this.cancelStroke();
        this.panning = false;
    };

    private onPointerLeave = () => {
        if (this.hoverCell !== -1) {
            this.hoverCell = -1;
            this.needsDraw = true;
        }
    };

    private cancelStroke() {
        this.strokeId = -1;
        this.strokeMode = null;
        this.pointers.clear();
        this.pinch = null;
        this.panning = false;
    }

    private onContextMenu = (e: Event) => {
        e.preventDefault();
    };

    private onWheel = (e: WheelEvent) => {
        const sim = this.sim;
        if (sim.phase !== "playing") return;
        const p = this.localPoint(e);
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            this.renderer.zoomAt(sim, Math.exp(-e.deltaY * 0.01), p.x, p.y);
            this.needsDraw = true;
        } else if (this.renderer.userZoom > 1) {
            e.preventDefault();
            this.renderer.panBy(sim, -e.deltaX, -e.deltaY);
            this.needsDraw = true;
        }
    };

    private beginPinch() {
        // A second finger means the first wasn't drawing. Undo a short accidental
        // stroke, but leave a deliberate one alone.
        if (this.strokeId >= 0 && performance.now() - this.strokeStart < 450) {
            for (const [a, b] of this.strokeLinks) this.sim.unlink(a, b);
        }
        this.strokeLinks.length = 0;
        this.strokeId = -1;
        this.strokeMode = null;
        const [a, b] = [...this.pointers.values()];
        this.pinch = {
            dist: Math.hypot(a.x - b.x, a.y - b.y),
            cx: (a.x + b.x) / 2,
            cy: (a.y + b.y) / 2,
        };
    }

    private updatePinch() {
        const pinch = this.pinch;
        if (!pinch || this.pointers.size < 2) return;
        const [a, b] = [...this.pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const cx = (a.x + b.x) / 2;
        const cy = (a.y + b.y) / 2;
        const sim = this.sim;
        if (pinch.dist > 0) this.renderer.zoomAt(sim, dist / pinch.dist, cx, cy);
        this.renderer.panBy(sim, cx - pinch.cx, cy - pinch.cy);
        pinch.dist = dist;
        pinch.cx = cx;
        pinch.cy = cy;
        this.needsDraw = true;
    }

    private finishItem() {
        const tool = this.tool;
        if (tool !== "draw" && tool !== "erase" && this.sim.inv[tool] <= 0) {
            this.tool = "draw";
        }
    }

    private tap(cell: number, erasing: boolean) {
        const sim = this.sim;
        if (cell < 0) {
            this.selectedNode = -1;
            return;
        }
        const node = sim.nodeAtCell(cell);

        if (erasing) {
            if (node && node.kind !== "alb") {
                if (!sim.detach(node)) {
                    this.say(`${node.name} has no upgrades to remove.`);
                }
            } else if (
                !sim.removeFeature(cell) &&
                !sim.eraseCell(cell) &&
                this.tool === "erase"
            ) {
                this.say("Nothing to remove here.");
            }
            return;
        }

        const x = cell % sim.W;
        const y = (cell - x) / sim.W;
        let error: string | null = null;
        switch (this.tool) {
            case "draw":
                this.selectedNode = node ? node.id : -1;
                return;
            case "erase":
                return;
            case "alb":
                error = sim.placeAlb(cell);
                break;
            case "tgw":
                error = sim.placeTgw(cell);
                break;
            case "standby":
                error = sim.placeStandby(x, y);
                break;
            case "dx":
                if (this.dxStart < 0) {
                    this.dxStart = cell;
                    return;
                }
                error = sim.placeDx(this.dxStart, cell);
                this.dxStart = -1;
                break;
            default:
                error = node
                    ? sim.attach(this.tool, node)
                    : ITEM_INFO[this.tool].placement + ".";
        }
        if (error) this.say(error);
        else this.finishItem();
    }

    private onKeyDown = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement | null;
        if (
            target &&
            (target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.isContentEditable)
        ) {
            return;
        }
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const sim = this.sim;
        if (sim.phase === "choosing") {
            if (e.key === "1") this.choose(0);
            if (e.key === "2") this.choose(1);
            return;
        }
        if (sim.phase !== "playing") return;
        switch (e.key) {
            case " ":
                // Let a focused HUD button handle its own space press.
                if (target?.tagName === "BUTTON") return;
                e.preventDefault();
                this.togglePause();
                break;
            case "e":
            case "E":
                this.setTool("erase");
                break;
            case "d":
            case "D":
                this.setTool("draw");
                break;
            case "Escape":
                this.setTool("draw");
                break;
        }
    };
}
