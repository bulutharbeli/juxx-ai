import { Link } from "react-router-dom";

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
                    <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-primary-gradient opacity-40" />
                    <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-primary-gradient opacity-40" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-primary-gradient opacity-40" />
                    <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-primary-gradient opacity-40" />
                    
                    <div className="relative w-full h-[180px] rounded-lg overflow-hidden border border-white/10 bg-white/[0.02]">
                        <div className="absolute inset-0 scanner-beam opacity-10 pointer-events-none z-10" />
                        <div className="absolute top-2 left-2 z-20 flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-primary-gradient animate-pulse" />
                             <span className="text-[8px] font-heading tracking-widest text-white/40 uppercase">HQ_LOCATION // ANTALYA</span>
                        </div>
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3191.3214681738364!2d30.721002775306882!3d36.88265716304805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14c39ab27575d7df%3A0xecafc08fe4678f48!2zTWV5ZGFua2F2YcSfxLEsIDE1NTYuIFNrLiBObzo0LCAwNzIwMCBNdXJhdHBhxZ9hL0FudGFseWE!5e0!3m2!1sen!2str!4v1773521679354!5m2!1sen!2str" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.2)' }} 
                            allowFullScreen={true}
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            className="opacity-60 hover:opacity-100 transition-opacity duration-500"
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
