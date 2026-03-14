import React, { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useContent } from '../../lib/ContentContext';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface AccordionItemProps {
    item: { id: number; title: string; imageUrl: string };
    isActive: boolean;
    onMouseEnter: () => void;
}

const AccordionItem = ({ item, isActive, onMouseEnter }: AccordionItemProps) => {
    return (
        <div
            className={cn(
                "relative h-[450px] rounded-2xl overflow-hidden cursor-pointer",
                "transition-all duration-700 ease-in-out border border-white/5",
                isActive ? "w-[400px] border-white/20" : "w-[80px]"
            )}
            onMouseEnter={onMouseEnter}
        >
            <img src={item.imageUrl} alt={item.title}
                className={cn("absolute inset-0 w-full h-full object-cover transition-transform duration-1000", isActive ? "scale-105" : "scale-100 grayscale")} />
            <div className={cn("absolute inset-0 bg-black/40 transition-opacity duration-500", isActive ? "opacity-20" : "opacity-60")}></div>
            <span className={cn("absolute text-white text-lg font-bold whitespace-nowrap tracking-wider font-heading transition-all duration-500",
                isActive ? "bottom-8 left-8 rotate-0 opacity-100" : "bottom-24 left-1/2 -translate-x-1/2 rotate-90 opacity-40 text-sm")}>
                {item.title}
            </span>
        </div>
    );
};

export function LandingAccordionItem() {
    const { content } = useContent();
    const [activeIndex, setActiveIndex] = useState(0);

    if (!content) return null;

    return (
        <div className="bg-black/20 backdrop-blur-3xl rounded-3xl border border-white/5 p-8 md:p-12 mb-24 overflow-hidden">
            <div className="flex flex-col xl:flex-row items-center justify-between gap-16">
                <div className="w-full xl:w-2/5 text-center xl:text-left">
                    <div className="inline-block px-4 py-1 rounded-full border border-white/10 text-xs tracking-[0.2em] text-white/50 mb-6 font-heading">
                        {content.sections.capabilities.label}
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter font-heading mb-8 uppercase">
                        {content.sections.capabilities.subtitle.split('\\n').map((line, i) => (
                            <React.Fragment key={i}>{line}{i === 0 && <br />}</React.Fragment>
                        ))}
                    </h2>
                    <p className="text-lg text-white/60 max-w-xl leading-relaxed">
                        {content.sections.capabilities.description}
                    </p>
                    <div className="mt-10">
                        <a href="#contact" className="group inline-flex items-center gap-2 bg-white text-black font-bold px-10 py-4 rounded-full transition-all active:scale-95 font-heading text-sm uppercase">
                            {content.sections.capabilities.buttonText} <span className="group-hover:translate-x-1 transition-transform">↗</span>
                        </a>
                    </div>
                </div>

                <div className="w-full xl:w-3/5">
                    <div className="flex flex-row items-center justify-center gap-4 p-4">
                        {content.capabilities.map((item, index) => (
                            <AccordionItem key={item.id} item={item} isActive={index === activeIndex} onMouseEnter={() => setActiveIndex(index)} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
