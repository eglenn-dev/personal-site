"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
    type ReactNode,
} from "react";
import { useTheme } from "next-themes";
import {
    Cable,
    CircleDot,
    Copy,
    DatabaseBackup,
    Eraser,
    FastForward,
    Globe,
    HelpCircle,
    Layers,
    Maximize,
    Minimize,
    Pause,
    Play,
    RotateCcw,
    Route,
    Share2,
    Shield,
    Split,
    Volume2,
    VolumeX,
    Waves,
    X,
    Zap,
    type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    CARD_FLAVOR,
    ITEM_INFO,
    formatDuration,
    shareText,
    type ItemId,
} from "./_game/content";
import { Game, type Snapshot, type Tool } from "./_game/game";

const TOOL_ICONS: Record<ItemId | "draw" | "erase", LucideIcon> = {
    draw: Route,
    erase: Eraser,
    links: Route,
    bridge: Waves,
    alb: Split,
    asg: Layers,
    standby: DatabaseBackup,
    cache: Zap,
    cdn: Globe,
    waf: Shield,
    tgw: CircleDot,
    dx: Cable,
};

const ITEM_TOOLS: Array<Exclude<Tool, "draw" | "erase">> = [
    "alb",
    "asg",
    "standby",
    "cache",
    "cdn",
    "waf",
    "tgw",
    "dx",
];

const INITIAL_SNAPSHOT: Snapshot = {
    phase: "ready",
    paused: false,
    speed: 1,
    tool: "draw",
    toolPrompt: null,
    sprint: 0,
    sprintProgress: 0,
    budget: 100,
    burning: false,
    served: 0,
    rps: 0,
    clockStarted: false,
    inv: {
        links: 0,
        bridge: 0,
        alb: 0,
        asg: 0,
        standby: 0,
        cache: 0,
        cdn: 0,
        waf: 0,
        tgw: 0,
        dx: 0,
    },
    banner: null,
    advice: null,
    toast: null,
    choice: null,
    info: null,
    run: null,
    postmortem: null,
    best: 0,
    isNewBest: false,
    sound: false,
    rotateHint: false,
};

/** Keeps a stable store for React while the game itself only exists on the client. */
class GameHost {
    game: Game | null = null;
    private listeners = new Set<() => void>();
    private unsubscribe: (() => void) | null = null;

    subscribe = (listener: () => void) => {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    };

    getSnapshot = () => this.game?.getSnapshot() ?? INITIAL_SNAPSHOT;

    private notify = () => {
        for (const listener of this.listeners) listener();
    };

    attach(canvas: HTMLCanvasElement, stage: HTMLElement) {
        this.game = new Game(canvas, stage);
        this.unsubscribe = this.game.subscribe(this.notify);
        this.notify();
        return () => {
            this.unsubscribe?.();
            this.game?.destroy();
            this.game = null;
        };
    }
}

function nextFrame() {
    return new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    );
}

function HudButton({
    label,
    onClick,
    children,
    active = false,
}: {
    label: string;
    onClick: () => void;
    children: ReactNode;
    active?: boolean;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            aria-pressed={active}
            onClick={(event) => {
                // Keep Space for pausing after a click, not for re-pressing this.
                if (event.detail > 0) event.currentTarget.blur();
                onClick();
            }}
            className={`pointer-events-auto flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted"
            }`}
        >
            {children}
        </button>
    );
}

function ToolButton({
    tool,
    label,
    count,
    active,
    onClick,
}: {
    tool: Tool;
    label: string;
    count: number | null;
    active: boolean;
    onClick: () => void;
}) {
    const Icon = TOOL_ICONS[tool];
    return (
        <button
            type="button"
            onClick={(event) => {
                if (event.detail > 0) event.currentTarget.blur();
                onClick();
            }}
            aria-pressed={active}
            aria-label={count === null ? label : `${label}, ${count} available`}
            data-tool={tool}
            className={`relative flex h-12 w-13 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border text-[10px] leading-none font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active
                    ? "border-brand bg-brand text-white"
                    : "border-border bg-card text-foreground hover:bg-muted"
            }`}
        >
            <Icon className="size-4.5" aria-hidden />
            <span>{label}</span>
            {count !== null && (
                <span
                    className={`absolute -top-1.5 -right-1 min-w-4.5 rounded-full border px-1 py-0.5 text-center font-mono text-[10px] leading-none tabular-nums ${
                        active
                            ? "border-white bg-white text-black"
                            : "border-border bg-background text-foreground"
                    }`}
                >
                    {count}
                </span>
            )}
        </button>
    );
}

