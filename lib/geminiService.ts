/// <reference types="vite/client" />
import { GoogleGenAI, Type } from "@google/genai";
import { MockupConfig } from "./brandforgeTypes";

// Use Gemini 1.5 Flash for everything (Free Tier optimization)
const TEXT_MODEL = 'gemini-2.0-flash';
const IMAGE_MODEL = 'gemini-2.0-flash-exp-image-generation';

const LOGO_NEGATIVE_PROMPT = "low quality, pixelated, blurry, messy text, distorted letters, artifacts, watermark, signature, realistic photo, 3d render, shadow, gradient, complex details, background objects, people, faces, distorted, shaky lines";

/**
 * Helper to handle retries with exponential backoff for rate limiting (429)
 */
async function withRetry<T>(fn: (apiKey: string) => Promise<T>, maxRetries = 3): Promise<T> {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyAOy1RvXqooMJADJXqXBKNlT4s3gnhV-VI").trim();
  if (!apiKey || apiKey === "your_api_key_here") {
    throw new Error("Invalid API Key: Please set VITE_GEMINI_API_KEY in your .env file.");
  }

  let delay = 15000; // Increased base delay for Free Tier (Strict RPM)
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn(apiKey);
    } catch (error: any) {
      console.error(`API Call Error [${i + 1}/${maxRetries}]:`, error);
      const errorMsg = error.toString().toLowerCase();

      // Check for Authentication/Permission errors
      if (errorMsg.includes("401") || errorMsg.includes("unauthenticated") || errorMsg.includes("invalid api key")) {
        throw new Error("Authentication failed: Your API key is invalid.");
      }

      const is429 = errorMsg.includes("429") || errorMsg.includes("resource_exhausted") || errorMsg.includes("quota") || errorMsg.includes("limit");
      const isQuotaExceeded = errorMsg.includes("exceeded your current quota");

      if (is429 && !isQuotaExceeded && i < maxRetries - 1) {
        console.warn(`Rate limit hit. Waiting ${delay}ms before retry ${i + 1}/${maxRetries}...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
        continue;
      }
      
      if (isQuotaExceeded) {
        throw new Error("API_QUOTA_EXCEEDED");
      }
      throw error;
    }
  }
  throw new Error("API is currently busy (Rate Limit). Please wait a moment and try again.");
}

export const generateBrandStoryFromIdea = async (idea: string): Promise<{ description: string; nameSuggestion?: string; taglineSuggestion?: string }> => {
  return withRetry(async (apiKey) => {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: TEXT_MODEL,
      contents: `Expand idea "${idea}" into a logo design brief. Return JSON: {description: string, nameSuggestion: string, taglineSuggestion: string}`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            nameSuggestion: { type: Type.STRING },
            taglineSuggestion: { type: Type.STRING },
          },
          required: ["description"],
        },
      },
    });
    return JSON.parse(response.text || "{}");
  });
};

export const enhancePrompt = async (
  description: string,
  style: string,
  logoType: string,
  color: string
): Promise<string> => {
  return withRetry(async (apiKey) => {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Rewrite this logo prompt for an AI: "${description}". Style: ${style}, Type: ${logoType}, Color: ${color}. Max 40 words.`;
    const response = await ai.models.generateContent({ model: TEXT_MODEL, contents: prompt });
    return response.text?.trim() || description;
  });
};

export const generateDescriptionPresets = async (force: boolean = false): Promise<string[]> => {
  const CACHE_KEY = 'brandforge_presets_v1';
  if (!force) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { timestamp, data } = JSON.parse(cached);
      if (Date.now() - timestamp < 1000 * 60 * 60 * 24) return data;
    }
  }

  try {
    return await withRetry(async (apiKey) => {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: TEXT_MODEL,
        contents: `Generate 5 diverse, unique minimalist logo visual concept strings. Return JSON array of strings.`,
        config: {
          responseMimeType: 'application/json',
          responseSchema: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
      });
      const data = JSON.parse(response.text || "[]");
      if (data.length > 0) {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), data }));
      }
      return data;
    });
  } catch (e) {
    return [
      "Cyberpunk ramen bar with neon chopsticks",
      "Minimalist lotus flower for a meditation app",
      "Geometric owl made of circuit lines for AI",
      "Stylized mountain peak with a sun for outdoors"
    ];
  }
};

