"use client";
import { useEffect, useRef } from "react";

const WIDTH = 600;
const HEIGHT = 180;
const GROUND_Y = 150;
const DUCK_SIZE = 40;
const DUCK_X = 48;
const DUCK_RESTING_Y = GROUND_Y - DUCK_SIZE;
const GRAVITY = 0.002;
const JUMP_VELOCITY = -0.6;
const START_SPEED = 0.3;
const MAX_SPEED = 0.65;
const RESTART_COOLDOWN_MS = 400;
const HIGH_SCORE_KEY = "duck-game-high-score";

type Obstacle = { x: number; width: number; height: number };

export function DuckGame() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext("2d");
        if (!canvas || !context) return;

        const pixelRatio = window.devicePixelRatio || 1;
        canvas.width = WIDTH * pixelRatio;
        canvas.height = HEIGHT * pixelRatio;
        context.scale(pixelRatio, pixelRatio);

        const duckImage = new Image();
        duckImage.src = "/duck.webp";

        let status: "idle" | "running" | "over" = "idle";
        let duckY = DUCK_RESTING_Y;
        let velocity = 0;
        let distance = 0;
        let obstacles: Obstacle[] = [];
        let nextObstacleGap = 0;
        let gameOverAt = 0;
        let highScore = Number(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
        let lastFrameTime = performance.now();
        let animationFrame = 0;

        const getSpeed = () =>
            Math.min(MAX_SPEED, START_SPEED + distance * 0.000015);
        const getScore = () => Math.floor(distance / 30);

        const jump = () => {
            if (status === "over") {
                if (performance.now() - gameOverAt < RESTART_COOLDOWN_MS) {
                    return;
                }
                distance = 0;
                obstacles = [];
                nextObstacleGap = 0;
            }
            status = "running";
            if (duckY === DUCK_RESTING_Y) velocity = JUMP_VELOCITY;
        };

        const endGame = () => {
            status = "over";
            gameOverAt = performance.now();
            if (getScore() > highScore) {
                highScore = getScore();
                localStorage.setItem(HIGH_SCORE_KEY, String(highScore));
            }
        };

        const update = (elapsed: number) => {
            const speed = getSpeed();
            distance += speed * elapsed;

            velocity += GRAVITY * elapsed;
            duckY = Math.min(duckY + velocity * elapsed, DUCK_RESTING_Y);
            if (duckY === DUCK_RESTING_Y) velocity = 0;

            obstacles = obstacles
                .map((obstacle) => ({
                    ...obstacle,
                    x: obstacle.x - speed * elapsed,
                }))
                .filter((obstacle) => obstacle.x + obstacle.width > 0);

            const lastObstacle = obstacles.at(-1);
            if (!lastObstacle || lastObstacle.x < WIDTH - nextObstacleGap) {
                obstacles.push({
                    x: WIDTH,
                    width: 14 + Math.random() * 14,
                    height: 22 + Math.random() * 20,
                });
                nextObstacleGap = speed * 650 + Math.random() * 250;
            }

            const duckLeft = DUCK_X + 8;
            const duckRight = DUCK_X + DUCK_SIZE - 8;
            const duckBottom = duckY + DUCK_SIZE - 4;
            const hitObstacle = obstacles.some(
                (obstacle) =>
                    duckRight > obstacle.x &&
                    duckLeft < obstacle.x + obstacle.width &&
                    duckBottom > GROUND_Y - obstacle.height,
            );
            if (hitObstacle) endGame();
        };

        const draw = () => {
            const { color, fontFamily } = getComputedStyle(canvas);
            context.clearRect(0, 0, WIDTH, HEIGHT);
            context.fillStyle = color;

            context.globalAlpha = 0.3;
            context.fillRect(0, GROUND_Y, WIDTH, 1);
            for (let x = -(distance % 48); x < WIDTH; x += 48) {
                context.fillRect(x, GROUND_Y + 8, 12, 1);
            }

            context.globalAlpha = 0.75;
            for (const obstacle of obstacles) {
                context.beginPath();
                context.roundRect(
                    obstacle.x,
                    GROUND_Y - obstacle.height,
                    obstacle.width,
                    obstacle.height,
                    4,
                );
                context.fill();
            }

            context.globalAlpha = 1;
            if (duckImage.complete) {
                context.save();
                context.translate(DUCK_X + DUCK_SIZE, duckY);
                context.scale(-1, 1);
                context.drawImage(duckImage, 0, 0, DUCK_SIZE, DUCK_SIZE);
                context.restore();
            }

            context.globalAlpha = 0.6;
            context.font = `600 13px ${fontFamily}`;
            context.textAlign = "right";
            const padScore = (score: number) =>
                String(score).padStart(5, "0");
            context.fillText(
                `HI ${padScore(highScore)}   ${padScore(getScore())}`,
                WIDTH - 16,
                28,
            );

            if (status !== "running") {
                context.globalAlpha = 0.85;
                context.font = `500 15px ${fontFamily}`;
                context.textAlign = "center";
                context.fillText(
                    status === "idle"
                        ? "Press space or tap to play"
                        : "Game over. Press space or tap to try again",
                    WIDTH / 2,
                    80,
                );
            }
        };

        const loop = (time: number) => {
            const elapsed = Math.min(time - lastFrameTime, 32);
            lastFrameTime = time;
            if (status === "running") update(elapsed);
            draw();
            animationFrame = requestAnimationFrame(loop);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code !== "Space" && event.code !== "ArrowUp") return;
            if (event.target !== document.body && event.target !== canvas) {
                return;
            }
            event.preventDefault();
            jump();
        };

        canvas.addEventListener("pointerdown", jump);
        window.addEventListener("keydown", handleKeyDown);
        animationFrame = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animationFrame);
            canvas.removeEventListener("pointerdown", jump);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            tabIndex={0}
            aria-label="Duck jumping game. Press space or tap to jump over obstacles."
            className="aspect-10/3 w-full max-w-xl cursor-pointer touch-manipulation select-none rounded-xl border outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
    );
}
