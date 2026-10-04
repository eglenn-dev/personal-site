"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";

export function CallRoutingWaveform() {
    const prefersReducedMotion = useReducedMotion();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(entry.isIntersecting);
                });
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById("call-routing-animation");
        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, []);

    const shouldAnimate = isVisible && !prefersReducedMotion;

    // Waveform bar heights (normalized 0-1)
    const waveformBars = [0.3, 0.6, 0.9, 0.7, 0.4, 0.8, 0.5, 0.9, 0.6, 0.3];

    return (
        <div
            id="call-routing-animation"
            className="relative w-full h-64 flex items-center justify-center overflow-hidden"
            role="img"
            aria-label="Encrypted call routing system visualization showing audio waveform splitting into secure routing paths"
        >
            {/* Audio Waveform */}
            <div className="absolute left-8 flex items-center gap-1" aria-hidden="true">
                {waveformBars.map((height, index) => (
                    <motion.div
                        key={`bar-${index}`}
                        className="w-2 bg-primary rounded-full"
                        style={{
                            height: shouldAnimate ? undefined : `${height * 60}px`,
                        }}
                        animate={
                            shouldAnimate
                                ? {
                                      height: [
                                          `${height * 60}px`,
                                          `${height * 80}px`,
                                          `${height * 60}px`,
                                      ],
                                  }
                                : undefined
                        }
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            repeatType: "loop",
                            ease: "easeInOut",
                            delay: index * 0.1,
                        }}
                    />
                ))}
            </div>

            {/* Main routing line */}
            <svg
                className="absolute w-full h-full"
                viewBox="0 0 400 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                {/* Main horizontal line */}
                <motion.path
                    d="M 60 100 L 140 100"
                    className="stroke-primary"
                    strokeWidth="3"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 1 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />

                {/* Branch 1 - Top */}
                <motion.path
                    d="M 140 100 Q 180 100, 200 60 L 280 60"
                    className="stroke-primary"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.8, ease: "easeInOut" }}
                />

                {/* Branch 2 - Middle */}
                <motion.path
                    d="M 140 100 L 280 100"
                    className="stroke-primary"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.9, ease: "easeInOut" }}
                />

                {/* Branch 3 - Bottom */}
                <motion.path
                    d="M 140 100 Q 180 100, 200 140 L 280 140"
                    className="stroke-primary"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={shouldAnimate ? { pathLength: 1 } : { pathLength: 1 }}
                    transition={{ duration: 1, delay: 1.0, ease: "easeInOut" }}
                />

                {/* Signal dots traveling along paths */}
                {shouldAnimate && (
                    <>
                        {/* Dot on main line */}
                        <motion.circle
                            r="4"
                            className="fill-primary"
                            initial={{ offsetDistance: "0%" }}
                            animate={{ offsetDistance: "100%" }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                repeatDelay: 3.2,
                                ease: "linear",
                            }}
                        >
                            <animateMotion dur="0.8s" repeatCount="indefinite" begin="0s">
                                <mpath href="#mainPath" />
                            </animateMotion>
                        </motion.circle>

                        {/* Dot on branch 1 */}
                        <motion.circle
                            r="3"
                            className="fill-primary/70"
                            initial={{ offsetDistance: "0%" }}
                            animate={{ offsetDistance: "100%" }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                repeatDelay: 3,
                                ease: "linear",
                                delay: 0.8,
                            }}
                        >
                            <animateMotion dur="1s" repeatCount="indefinite" begin="0.8s">
                                <mpath href="#branch1Path" />
                            </animateMotion>
                        </motion.circle>

                        {/* Dot on branch 2 */}
                        <motion.circle
                            r="3"
                            className="fill-primary/70"
                            initial={{ offsetDistance: "0%" }}
                            animate={{ offsetDistance: "100%" }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                repeatDelay: 3,
                                ease: "linear",
                                delay: 0.9,
                            }}
                        >
                            <animateMotion dur="1s" repeatCount="indefinite" begin="0.9s">
                                <mpath href="#branch2Path" />
                            </animateMotion>
                        </motion.circle>

                        {/* Dot on branch 3 */}
                        <motion.circle
                            r="3"
                            className="fill-primary/70"
                            initial={{ offsetDistance: "0%" }}
                            animate={{ offsetDistance: "100%" }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                repeatDelay: 3,
                                ease: "linear",
                                delay: 1.0,
                            }}
                        >
                            <animateMotion dur="1s" repeatCount="indefinite" begin="1.0s">
                                <mpath href="#branch3Path" />
                            </animateMotion>
                        </motion.circle>
                    </>
                )}

                {/* Hidden paths for animation */}
                <defs>
                    <path id="mainPath" d="M 60 100 L 140 100" />
                    <path id="branch1Path" d="M 140 100 Q 180 100, 200 60 L 280 60" />
                    <path id="branch2Path" d="M 140 100 L 280 100" />
                    <path id="branch3Path" d="M 140 100 Q 180 100, 200 140 L 280 140" />
                </defs>
            </svg>

            {/* Destination endpoints */}
            <div className="absolute right-12 top-8" aria-hidden="true">
                <motion.div
                    className="w-3 h-3 rounded-full bg-primary"
                    initial={{ scale: 0 }}
                    animate={shouldAnimate ? { scale: [0, 1.2, 1] } : { scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.8 }}
                />
            </div>
            <div className="absolute right-12 top-1/2 -translate-y-1/2" aria-hidden="true">
                <motion.div
                    className="w-3 h-3 rounded-full bg-primary"
                    initial={{ scale: 0 }}
                    animate={shouldAnimate ? { scale: [0, 1.2, 1] } : { scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.9 }}
                />
            </div>
            <div className="absolute right-12 bottom-8" aria-hidden="true">
                <motion.div
                    className="w-3 h-3 rounded-full bg-primary"
                    initial={{ scale: 0 }}
                    animate={shouldAnimate ? { scale: [0, 1.2, 1] } : { scale: 1 }}
                    transition={{ duration: 0.5, delay: 2.0 }}
                />
            </div>

            {/* Lock icon for encryption */}
            <motion.div
                className="absolute left-1/2 top-8 -translate-x-1/2"
                initial={{ opacity: 0, y: -10 }}
                animate={
                    shouldAnimate
                        ? { opacity: [0, 1, 1, 0.7], y: 0 }
                        : { opacity: 0.7, y: 0 }
                }
                transition={{ duration: 1.5, delay: 2.2 }}
                aria-hidden="true"
            >
                <Lock className="w-5 h-5 text-primary" />
            </motion.div>
        </div>
    );
}
