import { PlatformSpecificFormat } from './platformFormats';

export interface PlatformFormats {
  instagram: PlatformSpecificFormat;
  linkedin: PlatformSpecificFormat;
  twitter: PlatformSpecificFormat;
  tiktok: PlatformSpecificFormat;
  facebook: PlatformSpecificFormat;
  discord: PlatformSpecificFormat;
  newsletter: PlatformSpecificFormat;
}

export interface UserPreferences {
  platforms: {
    instagram: {
      enabled: boolean;
      features: {
        imageGeneration: boolean;
        hashtagSuggestions: boolean;
        carouselPosts: boolean;
        storyPosts: boolean;
        reels: boolean;
        liveStreaming: boolean;
        shopping: boolean;
        affiliateMarketing: boolean;
        brandedContent: boolean;
        productTags: boolean;
        donationStickers: boolean;
        professionalTone: boolean;
        characterLimitOptimization: boolean;
        threadedDiscussions: boolean;
        segmentationTips: boolean;
        templateCustomization: boolean;
      };
    };
    linkedin: {
      enabled: boolean;
      features: {
        professionalTone: boolean;
        imageGeneration: boolean;
        hashtagSuggestions: boolean;
        carouselPosts: boolean;
        storyPosts: boolean;
        reels: boolean;
        liveStreaming: boolean;
        shopping: boolean;
        affiliateMarketing: boolean;
        brandedContent: boolean;
        productTags: boolean;
        donationStickers: boolean;
        threadedDiscussions: boolean;
        segmentationTips: boolean;
        templateCustomization: boolean;
        characterLimitOptimization: boolean;
      };
    };
    twitter: {
      enabled: boolean;
      features: {
        professionalTone: boolean;
        imageGeneration: boolean;
        templateCustomization: boolean;
        characterLimitOptimization: boolean;
        segmentationTips: boolean;
        hashtagSuggestions: boolean;
        carouselPosts: boolean;
        storyPosts: boolean;
        reels: boolean;
        liveStreaming: boolean;
        shopping: boolean;
        affiliateMarketing: boolean;
        brandedContent: boolean;
        productTags: boolean;
        donationStickers: boolean;
        threadedDiscussions: boolean;
      };
    };
    tiktok: {
      enabled: boolean;
      features: {
        professionalTone: boolean;
        imageGeneration: boolean;
        templateCustomization: boolean;
        characterLimitOptimization: boolean;
        segmentationTips: boolean;
        hashtagSuggestions: boolean;
        carouselPosts: boolean;
        storyPosts: boolean;
        reels: boolean;
        liveStreaming: boolean;
        shopping: boolean;
        affiliateMarketing: boolean;
        brandedContent: boolean;
        productTags: boolean;
        donationStickers: boolean;
        threadedDiscussions: boolean;
      };
    };
    facebook: {
      enabled: boolean;
      features: {
        professionalTone: boolean;
        imageGeneration: boolean;
        templateCustomization: boolean;
        characterLimitOptimization: boolean;
        segmentationTips: boolean;
        hashtagSuggestions: boolean;
        carouselPosts: boolean;
        storyPosts: boolean;
        reels: boolean;
        liveStreaming: boolean;
        shopping: boolean;
        affiliateMarketing: boolean;
        brandedContent: boolean;
        productTags: boolean;
        donationStickers: boolean;
        threadedDiscussions: boolean;
      };
    };
    discord: {
      enabled: boolean;
      features: {
        professionalTone: boolean;
        imageGeneration: boolean;
        templateCustomization: boolean;
        characterLimitOptimization: boolean;
        segmentationTips: boolean;
        hashtagSuggestions: boolean;
        carouselPosts: boolean;
        storyPosts: boolean;
        reels: boolean;
        liveStreaming: boolean;
        shopping: boolean;
        affiliateMarketing: boolean;
        brandedContent: boolean;
        productTags: boolean;
        donationStickers: boolean;
        threadedDiscussions: boolean;
      };
    };
    newsletter: {
      enabled: boolean;
      features: {
        professionalTone: boolean;
        imageGeneration: boolean;
        templateCustomization: boolean;
        characterLimitOptimization: boolean;
        segmentationTips: boolean;
        hashtagSuggestions: boolean;
        carouselPosts: boolean;
        storyPosts: boolean;
        reels: boolean;
        liveStreaming: boolean;
        shopping: boolean;
        affiliateMarketing: boolean;
        brandedContent: boolean;
        productTags: boolean;
        donationStickers: boolean;
        threadedDiscussions: boolean;
      };
    };
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
