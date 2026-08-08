import { motion, useScroll, useTransform } from "framer-motion";
import { useContent } from "../lib/ContentContext";
import { ScrollVideoPlayer } from "./ScrollVideoPlayer";
import { useRef } from "react";

export const SplineHero = () => {
    const { content } = useContent();
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll progress of this specific section
    // offset ["start start", "end end"] means progress goes from 0 to 1 while the section is sticky
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const contentY = useTransform(scrollYProgress, [0, 1], [0, -50]);

    return (
        <section 
            ref={containerRef}
            className="relative h-[400vh] w-full bg-black"
        >
            {/* Sticky Video Background */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <ScrollVideoPlayer progress={scrollYProgress} />
                
                {/* Hero Content Layer */}
                <motion.div 
                    style={{ y: contentY }}
                    className="absolute inset-x-0 top-[20%] z-20 flex flex-col items-center justify-center text-center pointer-events-none px-6"
                >
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[12vw] md:text-[8vw] font-black leading-[0.85] tracking-[-0.04em] font-heading mix-blend-difference uppercase"
                    >
                        {content?.hero.title.split('\\n').map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </motion.h1>
                    
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-8 space-y-3 uppercase tracking-[0.5em] text-[10px] md:text-xs text-white/40"
                    >
                        {content?.hero.description.split('\\n').map((line, i) => (
                            <p key={i} className={i === 1 ? "max-w-xl mx-auto leading-relaxed opacity-60 normal-case tracking-normal text-base md:text-lg mt-4 text-white/80" : ""}>
                                {line}
                            </p>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Overlays */}
                <div className="absolute inset-0 bg-black/20 z-10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/80 to-transparent z-30" />
            </div>

            {/* Scroll Indicator */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 animate-bounce pointer-events-none">
                <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white/40 to-transparent" />
            </div>
        </section>
    );
};
