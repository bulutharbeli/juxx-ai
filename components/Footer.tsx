import { Link } from "react-router-dom";
import { motion } from "motion/react";

export const Footer = () => {
    return (
        <footer className="py-20 border-t border-white/5 bg-black/40 backdrop-blur-xl relative z-30">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 items-start">
                <div className="lg:col-span-1">
                    <div className="logo text-2xl font-black mb-6">✺ JUXX AI</div>
                    <p className="text-white/40 max-w-sm text-sm">
                        An AI-first creative studio engineering the next era of visual identity.
                    </p>
                </div>

                {/* Futuristic HUD Map */}
                <div className="md:col-span-2 lg:col-span-2 relative group">
                    <div className="absolute -top-3 -left-3 w-6 h-6 border-t border-l border-primary-gradient opacity-60 z-30" />
                    <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b border-r border-primary-gradient opacity-60 z-30" />
                    
                    <div className="relative w-full h-[200px] rounded-sm overflow-hidden border border-white/5 bg-black/40 backdrop-blur-md">
                        {/* Target Crosshair Effect */}
                        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                            <motion.div 
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    opacity: [0.3, 0.6, 0.3]
                                }}
                                transition={{ 
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="relative w-12 h-12 flex items-center justify-center"
                            >
                                {/* Center Dot */}
                                <div className="w-1.5 h-1.5 rounded-full bg-[#FA93FA]" />
                                
                                {/* Brackets/Target Lines */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-[#FA93FA]/50" />
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-3 bg-[#FA93FA]/50" />
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-[1px] bg-[#FA93FA]/50" />
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-[1px] bg-[#FA93FA]/50" />
                                
                                {/* Outer pulsing ring */}
                                <div className="absolute inset-0 border border-[#FA93FA]/20 rounded-full animate-ping" />
                            </motion.div>
                        </div>

                        {/* HUD Overlays */}
                        <div className="absolute inset-0 scanner-beam opacity-[0.15] pointer-events-none z-20" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_40%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-10" />
                        
                        {/* Glass Reflection Effect */}
                        <div className="absolute -top-full -left-full w-[200%] h-[200%] bg-gradient-to-br from-white/5 via-transparent to-transparent rotate-45 pointer-events-none z-20 opacity-30 group-hover:translate-x-1/2 group-hover:translate-y-1/2 transition-transform duration-1000" />

                        <div className="absolute top-3 left-3 z-30 flex items-center gap-2">
                             <div className="w-1 h-1 rounded-full bg-[#FA93FA] animate-ping" />
                             <span className="text-[7px] font-heading tracking-[0.4em] text-white/30 uppercase mix-blend-difference">SIGNAL_FOUND // COORDINATES_SET</span>
                        </div>

                        <div className="absolute bottom-3 right-3 z-30 text-[7px] font-heading text-white/20 tracking-tighter text-right">
                            36.8826° N<br/>30.7210° E
                        </div>

                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.3214681738364!2d30.721002775306882!3d36.88265716304805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c39ab27575d7df%3A0xecafc08fe4678f48!2zTWV5ZGFua2F2YcSfxLEsIDE1NTYuIFNrLiBObzo0LCAwNzIwMCBNdXJhdHBhxZ9hL0FudGFseWE!5e0!3m2!1sen!2str!4v1773521679354!5m2!1sen!2str" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.1) brightness(0.8) opacity(0.2)' }} 
                            allowFullScreen={true}
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            className="group-hover:opacity-40 transition-all duration-700 scale-125 group-hover:scale-110"
                        />
                    </div>
                </div>

                <div className="lg:ml-auto">
                    <h4 className="font-heading text-sm mb-6 uppercase tracking-widest text-white/20">Explore</h4>
                    <ul className="space-y-4 text-white/60 text-sm">
                        <li><Link to="/" className="hover:text-[#FA93FA] transition-colors">Home</Link></li>
                        <li><a href="/#work" className="hover:text-[#FA93FA] transition-colors">Works</a></li>
                        <li><a href="/#works" className="hover:text-[#FA93FA] transition-colors">Capabilities</a></li>
                    </ul>
                </div>
                <div className="lg:ml-auto">
                    <h4 className="font-heading text-sm mb-6 uppercase tracking-widest text-white/20">Connect</h4>
                    <ul className="space-y-4 text-white/60 text-sm">
                        <li><a href="#" className="hover:text-[#FA93FA] transition-colors">Instagram</a></li>
                        <li><a href="#" className="hover:text-[#FA93FA] transition-colors">X / Twitter</a></li>
                        <li><a href="#" className="hover:text-[#FA93FA] transition-colors">LinkedIn</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};
