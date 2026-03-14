import React, { useState } from 'react';
import { useContent, ContentData } from '../lib/ContentContext';
import { Save, Plus, Trash2, Layout, Image, FileText, Video, Upload, Settings, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminPanel = () => {
    const { content, updateContent, resetContent } = useContent();
    const [localContent, setLocalContent] = useState<ContentData | null>(null);
    const [activeTab, setActiveTab] = useState('hero');
    const [newLogoUrl, setNewLogoUrl] = useState('');

    React.useEffect(() => {
        if (content && !localContent) {
            setLocalContent(JSON.parse(JSON.stringify(content))); // Deep copy for local state
        }
    }, [content, localContent]);

    if (!content || !localContent) return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
            <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin mb-6" />
            <p className="text-white/40 text-sm tracking-[0.3em] uppercase">Booting Content Engine...</p>
        </div>
    );

    const handleSave = () => {
        updateContent(localContent);
        alert('Changes published successfully.');
    };

    const handleReset = () => {
        if (confirm('Verify: Reset all content to defaults? This cannot be undone.')) {
            resetContent();
            setLocalContent(null);
        }
    };

    const updateNestedField = (path: string, val: any) => {
        const newData = JSON.parse(JSON.stringify(localContent));
        const keys = path.split('.');
        let current: any = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = val;
        setLocalContent(newData);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-row font-sans">
            <aside className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl p-8 flex flex-col gap-10 h-screen sticky top-0 shrink-0 overflow-y-auto z-50 shadow-2xl">
                <div className="text-xl font-black tracking-tighter flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-gradient shadow-[0_0_15px_rgba(201,103,232,0.4)] flex items-center justify-center">
                        <Layout size={18} className="text-white" />
                    </div>
                    CORE ADMIN
                </div>

                <nav className="flex flex-col gap-2">
                    {[
                        { id: 'hero', label: 'Hero', icon: <Layout size={16} /> },
                        { id: 'portfolio', label: 'Portfolio', icon: <Image size={16} /> },
                        { id: 'capabilities', label: 'Capabilities', icon: <Settings size={16} /> },
                        { id: 'logos', label: 'Logo Cloud', icon: <div className="w-4 h-4 border border-white/20 rounded-sm" /> },
                        { id: 'footer', label: 'Footer & Video', icon: <Video size={16} /> },
                        { id: 'contact', label: 'Contact', icon: <FileText size={16} /> },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold tracking-tight transition-all ${activeTab === tab.id ? 'bg-white/10 text-white shadow-xl ring-1 ring-white/10' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </nav>

                <div className="mt-auto space-y-3 pt-10 border-t border-white/5">
                    <button
                        onClick={handleSave}
                        className="w-full flex items-center justify-center gap-2 bg-primary-gradient text-white py-4 rounded-2xl font-black text-sm shadow-[0_0_30px_rgba(201,103,232,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        <Save size={18} />
                        PUBLISH CHANGES
                    </button>
                    <button
                        onClick={handleReset}
                        className="w-full flex items-center justify-center gap-2 border border-white/5 text-white/30 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:text-red-400 hover:border-red-400/20 transition-all"
                    >
                        <RefreshCw size={12} />
                        Reset Defaults
                    </button>
                    <a href="/" className="block text-center text-[10px] uppercase tracking-[0.3em] font-black text-white/20 hover:text-[#FA93FA] transition-colors pt-4">Return to Site</a>
                </div>
            </aside>

            <main className="flex-1 p-16 overflow-y-auto bg-gradient-to-br from-[#050505] to-[#010101] relative z-10">
                <header className="mb-16 border-b border-white/5 pb-10">
                    <h1 className="text-5xl font-black font-heading tracking-tighter mb-4 text-gradient">Edit {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
                    <p className="text-white/30 text-base max-w-2xl font-medium leading-relaxed italic">Manage every pixel and parameter of your digital identity.</p>
                </header>

                <div className="max-w-5xl">
                    {activeTab === 'hero' && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                            <InputField label="Hero Title" value={localContent.hero.title} onChange={(v) => updateNestedField('hero.title', v)} />
                            <TextAreaField label="Hero Description" value={localContent.hero.description} onChange={(v) => updateNestedField('hero.description', v)} />
                        </motion.div>
                    )}

                    {activeTab === 'portfolio' && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10 focus-within:ring-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-3xl bg-white/[0.03] border border-white/10 mb-10 shadow-2xl">
                                <InputField label="Section Badge" value={localContent.sections?.portfolio?.badge || ''} onChange={(v) => updateNestedField('sections.portfolio.badge', v)} />
                                <InputField label="Section Title" value={localContent.sections?.portfolio?.title || ''} onChange={(v) => updateNestedField('sections.portfolio.title', v)} />
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {localContent.portfolio.map((item, idx) => (
                                    <div key={item.id} className="p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-sm space-y-6 relative group hover:border-white/20 transition-all shadow-xl">
                                        <button onClick={() => {
                                            const newList = localContent.portfolio.filter((_, i) => i !== idx);
                                            updateNestedField('portfolio', newList);
                                        }} className="absolute top-6 right-6 p-3 rounded-full bg-red-500/10 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white">
                                            <Trash2 size={16} />
                                        </button>
                                        <InputField label="Project Title" value={item.title} onChange={(v) => {
                                            const newList = [...localContent.portfolio];
                                            newList[idx] = { ...newList[idx], title: v };
                                            updateNestedField('portfolio', newList);
                                        }} />
                                        <div className="grid grid-cols-2 gap-6">
                                            <InputField label="Category" value={item.category} onChange={(v) => {
                                                const newList = [...localContent.portfolio];
                                                newList[idx] = { ...newList[idx], category: v };
                                                updateNestedField('portfolio', newList);
                                            }} />
                                            <InputField label="Year" value={item.year} onChange={(v) => {
                                                const newList = [...localContent.portfolio];
                                                newList[idx] = { ...newList[idx], year: v };
                                                updateNestedField('portfolio', newList);
                                            }} />
                                        </div>
                                        <InputField label="Thumbnail Image" value={item.imageUrl} onChange={(v) => {
                                            const newList = [...localContent.portfolio];
                                            newList[idx] = { ...newList[idx], imageUrl: v };
                                            updateNestedField('portfolio', newList);
                                        }} allowUpload />
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => {
                                const newList = [...localContent.portfolio, { id: Date.now(), title: "New Project", category: "AI Design", year: "2026", imageUrl: "" }];
                                updateNestedField('portfolio', newList);
                            }} className="w-full py-8 border-2 border-dashed border-white/5 rounded-3xl flex items-center justify-center gap-3 text-white/20 hover:text-white hover:border-white/20 transition-all hover:bg-white/5 group">
                                <Plus size={24} className="group-hover:rotate-90 transition-transform" /> <span className="font-bold tracking-widest uppercase text-sm">Add Project</span>
                            </button>
                        </motion.div>
                    )}

                    {activeTab === 'capabilities' && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 rounded-3xl bg-white/[0.03] border border-white/10 mb-10 shadow-2xl">
                                <InputField label="Section Badge" value={localContent.sections?.capabilities?.badge || ''} onChange={(v) => updateNestedField('sections.capabilities.badge', v)} />
                                <InputField label="Section Title" value={localContent.sections?.capabilities?.title || ''} onChange={(v) => updateNestedField('sections.capabilities.title', v)} />
                                <InputField label="Accordion Subtitle" value={localContent.sections?.capabilities?.subtitle || ''} onChange={(v) => updateNestedField('sections.capabilities.subtitle', v)} />
                                <InputField label="Button Text" value={localContent.sections?.capabilities?.buttonText || ''} onChange={(v) => updateNestedField('sections.capabilities.buttonText', v)} />
                                <div className="md:col-span-2">
                                    <TextAreaField label="Accordion Description" value={localContent.sections?.capabilities?.description || ''} onChange={(v) => updateNestedField('sections.capabilities.description', v)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {localContent.capabilities.map((item, idx) => (
                                    <div key={item.id} className="p-10 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-sm space-y-6 relative group hover:border-white/20 transition-all shadow-xl">
                                        <InputField label="Capability Name" value={item.title} onChange={(v) => {
                                            const newList = [...localContent.capabilities];
                                            newList[idx] = { ...newList[idx], title: v };
                                            updateNestedField('capabilities', newList);
                                        }} />
                                        <InputField label="Background Image" value={item.imageUrl} onChange={(v) => {
                                            const newList = [...localContent.capabilities];
                                            newList[idx] = { ...newList[idx], imageUrl: v };
                                            updateNestedField('capabilities', newList);
                                        }} allowUpload />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'logos' && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 shadow-2xl mb-10">
                                <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black mb-4 block">Add New Partner Logo</label>
                                <div className="flex gap-4">
                                    <input type="text" value={newLogoUrl} onChange={(e) => setNewLogoUrl(e.target.value)} placeholder="Enter SVG/PNG URL..." className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm focus:outline-none focus:border-[#FA93FA]/50 transition-all font-medium" />

                                    <label className="flex items-center justify-center px-6 rounded-xl bg-white/10 border border-white/10 cursor-pointer hover:bg-white hover:text-black transition-all group shrink-0">
                                        <Upload size={20} className="group-hover:scale-110 transition-transform" />
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    updateNestedField('logos', [...localContent.logos, reader.result as string]);
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        }} />
                                    </label>

                                    <button onClick={() => {
                                        if (newLogoUrl) {
                                            updateNestedField('logos', [...localContent.logos, newLogoUrl]);
                                            setNewLogoUrl('');
                                        }
                                    }} className="px-8 bg-white text-black font-black rounded-xl hover:scale-105 active:scale-95 transition-all text-xs uppercase tracking-widest shadow-xl">ADD LOGO</button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {localContent.logos.map((logo, idx) => (
                                    <div key={idx} className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 relative group flex items-center justify-center h-32 hover:border-[#FA93FA]/20 transition-all shadow-lg">
                                        <img src={logo} alt="Logo" className="h-full w-full object-contain group-hover:scale-105 transition-transform" />
                                        <button onClick={() => {
                                            const newList = localContent.logos.filter((_, i) => i !== idx);
                                            updateNestedField('logos', newList);
                                        }} className="absolute -top-2 -right-2 p-2 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-xl">
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'footer' && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                            <InputField label="Action Headline" value={localContent.footerAction.headline} onChange={(v) => updateNestedField('footerAction.headline', v)} />
                            <TextAreaField label="Action Subheadline" value={localContent.footerAction.subheadline} onChange={(v) => updateNestedField('footerAction.subheadline', v)} />
                            <InputField label="Video Manifest URL (.m3u8)" value={localContent.footerAction.videoUrl} onChange={(v) => updateNestedField('footerAction.videoUrl', v)} />
                        </motion.div>
                    )}

                    {activeTab === 'contact' && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                            <InputField label="Contact Headline" value={localContent.contact.headline} onChange={(v) => updateNestedField('contact.headline', v)} />
                            <InputField label="Email Address" value={localContent.contact.email} onChange={(v) => updateNestedField('contact.email', v)} />
                        </motion.div>
                    )}
                </div>
            </main>
        </div>
    );
};

const InputField = ({ label, value, onChange, allowUpload = false }: { label: string, value: string, onChange: (v: string) => void, allowUpload?: boolean }) => {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => onChange(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col gap-3 flex-1 overflow-hidden">
            <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black ml-1">{label}</label>
            <div className="relative flex gap-2">
                <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FA93FA]/50 transition-all font-medium whitespace-nowrap overflow-hidden text-ellipsis shadow-inner" />
                {allowUpload && (
                    <label className="flex items-center justify-center px-4 py-3 rounded-xl bg-white/10 border border-white/10 cursor-pointer hover:bg-white hover:text-black transition-all group shrink-0">
                        <Upload size={14} className="group-hover:scale-110 transition-transform" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                    </label>
                )}
            </div>
        </div>
    );
};

const TextAreaField = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
    <div className="flex flex-col gap-3 w-full">
        <label className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black ml-1">{label}</label>
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FA93FA]/50 transition-all resize-none shadow-inner font-medium leading-relaxed" />
    </div>
);
