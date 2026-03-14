import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export const Header = () => {
    const location = useLocation();
    const isAdmin = location.pathname === '/admin';

    if (isAdmin) return null;

    return (
        <header className="fixed top-0 left-0 w-full z-[100] px-6 py-6 transition-all">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="logo text-xl font-black tracking-tighter">✺ JUXX AI</Link>

                <nav className="hidden md:flex items-center gap-10">
                    <a href="#works" className="text-[11px] font-black tracking-[0.2em] text-white/40 hover:text-white transition-colors uppercase">
                        Capabilities
                    </a>
                    <a href="#work" className="text-[11px] font-black tracking-[0.2em] text-white/40 hover:text-white transition-colors uppercase">
                        Works
                    </a>
                    <a href="/#contact" className="text-[11px] font-black tracking-[0.2em] text-white/40 hover:text-white transition-colors uppercase">
                        Collaborate
                    </a>
                </nav>

                <div className="flex items-center gap-4">
                    <a
                        href="/#contact"
                        className="group flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 hover:border-white/20 bg-white/5 backdrop-blur-md transition-all text-[11px] font-black tracking-widest"
                    >
                        START PROJECT <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>
            </div>
        </header>
    );
};
