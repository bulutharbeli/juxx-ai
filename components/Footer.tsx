import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <footer className="py-20 border-t border-white/5 bg-black/40 backdrop-blur-xl relative z-30">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="md:col-span-2">
                    <div className="logo text-2xl font-black mb-6">✺ JUXX AI</div>
                    <p className="text-white/40 max-w-sm">
                        An AI-first creative studio engineering the next era of visual identity.
                    </p>
                </div>
                <div>
                    <h4 className="font-heading text-sm mb-6 uppercase tracking-widest text-white/20">Explore</h4>
                    <ul className="space-y-4 text-white/60">
                        <li><Link to="/" className="hover:text-[#FA93FA] transition-colors">Home</Link></li>
                        <li><a href="/#work" className="hover:text-[#FA93FA] transition-colors">Works</a></li>
                        <li><a href="/#works" className="hover:text-[#FA93FA] transition-colors">Capabilities</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-heading text-sm mb-6 uppercase tracking-widest text-white/20">Connect</h4>
                    <ul className="space-y-4 text-white/60">
                        <li><a href="#" className="hover:text-[#FA93FA] transition-colors">Instagram</a></li>
                        <li><a href="#" className="hover:text-[#FA93FA] transition-colors">X / Twitter</a></li>
                        <li><a href="#" className="hover:text-[#FA93FA] transition-colors">LinkedIn</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};
