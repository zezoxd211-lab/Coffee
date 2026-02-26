"use client";

import { motion, Variants } from "framer-motion";
interface HandWrittenTitleProps {
    title?: string;
    subtitle?: string;
}

function HandWrittenTitle({
    title = "Hand Written",
    subtitle = "Optional subtitle",
}: HandWrittenTitleProps) {
    const draw: Variants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: { duration: 2.5, ease: [0.43, 0.13, 0.23, 0.96] },
                opacity: { duration: 0.5 },
            },
        },
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto py-24 pt-0">
            <div className="absolute inset-0">
                <motion.svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 2000 1000"
                    initial="hidden"
                    animate="visible"
                    className="w-[140%] h-[140%] -left-[20%] -top-[30%] absolute pointer-events-none"
                >
                    <title>Circle Animation</title>
                    <motion.path
                        d="M 1600 150 
                           C 2100 500, 1800 800, 1000 850
                           C 200 850, -50 800, 50 500
                           C 50 200, 300 100, 1000 100
                           C 1450 100, 1600 250, 1600 250"
                        fill="none"
                        strokeWidth="12"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={draw}
                        className="text-primary opacity-90"
                    />
                </motion.svg>
            </div>
            <div className="relative text-left z-10 flex flex-col items-start justify-center">
                <motion.h1
                    className="text-4xl md:text-6xl text-primary tracking-tighter flex items-center gap-2 mb-6 font-extrabold leading-tight"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                >
                    {title}
                </motion.h1>
                {subtitle && (
                    <motion.p
                        className="text-lg text-black/80 dark:text-white/80 leading-relaxed max-w-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.8 }}
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
        </div>
    );
}

export { HandWrittenTitle }
