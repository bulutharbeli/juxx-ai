import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ContentProvider, useContent } from "./lib/ContentContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SplineHero } from "./components/SplineHero";
import { CustomCursor } from "./components/CustomCursor";
import { PortfolioGrid } from "./components/PortfolioGrid";
import { NeuralCapabilitiesGrid } from "./components/NeuralCapabilitiesGrid";
import { LandingAccordionItem } from "./components/ui/interactive-image-accordion";
import { BottomCapabilities } from "./components/BottomCapabilities";
import { AdminPanel } from "./components/AdminPanel";
import { LogoTicker } from "./components/LogoTicker";

import React from "react";

const SiteLayout = () => {
    const { content } = useContent();
    if (!content) return null;

    return (
        <div className="bg-[#010101] text-white selection:bg-[#C967E8] selection:text-white">
            <SplineHero />

            {/* Portfolio Section */}
            <section id="work" className="pt-32 pb-16 px-6 bg-black relative z-30">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-8">
                        <div>
                            <span className="text-white/40 uppercase tracking-[0.3em] text-xs font-heading">
                                {content.sections.portfolio.badge}
                            </span>
                            <h2 className="text-5xl md:text-[3.5vw] font-black font-heading mt-4 uppercase tracking-[-3px] leading-none">
                                {content.sections.portfolio.title.split('\\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}{i === 0 && <br />}
                                    </React.Fragment>
                                ))}
                            </h2>
                        </div>
                    </div>
                    <PortfolioGrid />
                </div>
            </section>

            <LogoTicker />

            {/* Capabilities Section */}
            <section id="works" className="pt-16 pb-12 px-6 relative z-30">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-4">
                        <div>
                            <span className="text-white/40 uppercase tracking-[0.3em] text-xs font-heading">
                                {content.sections.capabilities.badge}
                            </span>
                            <h2 className="text-5xl md:text-[3.5vw] font-black font-heading mt-4 uppercase tracking-[-3px] leading-none">
                                {content.sections.capabilities.title}
                            </h2>
                        </div>
                    </div>
                    <NeuralCapabilitiesGrid />
                    <LandingAccordionItem />
                </div>
            </section>

            <BottomCapabilities />

            {/* Contact Section */}
            <section id="contact" className="py-40 bg-black text-center relative z-30 overflow-hidden">
                <div className="container mx-auto px-6">
                    <span className="text-white/20 uppercase tracking-[0.5em] text-[10px] mb-6 block font-heading">READY TO REDEFINE YOUR VISUALS?</span>
                    <h2 className="text-[10vw] font-black font-heading leading-none tracking-tighter mb-12 uppercase">
                        {content.contact.headline.split(' ').map((word, i) => (
                            <span key={i} className={i === 2 ? "text-gradient" : ""}>
                                {word}{' '}
                            </span>
                        ))}
                    </h2>
                    <a href={`mailto:${content.contact.email}`} className="text-2xl md:text-4xl font-bold border-b-2 border-white/10 pb-2 hover:border-white transition-all uppercase tracking-tighter">
                        {content.contact.email}
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
};

function App() {
    return (
        <ContentProvider>
            <Router>
                <CustomCursor />
                <Header />
                <Routes>
                    <Route path="/" element={<SiteLayout />} />
                    <Route path="/admin" element={<AdminPanel />} />

                </Routes>
            </Router>
        </ContentProvider>
    );
}

export default App;