const generateSingleLogo = async (
  companyName: string | undefined,
  tagline: string | undefined,
  description: string,
  style: string,
  logoType: string,
  color: string,
  referenceImage?: string,
  userNegativePrompt?: string
): Promise<string> => {
  return withRetry(async (apiKey) => {
    const ai = new GoogleGenAI({ apiKey });
    const naming = companyName ? `Include the name "${companyName}"${tagline ? ` and tagline "${tagline}"` : ''}.` : '';

    const parts: any[] = [
      { text: `Design a vector logo. ${naming} Concept: ${description}. Style: ${style}. Type: ${logoType}. Colors: ${color}. White background. Negative: ${LOGO_NEGATIVE_PROMPT}, ${userNegativePrompt || ''}` }
    ];

    if (referenceImage) {
      parts.push({
        inlineData: {
          mimeType: referenceImage.match(/^data:(.+);base64,/)?.[1] || 'image/png',
          data: referenceImage.split(',')[1]
        }
      });
    }

    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: { parts },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data generated.");
  });
};

export const generateLogoCandidates = async (
  companyName: string | undefined,
  tagline: string | undefined,
  description: string,
  style: string,
  logoType: string,
  color: string,
  referenceImage?: string,
  count: number = 2, // Reduced for free tier safety
  userNegativePrompt?: string
): Promise<string[]> => {
  const successfulLogos: string[] = [];

  for (let i = 0; i < count; i++) {
    try {
      if (i > 0) await new Promise(r => setTimeout(r, 15000)); // Strict 15s delay between images
      const logo = await generateSingleLogo(companyName, tagline, description, style, logoType, color, referenceImage, userNegativePrompt);
      successfulLogos.push(logo);
    } catch (e) {
      console.error(e);
    }
  }

  if (successfulLogos.length === 0) {
    throw new Error("Logo generation failed. Please check your API key quota or connection.");
  }
  return successfulLogos;
};

export const suggestMockupScenarios = async (name: string | undefined, desc: string, logoImage?: string): Promise<MockupConfig[]> => {
  try {
    return await withRetry(async (apiKey) => {
      const ai = new GoogleGenAI({ apiKey });
      const promptText = `Analyze brand "${name || 'New Brand'}" (${desc}). Generate 4 physical mockup scenarios. JSON: [{id, label, promptSuffix}]`;

      const contents: any = {
        parts: [{ text: promptText }]
      };

      if (logoImage) {
        contents.parts.push({
          inlineData: {
            mimeType: logoImage.match(/^data:(.+);base64,/)?.[1] || 'image/png',
            data: logoImage.split(',')[1]
          }
        });
      }

      const response = await ai.models.generateContent({
        model: TEXT_MODEL,
        contents: contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { id: { type: Type.STRING }, label: { type: Type.STRING }, promptSuffix: { type: Type.STRING } },
              required: ["id", "label", "promptSuffix"]
            }
          }
        }
      });
      return JSON.parse(response.text || "[]");
    });
  } catch (e) {
    return [];
  }
};

export const generateMockupImage = async (logo: string, prompt: string, ratio: string = "16:9"): Promise<string> => {
  return withRetry(async (apiKey) => {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [
          { text: `PRODUCT MOCKUP: ${prompt}. Place provided logo on surface realistically.` },
          { inlineData: { mimeType: 'image/png', data: logo.split(',')[1] } }
        ]
      },
      config: { imageConfig: { aspectRatio: ratio } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("Mockup failed.");
  });
};

export const refineLogo = async (img: string, instr: string): Promise<string> => {
  return withRetry(async (apiKey) => {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: IMAGE_MODEL,
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/png', data: img.split(',')[1] } },
          { text: `Modify logo: ${instr}. Keep vector style, white background.` }
        ]
      },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("Refinement failed.");
  });
};

export const vectorizeLogo = async (base64: string): Promise<string> => {
  return new Promise((resolve) => {
    const it = (window as any).ImageTracer;
    if (!it) return resolve(`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><image href="${base64}" width="1024" height="1024" /></svg>`);
    it.imageToSVG(base64, (svg: string) => resolve(svg), { ltres: 5, qtres: 5, pathomit: 64, numberofcolors: 8, viewbox: true, blurradius: 5 });
  });
};
export const getChatResponse = async (message: string, history: any[] = []): Promise<string> => {
  try {
    // Format history for Pollinations OpenAI-compatible format
    const formattedHistory = history.map(h => ({
      role: h.role === 'model' ? 'assistant' : h.role,
      content: h.parts?.[0]?.text || h.text || ''
    }));

    const response = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are the advanced Neural Core Interface of Robo Labs. You speak like a futuristic, highly intelligent AI in Turkish. Respond concisely, professionally, and creatively." },
          ...formattedHistory,
          { role: "user", content: message }
        ],
        model: "openai" // Defaults to a highly capable free model
      })
    });
    
    if (!response.ok) throw new Error("Network error");
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "[NEURAL CORE SYNC ERROR: NO DATA]";
  } catch (err) {
    console.error("Neural Core Fetch Error:", err);
    throw new Error("CONNECTION_ERROR");
  }
};
