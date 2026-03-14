import React, { useState, useRef } from 'react';
import { LogoRequest } from '../../lib/brandforgeTypes';
import { enhancePrompt, generateDescriptionPresets, generateBrandStoryFromIdea } from '../../lib/geminiService';

interface InputFormProps {
  onSubmit: (data: LogoRequest) => void;
  onDirectUse: (imageUrl: string, request: LogoRequest) => void;
  isSubmitting: boolean;
  onError?: (msg: string) => void;
}

const STYLES = [
  "Minimalist & Modern",
  "Vintage & Retro",
  "Abstract & Geometric",
  "Luxurious & Elegant",
  "Playful & Cartoonish",
  "Tech & Cyberpunk"
];

const LOGO_TYPES = [
  "Combination Mark",
  "Wordmark / Logotype",
  "Lettermark / Monogram",
  "Pictorial Mark / Symbol",
  "Abstract Mark",
  "Mascot",
  "Emblem",
];

const COLORS = [
  "Black & White",
  "Modern Blue",
  "Energetic Red",
  "Nature Green",
  "Luxury Gold",
  "Tech Purple",
  "Warm Orange",
  "Multicolor",
];

const DEFAULT_DESCRIPTION_PRESETS = [
  "Abstract solar panel shaped like a rising sun for sustainability",
  "Minimalist gaming controller merged with a lightning bolt",
  "Geometric DNA helix with a digital pixel for biotechnology",
  "Modern electric car silhouette made of a single flowing line",
  "Stylized open book with a graduation cap for education"
];

