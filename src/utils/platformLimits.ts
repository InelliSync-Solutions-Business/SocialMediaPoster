export type Platform = 
  | 'twitter' 
  | 'instagram' 
  | 'linkedin' 
  | 'facebook' 
  | 'tiktok' 
  | 'discord'
  | 'short'
  | 'thread'
  | 'post'
  | 'newsletter'
  | undefined;

export interface PlatformLimits {
  characterLimit: number;
  recommendedLimit?: number;
}

export interface PlatformFormats {
  instagram?: {
    imageGeneration: boolean;
    hashtagSuggestions: boolean;
  };
  linkedin?: {
    professionalTone: boolean;
  };
  twitter?: {
    characterLimitOptimization: boolean;
  };
  tiktok?: {
    trendingHashtags: boolean;
  };
  facebook?: {
    communityEngagement: boolean;
  };
  discord?: {
    threadedDiscussions: boolean;
  };
  short?: {
    template?: string;
  };
  thread?: {
    template?: string;
  };
  post?: {
    template?: string;
  };
  newsletter?: {
    template?: string;
  };
  templates?: {
    template?: string;
  };
  template?: string;
  imageGeneration?: boolean;
  hashtagSuggestions?: boolean;
  professionalTone?: boolean;
  characterLimitOptimization?: boolean;
  trendingHashtags?: boolean;
  communityEngagement?: boolean;
  threadedDiscussions?: boolean;
}

export const PLATFORM_CHARACTER_LIMITS: Record<Exclude<Platform, undefined>, PlatformLimits> = {
  twitter: { 
    characterLimit: 280,
    recommendedLimit: 240 
  },
  instagram: { 
    characterLimit: 2200,
    recommendedLimit: 1500 
  },
  linkedin: { 
    characterLimit: 2200,
    recommendedLimit: 1500 
  },
  facebook: { 
    characterLimit: 2200,
    recommendedLimit: 1500 
  },
  tiktok: { 
    characterLimit: 150,
    recommendedLimit: 120 
  },
  discord: { 
    characterLimit: 2000,
    recommendedLimit: 1500 
  },
  short: { 
    characterLimit: 140,
    recommendedLimit: 120 
  },
  thread: {
    characterLimit: 280,
    recommendedLimit: 240
  },
  post: {
    characterLimit: 500,
    recommendedLimit: 400
  },
  newsletter: {
    characterLimit: 2200,
    recommendedLimit: 1800
  }
};

export function isPlatform(platform?: string): platform is Platform {
  return platform ? Object.keys(PLATFORM_CHARACTER_LIMITS).includes(platform.toLowerCase()) : false;
}

export function getPlatformCharacterLimit(platform?: Platform | string): number {
  // Normalize platform input
  const normalizedPlatform = platform?.toLowerCase() as Platform;
  
  // Check if platform is valid
  if (!normalizedPlatform || !isPlatform(normalizedPlatform)) {
    console.warn(`Invalid platform: ${platform}. Defaulting to Twitter limit.`);
    return PLATFORM_CHARACTER_LIMITS.twitter.characterLimit;
  }

  return PLATFORM_CHARACTER_LIMITS[normalizedPlatform].characterLimit;
}

export function getPlatformRecommendedLimit(platform?: Platform | string): number {
  // Normalize platform input
  const normalizedPlatform = platform?.toLowerCase() as Platform;
  
  // Check if platform is valid
  if (!normalizedPlatform || !isPlatform(normalizedPlatform)) {
    console.warn(`Invalid platform: ${platform}. Defaulting to Twitter recommended limit.`);
    return PLATFORM_CHARACTER_LIMITS.twitter.recommendedLimit || 240;
  }

  return PLATFORM_CHARACTER_LIMITS[normalizedPlatform].recommendedLimit 
    || PLATFORM_CHARACTER_LIMITS[normalizedPlatform].characterLimit;
}

// Utility to validate and sanitize platform input
export function sanitizePlatform(platform?: string | null): Platform {
  if (!platform) return undefined;
  
  const lowercasePlatform = platform.toLowerCase();
  return isPlatform(lowercasePlatform) ? lowercasePlatform : undefined;
}
