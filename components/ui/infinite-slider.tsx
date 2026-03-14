"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import useMeasure from "react-use-measure";

export const InfiniteSlider = ({
    items,
    duration = 20,
    className
}: {
    items: string[],
    duration?: number,
    className?: string
}) => {
    const [ref, { width }] = useMeasure();
    const controls = useAnimation();

    useEffect(() => {
        if (width > 0) {
            controls.start({
                x: -width / 2,
                transition: {
                    duration,
                    ease: "linear",
                    repeat: Infinity,
                },
            });
        }
    }, [width, controls, duration]);

    if (!items || items.length === 0) return null;

    return (
        <div className={className}>
            <div className="overflow-hidden">
                <motion.div
                    ref={ref}
                    animate={controls}
                    className="flex w-max items-center gap-12"
                >
                    {/* Primary Set */}
                    {items.filter(src => !!src).map((src, idx) => (
                        <div key={`logo-${idx}`} className="flex items-center justify-center">
                            <img
                                src={src}
                                className="h-10 w-auto max-w-[140px] object-contain transition-all duration-300"
                                alt=""
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                        </div>
                    ))}
                    {/* Duplicate Set for Seamless Loop */}
                    {items.filter(src => !!src).map((src, idx) => (
                        <div key={`logo-dup-${idx}`} className="flex items-center justify-center">
                            <img
                                src={src}
                                className="h-10 w-auto max-w-[140px] object-contain transition-all duration-300"
                                alt=""
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};
