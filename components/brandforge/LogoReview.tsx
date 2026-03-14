import React, { useState, useRef, useEffect } from 'react';
import { MockupConfig } from '../../lib/brandforgeTypes';
import { vectorizeLogo } from '../../lib/geminiService';

interface LogoReviewProps {
  logoUrls: string[];
  mockupOptions: MockupConfig[];
  onConfirm: (selectedLogoUrl: string, selectedMockupIds: string[], aspectRatio: string) => void;
  onRegenerate: () => void;
  onRetry: () => void;
  onRefineLogo: (index: number, instruction: string) => Promise<void>;
  onAddCustomMockup: (label: string, promptDetails: string) => void;
  isMockupLoading: boolean;
  isRefining: boolean;
}

const LogoReview: React.FC<LogoReviewProps> = ({ logoUrls, mockupOptions, onConfirm, onRegenerate, onRefineLogo, onAddCustomMockup, isMockupLoading, isRefining }) => {
  const [selectedLogoIndex, setSelectedLogoIndex] = useState<number>(0);
  const [isVectorizing, setIsVectorizing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [selectedMockupIds, setSelectedMockupIds] = useState<string[]>(mockupOptions.map(m => m.id));

  // Edit State
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [editColor, setEditColor] = useState<string>("#000000");
  const [isColorOverridden, setIsColorOverridden] = useState<boolean>(false);
  const [removeBg, setRemoveBg] = useState<boolean>(true);
  const [canvasBg, setCanvasBg] = useState<string>('transparent');

  // Refine Prompt State
  const [refineInstruction, setRefineInstruction] = useState("");

  // Mockup Config State
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>("16:9");

  // Custom Mockup State
  const [customLabel, setCustomLabel] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [processedSource, setProcessedSource] = useState<HTMLCanvasElement | HTMLImageElement | null>(null);

  const selectedLogoUrl = logoUrls[selectedLogoIndex];

  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setProcessedSource(null);
  }, [selectedLogoIndex, selectedLogoUrl]);

  useEffect(() => {
    if (mockupOptions.length > 0 && selectedMockupIds.length === 0) {
      setSelectedMockupIds(mockupOptions.map(m => m.id));
    }
  }, [mockupOptions]);

  useEffect(() => {
    setIsProcessing(true);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = selectedLogoUrl;

    img.onload = () => {
      if (!isColorOverridden && !removeBg) {
        setProcessedSource(img);
        setIsProcessing(false);
        return;
      }

      const offCanvas = document.createElement('canvas');
      offCanvas.width = img.width || 1024;
      offCanvas.height = img.height || 1024;
      const ctx = offCanvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.drawImage(img, 0, 0, offCanvas.width, offCanvas.height);
      const imageData = ctx.getImageData(0, 0, offCanvas.width, offCanvas.height);
      const data = imageData.data;

      let targetR = 0, targetG = 0, targetB = 0;
      if (isColorOverridden) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(editColor);
        if (result) {
          targetR = parseInt(result[1], 16);
          targetG = parseInt(result[2], 16);
          targetB = parseInt(result[3], 16);
        }
      }

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

        if (removeBg) {
          let newAlpha = 255 - luminance;
          if (newAlpha < 20) newAlpha = 0;
          data[i + 3] = Math.min(data[i + 3], newAlpha);
        }

        if (isColorOverridden) {
          if (data[i + 3] > 0) {
            data[i] = targetR;
            data[i + 1] = targetG;
            data[i + 2] = targetB;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedSource(offCanvas);
      setIsProcessing(false);
    };
  }, [selectedLogoUrl, isColorOverridden, editColor, removeBg]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (canvasBg !== 'transparent') {
      ctx.fillStyle = canvasBg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (!processedSource) return;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.translate(position.x, position.y);
    ctx.scale(scale, scale);

    const w = processedSource.width;
    const h = processedSource.height;
    ctx.drawImage(processedSource, -w / 2, -h / 2);
    ctx.restore();
  }, [processedSource, scale, position, canvasBg]);

  const handleRefine = async () => {
    if (!refineInstruction.trim() || isRefining) return;
    await onRefineLogo(selectedLogoIndex, refineInstruction);
    setRefineInstruction("");
  };

  const getFinalImageUrl = (): string => {
    return canvasRef.current?.toDataURL('image/png') || selectedLogoUrl;
  };

  const toggleMockupSelection = (id: string) => {
    if (isMockupLoading) return;
    setSelectedMockupIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const downloadImage = (filename: string) => {
    const url = getFinalImageUrl();
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSvg = async (filename: string) => {
    if (isVectorizing) return;
    setIsVectorizing(true);
    try {
      const url = getFinalImageUrl();
      const svgContent = await vectorizeLogo(url);
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Download failed", e);
    } finally {
      setIsVectorizing(false);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customLabel.trim() || !customPrompt.trim()) return;
    onAddCustomMockup(customLabel, customPrompt);
    setCustomLabel("");
    setCustomPrompt("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">

      {/* Top Section: Original Candidates */}
      <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Master Selections</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {logoUrls.map((url, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedLogoIndex(idx)}
              className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all group ${selectedLogoIndex === idx ? 'border-[#FA93FA] shadow-[0_0_20px_rgba(250,147,250,0.2)]' : 'border-white/5 hover:border-white/20'
                }`}
            >
              <img src={url} alt={`Option ${idx + 1}`} className="w-full h-full object-contain bg-white p-4" />
              {selectedLogoIndex === idx && (
                <div className="absolute top-3 right-3 bg-[#FA93FA] text-black p-1 rounded-full shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
        <div className="mt-6 flex justify-center">
          <button
            onClick={onRegenerate}
            className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white/60 text-[10px] font-black rounded-full transition-all border border-white/10 flex items-center gap-2 uppercase tracking-widest"
          >
            Regenerate Concepts
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: Editor & Preview */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl">
            <h3 className="text-xl font-black text-white mb-4 uppercase tracking-tighter">Edit Neural Asset</h3>

            <div className="aspect-square relative w-full mb-6 bg-white rounded-3xl overflow-hidden border border-white/10 shadow-inner">
              <canvas ref={canvasRef} width={1024} height={1024} className="w-full h-full object-contain z-10 relative" />
              {(isProcessing || isRefining) && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
                  <span className="text-[10px] font-black text-[#FA93FA] uppercase tracking-[0.3em]">{isRefining ? 'AI REFINEMENT' : 'PROCESSING'}</span>
                </div>
              )}
            </div>

            {/* AI Refinement Area */}
            <div className="bg-[#6DE6FF]/5 border border-[#6DE6FF]/20 p-4 rounded-2xl mb-6">
              <label className="block text-[10px] font-black text-[#6DE6FF] uppercase tracking-widest mb-2">Neural Refine (Text, Icons, Colors)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={refineInstruction}
                  onChange={(e) => setRefineInstruction(e.target.value)}
                  placeholder="e.g. Correct text to 'VELORA'..."
                  className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#6DE6FF]/50 font-medium"
                  disabled={isRefining}
                />
                <button
                  onClick={handleRefine}
                  disabled={!refineInstruction.trim() || isRefining}
                  className="px-4 py-2 bg-[#6DE6FF] text-black text-[10px] font-black rounded-xl transition-all disabled:opacity-50 uppercase tracking-widest"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest">Asset Scale</label>
                <input type="range" min="0.1" max="3" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} className="w-full accent-[#FA93FA]" />
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="removeBg" checked={removeBg} onChange={(e) => setRemoveBg(e.target.checked)} className="w-4 h-4 rounded accent-[#FA93FA]" />
                  <label htmlFor="removeBg" className="text-[10px] font-black text-white/60 uppercase">Alpha Background</label>
                </div>
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest">Neural Tint</label>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={isColorOverridden} onChange={(e) => setIsColorOverridden(e.target.checked)} className="w-4 h-4 rounded accent-[#FA93FA]" />
                  <input type="color" value={editColor} onChange={(e) => setEditColor(e.target.value)} disabled={!isColorOverridden} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-white/10" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => downloadImage('logo.png')} className="py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
              DOWNLOAD PNG
            </button>
            <button onClick={() => downloadSvg('logo.svg')} disabled={isVectorizing} className="py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
              {isVectorizing ? 'PROCESSING' : 'DOWNLOAD SVG'}
            </button>
          </div>
        </div>

        {/* Right: Mockup Config */}
        <div className="w-full lg:w-1/2 space-y-6">
          <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl">
            <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Manifest Identity</h3>
            <p className="text-white/40 text-sm font-medium mb-6">Select deployment environments for your brand asset.</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {mockupOptions.map((mockup) => (
                <button
                  key={mockup.id}
                  onClick={() => toggleMockupSelection(mockup.id)}
                  className={`p-4 rounded-2xl border transition-all relative text-left ${selectedMockupIds.includes(mockup.id) ? 'bg-[#FA93FA]/10 border-[#FA93FA]' : 'bg-black/40 border-white/10 hover:border-white/30'
                    }`}
                >
                  <span className={`text-xs font-black uppercase tracking-widest ${selectedMockupIds.includes(mockup.id) ? 'text-[#FA93FA]' : 'text-white/40'}`}>{mockup.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleAddCustom} className="mb-8 space-y-3">
              <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest">Add Custom Deployment</label>
              <div className="flex flex-col gap-2">
                <input value={customLabel} onChange={e => setCustomLabel(e.target.value)} placeholder="Deployment Label (e.g. Car Wrap)" className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FA93FA]/50 font-medium" />
                <div className="flex gap-2">
                  <input value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} placeholder="Neural context..." className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#FA93FA]/50 font-medium" />
                  <button type="submit" disabled={!customLabel || !customPrompt} className="px-6 py-2 bg-white text-black text-[10px] font-black rounded-xl transition-all disabled:opacity-50 uppercase">ADD</button>
                </div>
              </div>
            </form>

            <div className="mb-8">
              <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Aspect Ratio</label>
              <div className="flex flex-wrap gap-2">
                {['16:9', '1:1', '9:16', '3:4', '4:3'].map(r => (
                  <button key={r} onClick={() => setSelectedAspectRatio(r)} className={`px-4 py-2 rounded-full text-[10px] font-black border transition-all ${selectedAspectRatio === r ? 'bg-[#6DE6FF] text-black border-transparent' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'}`}>{r}</button>
                ))}
              </div>
            </div>

            <button
              onClick={() => onConfirm(getFinalImageUrl(), selectedMockupIds, selectedAspectRatio)}
              disabled={isMockupLoading || selectedMockupIds.length === 0}
              className="w-full py-5 bg-white text-black font-black rounded-2xl shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98]"
            >
              {isMockupLoading ? (
                "DEPLOING ASSETS..."
              ) : (
                "GENERATE BRAND SHOWCASE"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoReview;