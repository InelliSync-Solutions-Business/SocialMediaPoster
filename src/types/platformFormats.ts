export interface PlatformSpecificFormat {
  // Core features
  imageGeneration: boolean;
  hashtagSuggestions: boolean;
  carouselPosts: boolean;
  storyPosts: boolean;
  reels: boolean;
  
  // Platform-specific features
  professionalTone: boolean;
  characterLimitOptimization: boolean;
  trendingHashtags: boolean;
  communityEngagement: boolean;
  threadedDiscussions: boolean;
  communityInteraction: boolean;

  // Additional advanced features
  liveStreaming: boolean;
  shopping: boolean;
  affiliateMarketing: boolean;
  brandedContent: boolean;
  productTags: boolean;
  donationStickers: boolean;
  segmentationTips: boolean;
  templateCustomization: boolean;
}

export interface PlatformFormats {
  instagram: PlatformSpecificFormat;
  linkedin: PlatformSpecificFormat;
  twitter: PlatformSpecificFormat;
  tiktok: PlatformSpecificFormat;
  facebook: PlatformSpecificFormat;
  discord: PlatformSpecificFormat;
  newsletter: PlatformSpecificFormat;
}
