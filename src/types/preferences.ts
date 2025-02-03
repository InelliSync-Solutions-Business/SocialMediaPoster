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
  contentLength: 'short' | 'medium' | 'long';
  defaultWritingStyle: 'technical' | 'conversational' | 'persuasive' | 'storytelling';
  defaultAudience: 'general' | 'tech' | 'business' | 'developers';
  platformFormats: PlatformFormats;
  contentTypes: {
    [key: string]: boolean;
  };
  defaultGuidelines: [
    'Maintain brand voice consistency',
    'Include relevant industry keywords',
    'Adhere to platform character limits',
    'Use inclusive language',
    'Follow SEO best practices'
  ];
  // personaTraits?: string[]; // Array of NOVA persona traits
}