function ModalShell({
    children,
    label,
}: {
    children: ReactNode;
    label: string;
}) {
    return (
        <div
            role="dialog"
            aria-label={label}
            className="absolute inset-0 z-30 flex items-start justify-center overflow-y-auto overscroll-contain bg-black/45 p-3 sm:p-6"
        >
            <div className="my-auto w-full max-w-2xl rounded-xl border bg-card p-4 text-card-foreground shadow-lg sm:p-6">
                {children}
            </div>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border bg-background px-3 py-2">
            <div className="font-mono text-base font-bold tabular-nums sm:text-lg">
                {value}
            </div>
            <div className="text-xs text-muted-foreground">{label}</div>
        </div>
    );
}

export function FiveNinesGame() {
    const stageRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const toolbarRef = useRef<HTMLDivElement>(null);
    const [host] = useState(() => new GameHost());
    const snap = useSyncExternalStore(
        host.subscribe,
        host.getSnapshot,
        host.getSnapshot,
    );
    const { resolvedTheme } = useTheme();
    const [nativeFull, setNativeFull] = useState(false);
    const [immersive, setImmersive] = useState(false);
    const [helpOpen, setHelpOpen] = useState(false);
    const [shareState, setShareState] = useState<"idle" | "copied">("idle");
    const resumeAfterHelp = useRef(false);

    useEffect(() => {
        const stage = stageRef.current;
        const canvas = canvasRef.current;
        if (!stage || !canvas) return;
        return host.attach(canvas, stage);
    }, [host]);

    useEffect(() => {
        host.game?.setTheme(resolvedTheme === "dark");
    }, [host, resolvedTheme]);

    // Reserve the space the HUD covers so the camera frames the map around it.
    useEffect(() => {
        const stage = stageRef.current;
        const top = topRef.current;
        const toolbar = toolbarRef.current;
        if (!stage || !top || !toolbar) return;
        const measure = () => {
            const stageRect = stage.getBoundingClientRect();
            const topRect = top.getBoundingClientRect();
            const barRect = toolbar.getBoundingClientRect();
            const sideways = barRect.height > barRect.width;
            host.game?.setInsets({
                top: topRect.bottom - stageRect.top,
                left: 0,
                right: sideways ? stageRect.right - barRect.left : 0,
                bottom: sideways ? 0 : stageRect.bottom - barRect.top,
            });
        };
        const observer = new ResizeObserver(measure);
        observer.observe(stage);
        observer.observe(top);
        observer.observe(toolbar);
        measure();
        return () => observer.disconnect();
    }, [host, snap.phase]);

    useEffect(() => {
        const onChange = () => {
            setNativeFull(document.fullscreenElement === stageRef.current);
        };
        document.addEventListener("fullscreenchange", onChange);
        return () => document.removeEventListener("fullscreenchange", onChange);
    }, []);

    // Immersive mode is the fallback for browsers with no fullscreen API (iPhone).
    useEffect(() => {
        if (!immersive) return;
        const root = document.documentElement;
        const previous = root.style.overflow;
        root.style.overflow = "hidden";
        return () => {
            root.style.overflow = previous;
        };
    }, [immersive]);

    const enterFullscreen = useCallback(async () => {
        const stage = stageRef.current;
        if (!stage) return;
        if (document.fullscreenEnabled && stage.requestFullscreen) {
            try {
                await stage.requestFullscreen({ navigationUI: "hide" });
                return;
            } catch {
                // Fall through to immersive mode.
            }
        }
        setImmersive(true);
    }, []);

    const toggleFullscreen = useCallback(async () => {
        if (document.fullscreenElement) {
            await document.exitFullscreen();
        } else if (immersive) {
            setImmersive(false);
        } else {
            await enterFullscreen();
        }
    }, [enterFullscreen, immersive]);

    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.metaKey || event.ctrlKey || event.altKey) return;
            const target = event.target as HTMLElement | null;
            if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") {
                return;
            }
            if (event.key === "f" || event.key === "F") void toggleFullscreen();
            if (event.key === "Escape") setImmersive(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [toggleFullscreen]);

    const startGame = useCallback(async () => {
        setShareState("idle");
        setHelpOpen(false);
        // Phones need all the room they can get, so go fullscreen on first play.
        const coarse = window.matchMedia("(pointer: coarse)").matches;
        const alreadyFull = !!document.fullscreenElement || immersive;
        if (coarse && !alreadyFull) {
            await enterFullscreen();
            await nextFrame();
        }
        // Keep a phone in the shape the map is about to be built for, where allowed.
        const orientation = window.screen.orientation as ScreenOrientation & {
            lock?: (type: string) => Promise<void>;
        };
        if (coarse && orientation?.lock) {
            orientation.lock(orientation.type).catch(() => {
                // Most browsers refuse this. The rotate prompt covers them.
            });
        }
        host.game?.start();
    }, [enterFullscreen, host, immersive]);

    const openHelp = () => {
        if (snap.phase === "playing" && !snap.paused) {
            host.game?.togglePause();
            resumeAfterHelp.current = true;
        }
        setHelpOpen(true);
    };

    const closeHelp = () => {
        setHelpOpen(false);
        if (resumeAfterHelp.current) {
            resumeAfterHelp.current = false;
            host.game?.togglePause();
        }
    };

    const share = async () => {
        if (!snap.run) return;
        const text = shareText(snap.run, window.location.href.split("?")[0]);
        const coarse = window.matchMedia("(pointer: coarse)").matches;
        if (coarse && navigator.share) {
            try {
                await navigator.share({ text });
                return;
            } catch {
                // The player dismissed the sheet, or sharing failed. Copy instead.
            }
        }
        try {
            await navigator.clipboard.writeText(text);
            setShareState("copied");
        } catch {
            setShareState("idle");
        }
    };

    const fullscreen = nativeFull || immersive;
    const playing = snap.phase !== "ready";
    const budgetLow = snap.budget < 30;

    return (
        <div
            ref={stageRef}
            data-testid="five-nines-stage"
            className={`overflow-hidden bg-background select-none ${
                immersive
                    ? "fixed inset-0 z-100"
                    : "relative h-[calc(100dvh-3.5rem-1px)] min-h-80 w-full"
            }`}
        >
            <canvas
                ref={canvasRef}
                aria-label="Five Nines game map. Draw roads between users and services to keep requests flowing."
                className={`absolute inset-0 block size-full outline-none ${
                    playing ? "touch-none" : ""
                } ${snap.tool === "draw" ? "cursor-crosshair" : "cursor-pointer"}`}
            />

            {/* Top HUD */}
            <div
                ref={topRef}
                className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b bg-background/92 px-2.5 py-1.5 sm:px-4 [@media(max-height:480px)]:right-[4.25rem] [@media(max-height:480px)]:flex-nowrap"
            >
                <div className="flex min-w-0 grow basis-40 items-center gap-2.5">
                    <div className="w-[4.25rem] shrink-0">
                        <div className="font-mono text-xs font-bold whitespace-nowrap tabular-nums">
                            Sprint {snap.sprint + 1}
                        </div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-primary"
                                style={{
                                    width: `${Math.min(100, snap.sprintProgress * 100)}%`,
                                }}
                            />
                        </div>
                    </div>
                    <div className="min-w-0 grow">
                        <div className="flex items-baseline justify-between gap-2 text-xs">
                            <span className="truncate font-semibold">
                                Error budget
                            </span>
                            <span
                                data-testid="budget"
                                className={`font-mono font-bold tabular-nums ${
                                    budgetLow || snap.burning
                                        ? "text-destructive"
                                        : ""
                                }`}
                            >
                                {Math.ceil(snap.budget)}%
                            </span>
                        </div>
                        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div
                                className={`h-full rounded-full ${
                                    budgetLow || snap.burning
                                        ? "bg-destructive"
                                        : "bg-emerald-500"
                                }`}
                                style={{ width: `${snap.budget}%` }}
                            />
                        </div>
                    </div>
                    <div className="shrink-0 text-right">
                        <div
                            data-testid="served"
                            className="font-mono text-xs font-bold tabular-nums"
                        >
                            {snap.served.toLocaleString("en-US")}
                        </div>
                        <div className="font-mono text-[10px] text-muted-foreground tabular-nums">
                            {snap.rps.toFixed(1)} req/s
                        </div>
                    </div>
                </div>
                <div className="ml-auto flex shrink-0 items-center gap-1.5">
                    <HudButton
                        label={snap.paused ? "Resume" : "Pause"}
                        active={snap.paused}
                        onClick={() => host.game?.togglePause()}
                    >
                        {snap.paused ? (
                            <Play className="size-4" />
                        ) : (
                            <Pause className="size-4" />
                        )}
                    </HudButton>
                    <HudButton
                        label={`Game speed ${snap.speed}x`}
                        active={snap.speed > 1}
                        onClick={() => host.game?.cycleSpeed()}
                    >
                        {snap.speed === 1 ? (
                            <FastForward className="size-4" />
                        ) : (
                            <span className="font-mono text-xs font-bold">
                                {snap.speed}x
                            </span>
                        )}
                    </HudButton>
                    <HudButton
                        label={snap.sound ? "Mute" : "Turn sound on"}
                        onClick={() => host.game?.toggleSound()}
                    >
                        {snap.sound ? (
                            <Volume2 className="size-4" />
                        ) : (
                            <VolumeX className="size-4" />
                        )}
                    </HudButton>
                    <HudButton label="How to play" onClick={openHelp}>
                        <HelpCircle className="size-4" />
                    </HudButton>
                    <HudButton
                        label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                        active={fullscreen}
                        onClick={() => void toggleFullscreen()}
                    >
                        {fullscreen ? (
                            <Minimize className="size-4" />
                        ) : (
                            <Maximize className="size-4" />
                        )}
                    </HudButton>
                </div>
            </div>

            {/* Alerts sit over the map but never block drawing. */}
            <div
                aria-live="polite"
                className="pointer-events-none absolute inset-x-0 z-10 flex flex-col items-center gap-1.5 px-2"
                style={{ top: "calc(var(--hud-top, 0px) + 0.5rem)" }}
            >
                <HudAlerts snap={snap} topRef={topRef} />
            </div>

            {/* Node details */}
            {snap.info && (
                <div className="absolute inset-x-2 bottom-20 z-20 mx-auto max-w-sm rounded-lg border bg-card p-3 text-sm shadow-md [@media(max-height:480px)]:right-20 [@media(max-height:480px)]:bottom-2">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <div className="font-mono font-bold">
                                {snap.info.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {snap.info.subtitle}
                            </div>
                        </div>
                        <button
                            type="button"
                            aria-label="Close details"
                            onClick={() => host.game?.closeInfo()}
                            className="-m-1 rounded p-1 hover:bg-muted"
                        >
                            <X className="size-4" />
                        </button>
                    </div>
                    {snap.info.problem && (
                        <p className="mt-2 font-semibold text-destructive">
                            {snap.info.problem}
                        </p>
                    )}
                    <ul className="mt-2 space-y-0.5 text-xs text-muted-foreground">
                        {snap.info.lines.map((line) => (
                            <li key={line}>{line}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Toolbar: along the bottom, or down the side on landscape phones. */}
            <div
                ref={toolbarRef}
                className="absolute inset-x-0 bottom-0 z-10 flex items-center gap-2 overflow-x-auto overscroll-contain border-t bg-background/92 px-2.5 pt-2.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] [@media(max-height:480px)]:inset-x-auto [@media(max-height:480px)]:top-0 [@media(max-height:480px)]:right-0 [@media(max-height:480px)]:w-[4.25rem] [@media(max-height:480px)]:flex-col [@media(max-height:480px)]:overflow-x-hidden [@media(max-height:480px)]:overflow-y-auto [@media(max-height:480px)]:border-t-0 [@media(max-height:480px)]:border-l [@media(max-height:480px)]:px-2 sm:justify-center"
            >
                <ToolButton
                    tool="draw"
                    label="Links"
                    count={snap.inv.links}
                    active={snap.tool === "draw"}
                    onClick={() => host.game?.setTool("draw")}
                />
                <ToolButton
                    tool="erase"
                    label="Erase"
                    count={null}
                    active={snap.tool === "erase"}
                    onClick={() => host.game?.setTool("erase")}
                />
                <div
                    title={ITEM_INFO.bridge.description}
                    aria-label={`${snap.inv.bridge} cross-AZ links available`}
                    className="relative flex h-12 w-13 shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed text-[10px] leading-none font-semibold text-muted-foreground"
                >
                    <Waves className="size-4.5" aria-hidden />
                    <span>AZ link</span>
                    <span className="absolute -top-1.5 -right-1 min-w-4.5 rounded-full border border-border bg-background px-1 py-0.5 text-center font-mono text-[10px] leading-none text-foreground tabular-nums">
                        {snap.inv.bridge}
                    </span>
                </div>
                {ITEM_TOOLS.filter((tool) => snap.inv[tool] > 0).map((tool) => (
                    <ToolButton
                        key={tool}
                        tool={tool}
                        label={ITEM_INFO[tool].short}
                        count={snap.inv[tool]}
                        active={snap.tool === tool}
                        onClick={() => host.game?.setTool(tool)}
                    />
                ))}
            </div>

            {snap.rotateHint && (
                <div
                    role="status"
                    className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-background/95 p-6 text-center"
                >
                    <RotateCcw className="size-8 text-brand" aria-hidden />
                    <p className="text-lg font-bold">Rotate your phone back</p>
                    <p className="max-w-xs text-sm text-muted-foreground">
                        This region was built for the other orientation. Your run
                        is paused until you turn it back.
                    </p>
                </div>
            )}

            {/* Start screen */}
            {snap.phase === "ready" && (
                <ModalShell label="Start Five Nines">
                    <p className="font-mono text-xs font-semibold text-brand">
                        A traffic game about uptime
                    </p>
                    <h1 className="mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl [@media(max-height:480px)]:mt-0 [@media(max-height:480px)]:text-3xl">
                        Five Nines
                    </h1>
                    <p className="mt-3 text-sm sm:text-base [@media(max-height:480px)]:mt-1.5">
                        You&apos;re the only engineer on call, and traffic never
                        stops growing. Draw the network, add load balancers,
                        survive AZ outages, and keep the error budget above zero
                        for as long as you can.
                    </p>
                    <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground [@media(max-height:480px)]:hidden">
                        <li>
                            <strong className="text-foreground">Drag</strong> to
                            draw roads between users and services of the same
                            color.
                        </li>
                        <li>
                            <strong className="text-foreground">
                                Watch the rings.
                            </strong>{" "}
                            A full ring around users burns your error budget.
                        </li>
                        <li>
                            <strong className="text-foreground">
                                Survive each sprint
                            </strong>{" "}
                            to pick an upgrade. Eventually, you lose. Everyone
                            does.
                        </li>
                    </ul>
                    <div className="mt-5 flex flex-wrap items-center gap-3 [@media(max-height:480px)]:mt-3">
                        <Button
                            size="lg"
                            onClick={() => void startGame()}
                            data-testid="play"
                        >
                            <Play className="size-4" />
                            Start on-call shift
                        </Button>
                        {snap.best > 0 && (
                            <span className="font-mono text-xs text-muted-foreground">
                                Your best: {snap.best.toLocaleString("en-US")}{" "}
                                requests
                            </span>
                        )}
                    </div>
                </ModalShell>
            )}

            {/* Upgrade choice */}
            {snap.phase === "choosing" && snap.choice && (
                <ModalShell label="Choose an upgrade">
                    <p className="font-mono text-xs font-semibold text-brand">
                        Sprint {snap.choice.sprint + 1} complete
                    </p>
                    <h2 className="mt-1 text-xl font-bold sm:text-2xl">
                        Your budget request was partly approved
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        You get +{snap.choice.bonusLinks} links
                        {snap.choice.bonusBridges > 0
                            ? ` and +${snap.choice.bonusBridges} cross-AZ link`
                            : ""}
                        . Finance will only sign off on one of these:
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
                        {snap.choice.options.map((option, index) => {
                            const info = ITEM_INFO[option.item];
                            const Icon = TOOL_ICONS[option.item];
                            return (
                                <button
                                    key={option.item + index}
                                    type="button"
                                    data-testid={`card-${index}`}
                                    onClick={() =>
                                        host.game?.choose(index as 0 | 1)
                                    }
                                    className="flex h-full flex-col rounded-lg border bg-background p-3 text-left transition-colors outline-none hover:border-brand focus-visible:ring-2 focus-visible:ring-ring sm:p-4"
                                >
                                    <span className="flex items-center gap-2">
                                        <Icon
                                            className="size-5 shrink-0 text-brand"
                                            aria-hidden
                                        />
                                        <span className="font-semibold">
                                            {info.name}
                                            {option.amount > 1
                                                ? ` ×${option.amount}`
                                                : ""}
                                        </span>
                                    </span>
                                    <span className="mt-1.5 text-sm">
                                        {info.description}
                                    </span>
                                    <span className="mt-auto pt-2 text-xs text-muted-foreground italic">
                                        {CARD_FLAVOR[option.item]}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </ModalShell>
            )}

            {/* Game over */}
            {snap.phase === "over" && snap.run && snap.postmortem && (
                <ModalShell label="Postmortem">
                    <p className="font-mono text-xs font-semibold text-destructive">
                        {snap.postmortem.incident} · SEV-1 · Blameless (mostly)
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                        {snap.postmortem.headline}
                    </h2>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <Stat
                            label={snap.isNewBest ? "New best!" : "Requests"}
                            value={snap.run.served.toLocaleString("en-US")}
                        />
                        <Stat
                            label="Time on call"
                            value={formatDuration(snap.run.durationSeconds)}
                        />
                        <Stat
                            label="Sprints"
                            value={String(snap.run.sprints)}
                        />
                        <Stat
                            label="Peak req/s"
                            value={snap.run.peakRps.toFixed(1)}
                        />
                    </div>
                    <p className="mt-3 text-sm">{snap.postmortem.rootCause}</p>
                    <h3 className="mt-3 text-sm font-bold">Timeline</h3>
                    <ul className="mt-1 space-y-0.5 font-mono text-xs text-muted-foreground">
                        {snap.postmortem.timeline.map((entry) => (
                            <li key={entry}>{entry}</li>
                        ))}
                    </ul>
                    <h3 className="mt-3 text-sm font-bold">Action items</h3>
                    <ul className="mt-1 list-disc space-y-0.5 pl-4 text-sm text-muted-foreground">
                        {snap.postmortem.actionItems.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                    <p className="mt-3 rounded-lg border bg-background p-2.5 text-sm">
                        <strong>Final title:</strong> {snap.postmortem.grade}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Button onClick={() => void startGame()}>
                            <RotateCcw className="size-4" />
                            Start another shift
                        </Button>
                        <Button variant="outline" onClick={() => void share()}>
                            {shareState === "copied" ? (
                                <Copy className="size-4" />
                            ) : (
                                <Share2 className="size-4" />
                            )}
                            {shareState === "copied" ? "Copied" : "Share result"}
                        </Button>
                        {fullscreen && (
                            <Button
                                variant="ghost"
                                onClick={() => void toggleFullscreen()}
                            >
                                <Minimize className="size-4" />
                                Exit fullscreen
                            </Button>
                        )}
                    </div>
                </ModalShell>
            )}

            {/* Help */}
            {helpOpen && (
                <ModalShell label="How to play">
                    <div className="flex items-start justify-between gap-3">
                        <h2 className="text-xl font-bold">How to play</h2>
                        <button
                            type="button"
                            aria-label="Close help"
                            onClick={closeHelp}
                            className="-m-1 rounded p-1 hover:bg-muted"
                        >
                            <X className="size-5" />
                        </button>
                    </div>
                    <ul className="mt-3 space-y-2 text-sm">
                        <li>
                            <strong>Draw:</strong> drag between cells. Tiles cost
                            links, and crossing a river between AZs costs a
                            cross-AZ link. Erasing refunds them.
                        </li>
                        <li>
                            <strong>Match colors:</strong> blue goes to EC2 and
                            then RDS. Green goes to S3. Orange goes to Lambda and
                            then DynamoDB. Purple goes to SQS and then workers.
                        </li>
                        <li>
                            <strong>Keep rings empty:</strong> a ring around users
                            is their backlog. Full rings burn the error budget,
                            and an empty budget ends the game.
                        </li>
                        <li>
                            <strong>Spread out:</strong> AZs fail. EC2 instances,
                            RDS and workers in that AZ go down with it. S3,
                            Lambda, DynamoDB and SQS are regional, so they keep
                            running.
                        </li>
                        <li>
                            <strong>Inspect:</strong> tap any building to see what
                            it&apos;s doing and whether something is wrong.
                        </li>
                        <li>
                            <strong>Controls:</strong>{" "}
                            <span className="hidden sm:inline">
                                right-drag erases, Space pauses, E erases, D draws,
                                and F toggles fullscreen.{" "}
                            </span>
                            You can keep drawing while paused. Pinch or
                            ctrl-scroll to zoom.
                        </li>
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <Button onClick={closeHelp}>Back to the outage</Button>
                        {playing && (
                            <Button
                                variant="outline"
                                onClick={() => {
                                    resumeAfterHelp.current = false;
                                    void startGame();
                                }}
                            >
                                <RotateCcw className="size-4" />
                                Restart
                            </Button>
                        )}
                    </div>
                </ModalShell>
            )}
        </div>
    );
}

/** Positions alerts just under the top bar, wherever its height ends up. */
function HudAlerts({
    snap,
    topRef,
}: {
    snap: Snapshot;
    topRef: React.RefObject<HTMLDivElement | null>;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const top = topRef.current;
        const parent = ref.current?.parentElement;
        if (!top || !parent) return;
        const place = () => {
            parent.style.setProperty(
                "--hud-top",
                `${top.getBoundingClientRect().height}px`,
            );
        };
        const observer = new ResizeObserver(place);
        observer.observe(top);
        place();
        return () => observer.disconnect();
    }, [topRef]);

    const tone = snap.banner?.tone;
    const toneClass =
        tone === "danger"
            ? "border-l-destructive"
            : tone === "warn"
              ? "border-l-amber-500"
              : tone === "good"
                ? "border-l-emerald-500"
                : "border-l-brand";

    return (
        <div ref={ref} className="flex w-full flex-col items-center gap-1.5">
            {snap.phase === "playing" && snap.banner && (
                <div
                    data-testid="banner"
                    className={`w-full max-w-md rounded-md border border-l-4 bg-card px-3 py-1.5 shadow-sm ${toneClass}`}
                >
                    <div className="text-sm font-bold">{snap.banner.title}</div>
                    <div className="text-xs text-muted-foreground">
                        {snap.banner.detail}
                    </div>
                </div>
            )}
            {snap.phase === "playing" && snap.toast && (
                <div className="max-w-md rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm">
                    {snap.toast}
                </div>
            )}
            {snap.phase === "playing" && snap.toolPrompt && (
                <div className="max-w-md rounded-md border border-brand bg-card px-3 py-1.5 text-xs font-semibold shadow-sm">
                    {snap.toolPrompt}
                </div>
            )}
            {snap.phase === "playing" &&
                !snap.banner &&
                !snap.toolPrompt &&
                snap.advice && (
                    <div
                        data-testid="advice"
                        className="max-w-md rounded-md border bg-card/95 px-2.5 py-1 text-xs text-muted-foreground"
                    >
                        <span className="font-semibold text-foreground">
                            Trusted Advisor:
                        </span>{" "}
                        {snap.advice}
                    </div>
                )}
            {snap.phase === "playing" && snap.paused && (
                <div className="rounded-md bg-primary px-3 py-1 font-mono text-xs font-bold text-primary-foreground">
                    PAUSED. You can still build.
                </div>
            )}
        </div>
    );
}