const InputForm: React.FC<InputFormProps> = ({ onSubmit, onDirectUse, isSubmitting, onError }) => {
  const [companyName, setCompanyName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [rawIdea, setRawIdea] = useState('');
  const [style, setStyle] = useState(STYLES[0]);
  const [logoType, setLogoType] = useState(LOGO_TYPES[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);

  const [presets, setPresets] = useState<string[]>(DEFAULT_DESCRIPTION_PRESETS);
  const [isLoadingPresets, setIsLoadingPresets] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isBrainstorming, setIsBrainstorming] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getRequestData = (): LogoRequest => ({
    companyName: companyName.trim() || undefined,
    tagline: tagline.trim() || undefined,
    description: description.trim() || "Brand Identity",
    style,
    logoType,
    color,
    referenceImage: referenceImage || undefined
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit(getRequestData());
  };

  const handleUseDirectly = () => {
    if (referenceImage) {
      onDirectUse(referenceImage, getRequestData());
    }
  };

  const handleBrainstorm = async () => {
    if (!rawIdea.trim() || isBrainstorming) return;
    setIsBrainstorming(true);
    try {
      const result = await generateBrandStoryFromIdea(rawIdea);
      if (result.description) {
        setDescription(result.description);
        if (result.nameSuggestion && !companyName) setCompanyName(result.nameSuggestion);
        if (result.taglineSuggestion && !tagline) setTagline(result.taglineSuggestion);
      } else {
        throw new Error("No suggestion generated");
      }
    } catch (e: any) {
      console.error("Brainstorm failed", e);
      onError?.("Brainstorming failed. Check your API key or connection.");
    } finally {
      setIsBrainstorming(false);
    }
  };

  const handleEnhanceDescription = async () => {
    if (!description.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhancePrompt(description, style, logoType, color);
      setDescription(enhanced);
    } catch (e: any) {
      console.error("Failed to enhance prompt", e);
      onError?.("AI Enhancement failed. The API might be busy.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleRefreshPresets = async () => {
    if (isLoadingPresets) return;
    setIsLoadingPresets(true);
    try {
      const newPresets = await generateDescriptionPresets(true);
      if (newPresets.length > 0) {
        setPresets(newPresets);
      }
    } catch (e) {
      console.error("Failed to refresh presets", e);
    } finally {
      setIsLoadingPresets(false);
    }
  };

  React.useEffect(() => {
    handleRefreshPresets();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setReferenceImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#0A0A0A]/60 backdrop-blur-2xl p-10 md:p-12 rounded-[2.5rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] mt-10">
      <div className="flex justify-between items-start mb-8">
        <div className="text-left">
          <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">
            Brand Journey
          </h2>
          <p className="text-white/40 text-sm font-medium">Tell us about your brand identity.</p>
        </div>
        <button
          type="button"
          onClick={async () => {
            setIsLoadingPresets(true);
            try {
              await enhancePrompt("ping", "minimal", "icon", "blue");
              onError?.("Connection OK! Core is active.");
            } catch (e: any) {
              onError?.("Connection failed. Check API key.");
            } finally {
              setIsLoadingPresets(false);
            }
          }}
          className="text-[10px] px-3 py-1 bg-white/5 hover:bg-white/10 text-white/40 rounded-full border border-white/10 transition-all font-black"
        >
          {isLoadingPresets ? 'CHECKING...' : 'RELAY STATUS'}
        </button>
      </div>

      <div className="mb-12 flex flex-col gap-6">
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl relative overflow-hidden group">
          <h3 className="text-xs font-black text-[#FA93FA] uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#FA93FA] rounded-full animate-pulse"></span>
            1. Brainstorm Brand Concept
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={rawIdea}
              onChange={(e) => setRawIdea(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#FA93FA]/50 transition-all font-medium"
              placeholder="Describe your raw idea (e.g. Cyberpunk Ramen Bar)..."
              disabled={isBrainstorming || isSubmitting}
            />
            <button
              type="button"
              onClick={handleBrainstorm}
              disabled={isBrainstorming || !rawIdea.trim() || isSubmitting}
              className="px-6 py-2 bg-white text-black text-xs font-black rounded-xl transition-all disabled:opacity-50 uppercase tracking-widest hover:scale-105 active:scale-95"
            >
              {isBrainstorming ? 'THINKING' : 'BRAINSTORM'}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 mb-2">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#6DE6FF]/50 transition-all font-medium"
              placeholder="e.g. Velora"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex flex-col gap-4">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 mb-2">Tagline / Sector</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#6DE6FF]/50 transition-all font-medium"
              placeholder="e.g. Building Constructor"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 mb-2">2. Visual Description</label>
            <button
              type="button"
              onClick={handleRefreshPresets}
              className="text-[10px] text-[#FA93FA] font-black uppercase hover:opacity-70 transition-opacity"
            >
              {isLoadingPresets ? '...' : 'REFRESH'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {presets.slice(0, 3).map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setDescription(preset)}
                className="px-3 py-1.5 bg-white/5 border border-white/10 hover:border-white/20 text-white/40 text-[10px] rounded-full transition-all font-black uppercase tracking-tighter"
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 pb-12 text-white placeholder-white/20 focus:outline-none focus:border-[#FA93FA]/50 transition-all h-32 resize-none font-medium"
              placeholder="Describe the logo icon and overall vibe..."
              disabled={isSubmitting || isEnhancing}
              required
            />
            <button
              type="button"
              onClick={handleEnhanceDescription}
              disabled={isEnhancing || !description.trim() || isSubmitting}
              className="absolute bottom-3 right-3 text-[10px] px-3 py-1.5 bg-[#FA93FA]/10 hover:bg-[#FA93FA]/20 text-[#FA93FA] rounded-lg transition-all font-black uppercase tracking-widest"
            >
              {isEnhancing ? 'ENHANCING' : 'AI ENHANCE'}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 ml-1">Reference Logo / Sketch <span className="text-white/20 font-medium ml-1">(Optional)</span></label>
          {!referenceImage ? (
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-white/10 hover:border-white/20 rounded-2xl p-8 text-center cursor-pointer transition-all bg-white/5">
              <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">DRAG OR UPLOAD ASSET</p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 p-4 flex flex-col items-center">
              <img src={referenceImage} alt="Reference" className="max-h-32 object-contain mb-4" />
              <button type="button" onClick={clearImage} className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors">✕</button>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 mb-2">Visual Style</label>
            <select value={style} onChange={(e) => setStyle(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6DE6FF]/50 font-medium">
              {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-4">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 mb-2">Logo Type</label>
            <select value={logoType} onChange={(e) => setLogoType(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6DE6FF]/50 font-medium">
              {LOGO_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-4">
            <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest ml-1 mb-2">Color Palette</label>
            <select value={color} onChange={(e) => setColor(e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6DE6FF]/50 font-medium">
              {COLORS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <button
            type="submit"
            disabled={isSubmitting || !description}
            className="w-full py-5 bg-gradient-to-r from-[#FA93FA] to-[#6DE6FF] text-black font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting ? (
              <>CRAFTING IDENTITY...</>
            ) : (
              <>GENERATE BRAND SOUL</>
            )}
          </button>

          {referenceImage && (
            <button
              type="button"
              onClick={handleUseDirectly}
              disabled={isSubmitting}
              className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 font-black rounded-2xl transition-all flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest"
            >
              PROCEED WITH UPLOADED LOGO
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default InputForm;