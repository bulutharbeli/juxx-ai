import { useEffect, useRef } from "react";
import { Application } from "@splinetool/runtime";
import { motion } from "motion/react";
import { useContent } from "../lib/ContentContext";


export const SplineHero = () => {
    const { content } = useContent();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const loaderRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !content) return;

        const splineApp = new Application(canvasRef.current);
        splineApp.load(content.hero.splineUrl)
            .then(() => {
                if (loaderRef.current) loaderRef.current.classList.add('opacity-0');
                setTimeout(() => {
                    if (loaderRef.current) loaderRef.current.style.display = 'none';
                }, 1000);

                const head = splineApp.findObjectByName('Head') ||
                    splineApp.findObjectByName('head');
                const body = splineApp.findObjectByName('Robot') ||
                    splineApp.findObjectByName('robot');

                if (head || body) {
                    let targetX = 0, targetY = 0;
                    let currentX = 0, currentY = 0;

                    const handleMove = (e: MouseEvent) => {
                        targetX = (e.clientX / window.innerWidth) * 2 - 1;
                        targetY = (e.clientY / window.innerHeight) * 2 - 1;
                    };

                    window.addEventListener('mousemove', handleMove);

                    let frame: number;
                    const update = () => {
                        currentX += (targetX - currentX) * 0.15;
                        currentY += (targetY - currentY) * 0.15;

                        if (head) {
                            head.rotation.y = currentX * 1.5;
                            head.rotation.x = currentY * 0.8;
                        }
                        if (body) {
                            body.rotation.y = currentX * 0.4;
                            body.rotation.x = currentY * 0.2;
                        }
                        frame = requestAnimationFrame(update);
                    };
                    update();

                    return () => {
                        window.removeEventListener('mousemove', handleMove);
                        cancelAnimationFrame(frame);
                    };
                }
            });
    }, []);

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
            {/* Background Content */}
            <div className="absolute inset-x-0 top-[42%] z-20 pointer-events-none flex flex-col items-center text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[3.5vw] font-black leading-none tracking-[-3px] font-heading opacity-95 mix-blend-difference uppercase"
                >
                    {content?.hero.title.split('\\n').map((line: string, i: number) => (
                        <div key={i}>{line}</div>
                    ))}
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 space-y-2 uppercase tracking-[0.4em] text-[10px] text-white/50"
                >
                    {content?.hero.description.split('\\n').map((line: string, i: number) => (
                        <p key={i} className={i === 1 ? "max-w-md mx-auto leading-relaxed opacity-60" : ""}>
                            {line}
                        </p>
                    ))}
                </motion.div>


            </div>

            {/* 3D Visual */}
            <div className="absolute inset-0 z-10">
                <div ref={loaderRef} className="absolute inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                        <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Syncing Creative Core...</span>
                    </div>
                </div>
                <canvas ref={canvasRef} className="w-full h-full" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none" />
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
                <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            </div>
        </section>
    );
};
