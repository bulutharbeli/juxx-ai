import React from "react";
import { motion } from "motion/react";
import { useContent } from "../lib/ContentContext";

export const PortfolioGrid = () => {
    const { content } = useContent();
    if (!content) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20">
            {content.portfolio.map((item, idx) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="portfolio-item group relative overflow-hidden h-[500px] bg-white/5 border border-white/10 rounded-2xl"
                >
                    <div className="portfolio-img-wrapper h-full w-full overflow-hidden">
                        <div
                            className={`portfolio-img h-full w-full bg-cover bg-center grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700`}
                            style={{ backgroundImage: `url(${item.imageUrl})` }}
                        />
                        <div className="portfolio-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 translate-y-4 group-hover:translate-y-0 transition-transform">
                            <span className="text-2xl font-black font-heading text-white">{item.title}</span>
                            <small className="text-[10px] tracking-widest text-white/50 mt-2 uppercase">{item.category} / {item.year}</small>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
