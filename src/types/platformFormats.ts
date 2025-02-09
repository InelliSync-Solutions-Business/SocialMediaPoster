export interface PlatformSpecificFormat {
  // Instagram-specific features
  imageGeneration: boolean;
  hashtagSuggestions: boolean;
  carouselPosts: boolean;
  storyPosts: boolean;
  reels: boolean;
  igTV: boolean;
  liveStreaming: boolean;
  shopping: boolean;
  affiliateMarketing: boolean;
  brandedContent: boolean;
  productTags: boolean;
  donationStickers: boolean;
  questionStickers: boolean;

  // LinkedIn-specific features
  professionalTone: boolean;

  // Twitter-specific features
  characterLimitOptimization: boolean;

  // TikTok-specific features
  trendingHashtags: boolean;

  // Facebook-specific features
  communityEngagement: boolean;

  // Discord-specific features
  threadedDiscussions: boolean;
  communityInteraction: boolean;

  // Email-specific features
  emailOptimization: boolean;
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
