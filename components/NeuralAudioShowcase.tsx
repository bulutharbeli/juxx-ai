import { useState, useRef } from "react";
import { motion } from "motion/react";
import { Play, Pause, Music, Mic2 } from "lucide-react";

const tracks = [
    {
        id: 1,
        title: "NEURAL_DREAM_SQ_01",
        category: "Ambient AI",
        duration: "03:45",
        color: "from-[#C967E8] to-[#67E8F9]",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
    },
    {
        id: 2,
        title: "CYBER_CORE_V2",
        category: "Industrial AI",
        duration: "02:15",
        color: "from-[#67E8F9] to-[#FA93FA]",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
    },
    {
        id: 3,
        title: "SYNTH_GENESIS_X",
        category: "Cinematic AI",
        duration: "04:20",
        color: "from-[#FA93FA] to-[#C967E8]",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
    },
    {
        id: 4,
        title: "VOICE_DESIGN_PROTOTYPE",
        category: "Vocal Synthesis",
        duration: "01:50",
        color: "from-[#C967E8] to-[#FA93FA]",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
    },
    {
        id: 5,
        title: "DATA_DRIVE_RHYTHM",
        category: "Electronic AI",
        duration: "03:10",
        color: "from-[#67E8F9] to-[#C967E8]",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
    }
];

export const NeuralAudioShowcase = () => {
    const [playingId, setPlayingId] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = (track: typeof tracks[0]) => {
        if (playingId === track.id) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            if (audioRef.current) {
                audioRef.current.src = track.url;
                audioRef.current.play();
            }
            setPlayingId(track.id);
        }
    };

    return (
        <section className="py-24 bg-black relative overflow-hidden border-t border-white/5">
            {/* Background HUD Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-gradient/5 to-transparent pointer-events-none" />
            
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                    <div className="max-w-xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
                            <Mic2 size={12} className="text-[#FA93FA]" />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-heading text-white/50">Neural Voice & Audio Design</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black font-heading uppercase tracking-tighter leading-none mb-6">
                            AI GENERATED <span className="text-gradient">SONIC REALITIES</span>
                        </h2>
                        <p className="text-white/40 text-lg leading-relaxed">
                            Engineering the future of sound through neural synthesis. Custom voice models and AI-first audio production for next-gen digital experiences.
                        </p>
                    </div>

                    <div className="hidden lg:block">
                        <div className="relative w-64 h-64 border border-white/10 rounded-full flex items-center justify-center">
                            <div className="absolute inset-0 border border-dashed border-white/5 rounded-full animate-spin-slow" />
                            <div className="w-48 h-48 border border-white/10 rounded-full flex items-center justify-center p-8 bg-black/40 backdrop-blur-xl">
                                <div className="flex items-end gap-1 h-12">
                                    {[...Array(8)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ 
                                                height: playingId ? [10, 40, 15, 35, 12] : 8
                                            }}
                                            transition={{ 
                                                duration: 0.5 + Math.random(), 
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                            className="w-1.5 bg-primary-gradient rounded-full"
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white/5 border border-white/10 rounded-full">
                                <span className="text-[10px] font-heading text-white/20">AUDIO_WAVE_ANALYSIS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-20" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-20" />
                
                <div className="flex gap-6 px-6 overflow-x-auto no-scrollbar pb-8">
                    {tracks.map((track) => (
                        <div 
                            key={track.id}
                            className="min-w-[300px] group relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-500 hover:bg-white/[0.04]"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${track.color} opacity-[0.03] blur-3xl group-hover:opacity-[0.1] transition-opacity`} />
                            
                            <div className="flex items-start justify-between mb-8">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <Music size={20} className="text-white/40" />
                                </div>
                                <div className="text-right">
                                    <span className="block text-[10px] uppercase tracking-widest text-white/20 font-heading mb-1">{track.category}</span>
                                    <span className="block text-xs font-heading text-white/40">{track.duration}</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold font-heading text-white mb-6 uppercase tracking-tight">{track.title}</h3>

                            <button 
                                onClick={() => togglePlay(track)}
                                className="w-full py-4 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center gap-3 group/btn hover:bg-white text-white hover:text-black transition-all duration-300"
                            >
                                {playingId === track.id ? (
                                    <>
                                        <Pause size={18} fill="currentColor" />
                                        <span className="text-xs font-black uppercase tracking-widest">STOP ANALYSIS</span>
                                    </>
                                ) : (
                                    <>
                                        <Play size={18} fill="currentColor" />
                                        <span className="text-xs font-black uppercase tracking-widest">PLAY SAMPLES</span>
                                    </>
                                )}
                            </button>

                            {/* Decorative HUD Corner */}
                            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-40 transition-opacity">
                                <div className="w-2 h-2 border-b border-l border-white/40" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <audio ref={audioRef} onEnded={() => setPlayingId(null)} />
            
            <style>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .animate-spin-slow {
                    animation: spin 20s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </section>
    );
};
