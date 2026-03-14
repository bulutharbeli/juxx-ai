import React, { useEffect, useRef } from "react";
import Hls from "hls.js";
import { motion } from "motion/react";
import { Zap, ArrowRight, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { InfiniteSlider } from "./ui/infinite-slider";

const logos = [
    "https://html.tailus.io/blocks/customers/openai.svg",
    "https://html.tailus.io/blocks/customers/nvidia.svg",
    "https://html.tailus.io/blocks/customers/github.svg",
    "https://html.tailus.io/blocks/customers/google.svg",
    "https://html.tailus.io/blocks/customers/microsoft.svg",
    "https://html.tailus.io/blocks/customers/amazon.svg",
];

export const Hero = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const hlsUrl = "https://customer-cbeadsgr09pnsezs.cloudflarestream.com/697945ca6b876878dba3b23fbd2f1561/manifest/video.m3u8";

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(hlsUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(console.error);
            });
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = hlsUrl;
            video.addEventListener("loadedmetadata", () => {
                video.play().catch(console.error);
            });
        }
    }, []);

    return (
        <div className="relative min-h-screen bg-[#010101] overflow-hidden flex flex-col items-center">
            {/* 1. Header/Announcement */}
            <div className="mt-20 z-20 flex flex-col items-center text-center px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(28,27,36,0.15)] border border-white/5 backdrop-blur-md mb-8"
                >
                    <div className="w-5 h-5 rounded bg-gradient-to-br from-[#FA93FA] via-[#C967E8] to-[#983AD6] flex items-center justify-center shadow-[0_0_10px_rgba(201,103,232,0.5)]">
                        <Zap size={12} className="text-white fill-white" />
                    </div>
                    <span className="text-[13px] text-white/60 font-medium tracking-tight">Used by founders. Loved by devs.</span>
                </motion.div>

                {/* 2. Headline */}
                <h1 className="text-[48px] md:text-[80px] font-black leading-[1] md:leading-[1.1] tracking-[-0.05em] mb-6 text-center">
                    <span className="text-white block opacity-90">Your Vision</span>
                    <span className="block text-gradient">
                        Our Digital Reality.
                    </span>
                </h1>

                {/* 3. Subheadline */}
                <p className="max-w-[600px] text-lg md:text-xl text-white/70 font-medium leading-relaxed mb-12 text-center">
                    We turn bold ideas into modern designs that don't just look amazing, they grow your business fast.
                </p>

                {/* 4. CTA */}
                <div className="relative z-30">
                    <div className="absolute inset-0 bg-white/10 blur-xl rounded-full scale-110 -z-10" />
                    <a
                        href="#contact"
                        className="group flex items-center gap-4 bg-white hover:bg-white/95 text-black font-black pl-10 pr-3 py-3 rounded-full transition-all active:scale-95 duration-500 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                    >
                        Book a 15-min call
                        <div className="w-10 h-10 rounded-full bg-primary-gradient flex items-center justify-center text-white shadow-[0_0_15px_rgba(201,103,232,0.4)]">
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </a>
                </div>
            </div>

            {/* 5. Video Section */}
            <div className="relative w-full -mt-[180px] md:-mt-[220px] z-10 select-none pointer-events-none">
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#010101] via-transparent to-[#010101] h-full" />
                <video
                    ref={videoRef}
                    muted
                    loop
                    playsInline
                    className="w-full h-auto mix-blend-screen opacity-80"
                    style={{ objectFit: 'cover' }}
                >
                    <source src="/_videos/v1/f0c78f536d5f21a047fb7792723a36f9d647daa1" type="video/mp4" />
                </video>
            </div>

            {/* 6. Logo Cloud */}
            <div className="w-full mt-auto py-12 bg-black/20 backdrop-blur-sm border-t border-white/5 z-20">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="flex items-center gap-6 whitespace-nowrap">
                            <span className="text-sm font-semibold text-white/40 uppercase tracking-widest">Powering the best teams</span>
                            <div className="hidden md:block w-[1px] h-8 bg-white/5" />
                        </div>
                        <InfiniteSlider items={logos} className="flex-1" />
                    </div>
                </div>
            </div>
        </div>
    );
};
