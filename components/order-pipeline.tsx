"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Package, CheckCircle, Box, Truck } from "lucide-react";
import { useEffect, useState } from "react";

interface Stage {
    name: string;
    icon: React.ReactNode;
    color: string;
}

const stages: Stage[] = [
    {
        name: "Placed",
        icon: <Package className="w-5 h-5" />,
        color: "text-blue-500 dark:text-blue-400",
    },
    {
        name: "Verified",
        icon: <CheckCircle className="w-5 h-5" />,
        color: "text-green-500 dark:text-green-400",
    },
    {
        name: "Fulfilled",
        icon: <Box className="w-5 h-5" />,
        color: "text-purple-500 dark:text-purple-400",
    },
    {
        name: "Shipped",
        icon: <Truck className="w-5 h-5" />,
        color: "text-orange-500 dark:text-orange-400",
    },
];

export function OrderPipeline() {
    const [currentStage, setCurrentStage] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);
    const [practicesCount, setPracticesCount] = useState(0);
    const [isVisible, setIsVisible] = useState(true);
    const prefersReducedMotion = useReducedMotion();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        const element = document.getElementById("order-pipeline");
        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, []);

    useEffect(() => {
        if (!isVisible || prefersReducedMotion) return;

        const stageInterval = setInterval(() => {
            setCurrentStage((prev) => (prev + 1) % stages.length);
        }, 1200);

        return () => clearInterval(stageInterval);
    }, [isVisible, prefersReducedMotion]);

    useEffect(() => {
        if (!isVisible || prefersReducedMotion) return;

        const countInterval = setInterval(() => {
            setOrdersCount((prev) => {
                if (prev >= 900) return 0;
                return prev + Math.floor(Math.random() * 50) + 20;
            });
            setPracticesCount((prev) => {
                if (prev >= 115) return 0;
                return prev + Math.floor(Math.random() * 5) + 2;
            });
        }, 300);

        return () => clearInterval(countInterval);
    }, [isVisible, prefersReducedMotion]);

    if (prefersReducedMotion) {
        return (
            <div
                id="order-pipeline"
                className="bg-zinc-200 dark:bg-muted p-6 rounded-2xl"
                aria-label="Order pipeline visualization showing medical practice order management"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold">Order Platform</h3>
                        <div className="text-sm text-muted-foreground">
                            Medical Practice Management
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {stages.map((stage) => (
                            <div
                                key={stage.name}
                                className="flex items-center gap-2 bg-card p-3 rounded-lg"
                            >
                                <div className={stage.color}>{stage.icon}</div>
                                <span className="text-sm font-medium">
                                    {stage.name}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                        <div className="flex-1 bg-card p-3 rounded-lg">
                            <div className="text-2xl font-bold">100+</div>
                            <div className="text-sm text-muted-foreground">
                                Practices Served
                            </div>
                        </div>
                        <div className="flex-1 bg-card p-3 rounded-lg">
                            <div className="text-2xl font-bold">~900/mo</div>
                            <div className="text-sm text-muted-foreground">
                                Orders Processed
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            id="order-pipeline"
            className="bg-zinc-200 dark:bg-muted p-6 rounded-2xl"
            aria-label="Animated order pipeline visualization showing medical practice order management"
        >
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">Order Platform</h3>
                    <div className="text-sm text-muted-foreground">
                        Medical Practice Management
                    </div>
                </div>

                <div className="relative h-24 bg-card rounded-lg p-4 overflow-hidden">
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        key={currentStage}
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className={`${stages[currentStage].color}`}>
                                {stages[currentStage].icon}
                            </div>
                            <span className="text-lg font-semibold">
                                {stages[currentStage].name}
                            </span>
                        </div>
                    </motion.div>
                </div>

                <div className="flex items-center justify-center gap-2">
                    {stages.map((stage, index) => (
                        <motion.div
                            key={stage.name}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                index === currentStage
                                    ? "w-8 bg-primary"
                                    : index < currentStage
                                    ? "w-2 bg-primary/50"
                                    : "w-2 bg-muted-foreground/30"
                            }`}
                            aria-hidden="true"
                        />
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <motion.div
                        className="flex-1 bg-card p-3 rounded-lg"
                        initial={{ scale: 1 }}
                        animate={{ scale: practicesCount > 0 ? 1.05 : 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="text-2xl font-bold">
                            {practicesCount > 0 ? practicesCount : "100"}+
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Practices Served
                        </div>
                    </motion.div>
                    <motion.div
                        className="flex-1 bg-card p-3 rounded-lg"
                        initial={{ scale: 1 }}
                        animate={{ scale: ordersCount > 0 ? 1.05 : 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="text-2xl font-bold">
                            ~{ordersCount > 0 ? ordersCount : "900"}/mo
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Orders Processed
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
