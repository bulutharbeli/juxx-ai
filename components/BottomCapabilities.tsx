import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import { motion } from "motion/react";
import { Zap, ArrowRight } from "lucide-react";
import { useContent } from "../lib/ContentContext";

export const BottomCapabilities = () => {
    const { content } = useContent();
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !content) return;

        const hlsUrl = content.footerAction.videoUrl;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(hlsUrl);
            hls.attachMedia(video);
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = hlsUrl;
        }
    }, [content]);

    if (!content) return null;

    return (
        <section className="relative bg-[#010101] pt-12 pb-32 border-t border-white/5 overflow-hidden">
            <div className="container mx-auto px-6 relative z-20">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(28,27,36,0.15)] border border-white/5 backdrop-blur-md mb-8"
                    >
                        <div className="w-5 h-5 rounded bg-primary-gradient flex items-center justify-center">
                            <Zap size={10} className="text-white fill-white" />
                        </div>
                        <span className="text-[11px] text-white/50 tracking-widest uppercase">Used by founders. Loved by devs.</span>
                    </motion.div>

                    <h2 className="text-[10vw] md:text-[6vw] font-black font-heading leading-none tracking-tighter mb-8 max-w-4xl uppercase">
                        {content.footerAction.headline}
                    </h2>

                    <p className="max-w-xl text-white/60 text-lg leading-relaxed mb-12">
                        {content.footerAction.subheadline}
                    </p>

                    <div className="relative group">
                        <a
                            href="#contact"
                            className="inline-flex items-center gap-4 bg-white text-black font-black pl-10 pr-3 py-3 rounded-full transition-all hover:scale-105 active:scale-95 duration-300"
                        >
                            {content.sections.capabilities.buttonText}
                            <div className="w-10 h-10 rounded-full bg-primary-gradient flex items-center justify-center text-white">
                                <ArrowRight size={20} />
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            {/* Background Video Content */}
            <div className="relative w-full -mt-20 z-10 opacity-40">
                <div className="absolute inset-0 bg-gradient-to-b from-[#010101] via-transparent to-[#010101]" />
                <video ref={videoRef} muted loop autoPlay playsInline className="w-full h-auto mix-blend-screen">
                    <source src="/_videos/v1/f0c78f536d5f21a047fb7792723a36f9d647daa1" type="video/mp4" />
                </video>
            </div>


        </section>
    );
};
