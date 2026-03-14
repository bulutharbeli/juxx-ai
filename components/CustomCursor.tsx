import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

export const CustomCursor = () => {
    const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            
            // Check if hovering over interactive elements
            const target = e.target as HTMLElement;
            const isClickable = target.closest('a, button, input, textarea, select, [role="button"], .portfolio-item');
            setIsHovering(!!isClickable);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <>
            {/* Main Dot */}
            <motion.div
                className="fixed top-0 left-0 w-2.5 h-2.5 bg-white rounded-full z-[1000] pointer-events-none transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
                animate={{ 
                    x: mousePos.x, 
                    y: mousePos.y,
                    scale: isHovering ? 0 : 1
                }}
                transition={{ type: "spring", damping: 50, stiffness: 400, mass: 0.1 }}
            />
            {/* Outer Ring */}
            <motion.div
                className="fixed top-0 left-0 w-10 h-10 rounded-full border border-white/40 z-[999] pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                animate={{ 
                    x: mousePos.x, 
                    y: mousePos.y,
                    scale: isHovering ? 1.5 : 1,
                    backgroundColor: isHovering ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0)",
                    borderColor: isHovering ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.4)"
                }}
                transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.4 }}
            />
        </>
    );
};
