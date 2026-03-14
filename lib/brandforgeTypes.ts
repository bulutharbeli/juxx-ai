export interface LogoRequest {
  companyName?: string;
  tagline?: string;
  description: string;
  style: string;
  logoType: string;
  color: string;
  referenceImage?: string;
  negativePrompt?: string;
}

export interface GeneratedImage {
  id: string;
  url: string; // Data URL
  prompt: string;
  type: 'logo' | 'mockup';
  mockupType?: string;
  aspectRatio?: string;
  isLoading?: boolean;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING_LOGO = 'GENERATING_LOGO',
  LOGO_REVIEW = 'LOGO_REVIEW',
  GENERATING_MOCKUPS = 'GENERATING_MOCKUPS',
  SHOWCASE = 'SHOWCASE',
}

export const DEFAULT_MOCKUP_TYPES = [
  { id: 'business_card', label: 'Business Card', promptSuffix: 'The provided logo printed centrally on a clean white premium business card lying on a wooden desk, photorealistic, high resolution' },
  { id: 'signage', label: 'Office Signage', promptSuffix: 'The provided logo mounted as a 3D sign on a modern office wall, cinematic lighting, corporate headquarters' },
  { id: 'tshirt', label: 'Apparel', promptSuffix: 'The provided logo printed clearly on the chest of a plain black t-shirt, front view, studio lighting, high quality' },
  { id: 'coffee_cup', label: 'Merchandise', promptSuffix: 'The provided logo printed on the side of a white ceramic coffee mug on a table, soft lighting' },
];

export interface MockupConfig {
  id: string;
  label: string;
  promptSuffix: string;
}