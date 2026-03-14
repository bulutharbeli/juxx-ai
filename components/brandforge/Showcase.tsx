import React, { useState } from 'react';
import JSZip from 'jszip';
import { GeneratedImage } from '../../lib/brandforgeTypes';
import { vectorizeLogo } from '../../lib/geminiService';

interface ShowcaseProps {
  images: GeneratedImage[];
  onRestart: () => void;
  onRegenerateMockup: (mockup: GeneratedImage) => void;
  onRegenerateAll: () => void;
}

const Showcase: React.FC<ShowcaseProps> = ({ images, onRestart, onRegenerateMockup, onRegenerateAll }) => {
  const [isZipping, setIsZipping] = useState(false);
  const [isVectorizing, setIsVectorizing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editParams, setEditParams] = useState<{ prompt: string, aspectRatio: string }>({ prompt: '', aspectRatio: '16:9' });

  const logo = images.find(img => img.type === 'logo');
  const mockups = images.filter(img => img.type === 'mockup');

  // Check if any mockup is currently loading
  const isAnyLoading = images.some(img => img.isLoading);

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSvg = async (url: string, filename: string) => {
    if (isVectorizing) return;
    setIsVectorizing(true);

    try {
      const svgContent = await vectorizeLogo(url);
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Vectorization failed", e);
    } finally {
      setIsVectorizing(false);
    }
  };

  const handleDownloadZip = async () => {
    if (!logo || isZipping) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      const brandFolder = zip.folder("brand-kit");

      // 1. Add Logo Files
      const logoData = logo.url.split(',')[1];

      // Add PNG
      brandFolder?.file("logo-master.png", logoData, { base64: true });

      // Add Vector SVG (call API)
      try {
        const vectorSvg = await vectorizeLogo(logo.url);
        brandFolder?.file("logo-vector.svg", vectorSvg);
      } catch (e) {
        console.warn("Failed to include vector svg in zip, falling back to embedded png");
        const svgContent = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><image width="1024" height="1024" href="${logo.url}" /></svg>`;
        brandFolder?.file("logo-source.svg", svgContent);
      }

      // 2. Add Mockups
      if (mockups.length > 0) {
        const mockupsFolder = brandFolder?.folder("mockups");
        mockups.forEach((m, idx) => {
          const mData = m.url.split(',')[1];
          const safeName = (m.mockupType || `mockup-${idx + 1}`).toLowerCase().replace(/[^a-z0-9]/g, '-');
          mockupsFolder?.file(`${safeName}.png`, mData, { base64: true });
        });
      }

      // 3. Generate and Download
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = "brand-kit.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (e) {
      console.error("Failed to generate zip", e);
    } finally {
      setIsZipping(false);
    }
  };

  const startEditing = (mockup: GeneratedImage) => {
    setEditingId(mockup.id);
    setEditParams({
      prompt: mockup.prompt,
      aspectRatio: mockup.aspectRatio || '16:9'
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveAndRegenerate = (mockup: GeneratedImage) => {
    onRegenerateMockup({
      ...mockup,
      prompt: editParams.prompt,
      aspectRatio: editParams.aspectRatio
    });
    setEditingId(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in duration-1000">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Brand Assets</h2>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button
            onClick={onRegenerateAll}
            disabled={isAnyLoading}
            className="flex-1 sm:flex-none px-6 py-2 bg-white/5 hover:bg-white/10 text-white/60 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Regenerate All
          </button>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping || !logo}
            className="flex-1 sm:flex-none px-8 py-2 bg-[#FA93FA] text-black rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
          >
            {isZipping ? "PACKAGING..." : "DOWNLOAD KIT (ZIP)"}
          </button>

          <button
            onClick={onRestart}
            className="flex-1 sm:flex-none px-6 py-2 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105"
          >
            NEW BRAND
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Logo Card */}
        {logo && (
          <div className="col-span-1 md:col-span-2 lg:col-span-1 row-span-2 group relative bg-white rounded-3xl overflow-hidden border border-white/10 flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="absolute top-4 left-4 bg-black px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-[0.2em] z-10">
              MASTER IDENTITY
            </div>

            <div className="flex-grow p-12 flex items-center justify-center bg-white min-h-[400px]">
              <img src={logo.url} alt="Master Logo" className="max-w-full max-h-full object-contain" />
            </div>

            <div className="p-4 bg-black border-t border-white/5 grid grid-cols-2 gap-3">
              <button
                onClick={() => downloadImage(logo.url, 'logo.png')}
                className="bg-white text-black px-4 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:scale-105 transition-all"
              >
                PNG
              </button>
              <button
                onClick={() => downloadSvg(logo.url, 'logo.svg')}
                className="bg-white/5 border border-white/10 text-white px-4 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase hover:bg-white/10 transition-all"
                disabled={isVectorizing}
              >
                {isVectorizing ? '...' : 'SVG'}
              </button>
            </div>
          </div>
        )}

        {/* Mockups */}
        {mockups.map((mockup, idx) => (
          <div key={mockup.id} className="relative group rounded-3xl overflow-hidden bg-black/40 border border-white/10 flex flex-col shadow-2xl">

            {/* Edit Overlay */}
            {editingId === mockup.id && (
              <div className="absolute inset-0 bg-black/90 z-30 p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Neural Context</h4>
                  <button onClick={cancelEditing} className="text-white/40 hover:text-white">✕</button>
                </div>
                <textarea
                  value={editParams.prompt}
                  onChange={e => setEditParams({ ...editParams, prompt: e.target.value })}
                  className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-[11px] text-white resize-none focus:border-[#FA93FA]/50 font-medium"
                />
                <div className="grid grid-cols-2 gap-3 mt-auto">
                  <button onClick={cancelEditing} className="py-3 bg-white/5 text-white/60 text-[10px] font-black uppercase rounded-xl tracking-widest">CANCEL</button>
                  <button onClick={() => saveAndRegenerate(mockup)} className="py-3 bg-[#6DE6FF] text-black text-[10px] font-black uppercase rounded-xl tracking-widest">SYNC</button>
                </div>
              </div>
            )}

            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black text-white/60 uppercase tracking-widest z-10 border border-white/10">
              {mockup.mockupType}
            </div>

            <div className={`relative w-full flex-grow flex items-center justify-center bg-black/20 ${mockup.aspectRatio === '1:1' ? 'aspect-square' :
              mockup.aspectRatio === '9:16' ? 'aspect-[9/16]' :
                mockup.aspectRatio === '3:4' ? 'aspect-[3/4]' :
                  mockup.aspectRatio === '4:3' ? 'aspect-[4/3]' :
                    'aspect-video'
              }`}>
              {mockup.isLoading && (
                <div className="absolute inset-0 bg-black/60 z-10 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-[10px] font-black text-[#FA93FA] animate-pulse uppercase tracking-[0.2em]">PROCESSING</span>
                </div>
              )}
              <img
                src={mockup.url}
                alt={mockup.mockupType}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-black/90 p-3 border-t border-white/5 flex gap-2">
              <button
                onClick={() => startEditing(mockup)}
                disabled={mockup.isLoading}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/40 text-[9px] font-black uppercase rounded-xl tracking-widest transition-all"
              >
                EDIT
              </button>
              <button
                onClick={() => onRegenerateMockup(mockup)}
                disabled={mockup.isLoading}
                className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white/40 text-[9px] font-black uppercase rounded-xl tracking-widest transition-all border border-white/5"
              >
                RETRY
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Showcase;