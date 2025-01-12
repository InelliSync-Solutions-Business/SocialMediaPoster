export interface PlatformFormats {
  instagram: {
    imageGeneration: boolean;
    hashtagSuggestions: boolean;
  };
  linkedin: {
    professionalTone: boolean;
  };
  twitter: {
    characterLimitOptimization: boolean;
  };
  tiktok: {
    trendingHashtags: boolean;
  };
  facebook: {
    communityEngagement: boolean;
  };
  discord: {
    threadedDiscussions: boolean;
  };
}

export interface UserPreferences {
  platforms: {
    instagram: boolean;
    linkedin: boolean;
    twitter: boolean;
    tiktok: boolean;
    facebook: boolean;
    discord: boolean;
  };
  tone: 'professional' | 'casual' | 'inspirational' | 'humorous';
  platformFormats: PlatformFormats;
  contentTypes: {
    [key: string]: boolean;
  };
}
