import { motion } from 'motion/react';
import { Cpu, Eye, Cloud, Zap, Shield, Globe } from 'lucide-react';
import { useContent } from '../lib/ContentContext';

const capabilityIcons = [
    <Cpu className="w-6 h-6 text-[#C967E8]" />,
    <Eye className="w-6 h-6 text-[#6DE6FF]" />,
    <Zap className="w-6 h-6 text-[#FA93FA]" />,
    <Globe className="w-6 h-6 text-[#C967E8]" />,
    <Shield className="w-6 h-6 text-[#6DE6FF]" />,
    <Cloud className="w-6 h-6 text-[#FA93FA]" />
];

const defaultServices = [
    {
        id: 1,
        title: "NEURAL BRANDING",
        description: "We architect identity systems using generative models tuned for high-growth startups."
    },
    {
        id: 2,
        title: "COMPUTATIONAL UI",
        description: "Design systems that adapt in real-time to user behavior through neural interface logic."
    },
    {
        id: 3,
        title: "ALGORITHMIC MOTION",
        description: "Dynamic visual assets powered by physics-based simulations and AI motion engines."
    },
    {
        id: 4,
        title: "SYNTHETIC CONTENT",
        description: "Enterprise-scale content pipelines leveraging custom LLMs for brand-consistent messaging."
    },
    {
        id: 5,
        title: "VISION COMPUTING",
        description: "Integrating advanced spatial tracking and visual analysis into immersive brand experiences."
    },
    {
        id: 6,
        title: "MATRIX STRATEGY",
        description: "Data-informed product roadmaps built on visual analytics and market sentiment models."
    }
];

export const NeuralCapabilitiesGrid = () => {
    const { content } = useContent();
    
    // Use services from content if available, otherwise fallback to default fütüristik services
    const services = content?.services || defaultServices;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {services.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.8 }}
                    whileHover={{ scale: 1.02 }}
                    className="group relative p-8 rounded-2xl bg-[#030303] border border-white/5 overflow-hidden transition-all hover:bg-white/[0.02]"
                >
                    {/* Futuristic Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-gradient opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500" />
                    
                    {/* Scan line effect */}
                    <div className="absolute inset-0 scanner-beam opacity-0 group-hover:opacity-10 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 group-hover:border-white/20 transition-colors">
                            {capabilityIcons[index % capabilityIcons.length]}
                        </div>

                        <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-2">
                                <span className="text-[10px] text-white/20 font-heading tracking-[0.3em]">0{index + 1}</span>
                                <div className="h-[1px] w-4 bg-white/10" />
                             </div>
                             <h3 className="text-xl font-black font-heading tracking-tight text-white mb-4 uppercase">
                                {item.title}
                             </h3>
                        </div>

                        <p className="text-sm text-white/40 leading-relaxed max-w-[240px]">
                            {item.description}
                        </p>
                        
                        <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                             <span className="text-[10px] font-heading text-white/40 tracking-widest uppercase">Learn More</span>
                             <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
                                 <span className="text-xs">→</span>
                             </div>
                        </div>
                    </div>

                    {/* Corner details */}
                    <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/10" />
                    <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/10" />
                </motion.div>
            ))}
        </div>
    );
};
