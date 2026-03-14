import React, { useState, useEffect } from 'react';

// Define a local interface for the aistudio object to ensure type safety
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

interface ApiKeyGuardProps {
  children: React.ReactElement;
}

const ApiKeyGuard: React.FC<ApiKeyGuardProps> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [isFlashMode, setIsFlashMode] = useState<boolean>(false);
  const [checking, setChecking] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkKey = async () => {
    try {
      const aiStudio = (window as any).aistudio as AIStudio | undefined;
      if (aiStudio) {
        const selected = await aiStudio.hasSelectedApiKey();
        setHasKey(selected);
      } else if (process.env.API_KEY) {
        // Fallback for local development or environments where key is pre-set
        setHasKey(true);
      }
    } catch (e) {
      console.error("Error checking API key status", e);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkKey();
  }, []);

  const handleConnectPro = async () => {
    setError(null);
    const aiStudio = (window as any).aistudio as AIStudio | undefined;

    if (aiStudio) {
      try {
        await aiStudio.openSelectKey();
        // As per guidelines, assume success after modal trigger to avoid race conditions
        setHasKey(true);
        setIsFlashMode(false);
      } catch (e: any) {
        console.error("Failed to open key selector", e);
        setError("Could not open API key selector. Please try again.");
      }
    } else {
      setError("AI Studio environment not detected. Pro features require a specific environment.");
    }
  };

  const handleProceedFlash = () => {
    setIsFlashMode(true);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="text-sm font-medium text-slate-400">Initializing BrandForge...</div>
        </div>
      </div>
    );
  }

  // Allow access if they have a key OR specifically chose Flash mode
  if (!hasKey && !isFlashMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white p-4">
        <div className="max-w-[440px] w-full bg-[#1e293b] p-10 rounded-3xl shadow-2xl border border-slate-700/50 text-center animate-in fade-in zoom-in-95 duration-500">
          <div className="mb-8 bg-indigo-500/10 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-indigo-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold mb-3 tracking-tight">Access Required</h2>
          <p className="text-slate-400 text-sm mb-10 leading-relaxed">
            Choose how you'd like to use BrandForge AI. Pro mode offers 2K/4K resolution and superior brand accuracy.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleConnectPro}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 group"
            >
              <span>Connect Pro API Key</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>

            <button
              onClick={handleProceedFlash}
              className="w-full py-4 px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl border border-slate-700 transition-all"
            >
              Continue with Standard (Free)
            </button>
          </div>
          
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-xs text-red-300">
                {error}
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-slate-700/50">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-slate-500 hover:text-indigo-400 transition-colors flex items-center justify-center gap-1"
            >
              <span>Learn about billing & models</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Clone App and inject the selected initial tier if it was 'flash' mode
  return React.cloneElement(children as React.ReactElement<any>, { 
    initialModelTier: isFlashMode ? 'flash' : 'pro' 
  });
};

export default ApiKeyGuard;