import { motion } from "motion/react";

const logos = [
    { name: "OpenAI", text: "OPENAI" },
    { name: "Google", text: "DEEPMIND" },
    { name: "Anthropic", text: "ANTHROPIC" },
    { name: "Meta", text: "META AI" },
    { name: "Nvidia", text: "NVIDIA" },
    { name: "Tesla", text: "TESLA" },
    { name: "Palantir", text: "PALANTIR" },
    { name: "Boston Dynamics", text: "BOSTON DYNAMICS" }
];

export const LogoTicker = () => {
    return (
        <section className="py-12 bg-black overflow-hidden relative z-30 border-y border-white/5">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="container mx-auto px-6 mb-12 flex justify-center">
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm">
                    <div className="w-2 h-2 rounded-full bg-[#C967E8] animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest text-white/60 font-heading">
                        Trusted by industry leaders
                    </span>
                </div>
            </div>

            <div className="flex whitespace-nowrap mask-image-linear">
                <motion.div
                    animate={{
                        x: ['0%', '-50%']
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="flex gap-20 px-10 items-center opacity-40 font-heading"
                >
                    {/* Render the logos twice to create an infinite scroll illusion */}
                    {[...logos, ...logos].map((logo, index) => (
                        <div key={index} className="flex items-center gap-4 group transition-opacity hover:opacity-100">
                            <span className="text-3xl font-black tracking-widest text-transparent stroke-text hover:text-white transition-colors cursor-default">
                                {logo.text}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
            <style>{`
                .stroke-text {
                    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
                }
                .stroke-text:hover {
                    -webkit-text-stroke: 1px rgba(255, 255, 255, 1);
                }
                .mask-image-linear {
                    mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
                }
            `}</style>
        </section>
    );
};
