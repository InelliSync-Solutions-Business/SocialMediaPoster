import { PlatformSpecificFormat } from './platformFormats';

export interface TwitterPreferences {
  hashtagLimit?: number;
  threadSupport?: boolean;
  hashtagSuggestions?: boolean;
  templateCustomization?: boolean;
  showEngagement?: boolean;
  enabled?: boolean;
  handle?: string;
  style?: string;
  defaultHashtags?: string[];
}

export interface LinkedinPreferences {
  professionalTone?: boolean;
  articleSupport?: boolean;
  pollSupport?: boolean;
  templateCustomization?: boolean;
  showEngagement?: boolean;
  enabled?: boolean;
  handle?: string;
  style?: string;
  defaultHashtags?: string[];
}

export interface InstagramPreferences {
  imageFormat?: 'square' | 'portrait' | 'landscape';
  hashtagSuggestions?: boolean;
  templateCustomization?: boolean;
  showEngagement?: boolean;
  enabled?: boolean;
  handle?: string;
  style?: string;
  defaultHashtags?: string[];
}

export interface FacebookPreferences {
  linkPreview?: boolean;
  templateCustomization?: boolean;
  showEngagement?: boolean;
  enabled?: boolean;
  handle?: string;
  style?: string;
  defaultHashtags?: string[];
}

export interface NewsletterPreferences {
  templateCustomization?: boolean;
  showEngagement?: boolean;
  enabled?: boolean;
  handle?: string;
  style?: string;
  defaultHashtags?: string[];
}

export interface TikTokPreferences {
  captionLimit?: number;
  templateCustomization?: boolean;
  showEngagement?: boolean;
  enabled?: boolean;
  handle?: string;
  style?: string;
  defaultHashtags?: string[];
}

export interface DiscordPreferences {
  templateCustomization?: boolean;
  showEngagement?: boolean;
  enabled?: boolean;
  handle?: string;
  style?: string;
  defaultHashtags?: string[];
}

export interface PlatformFormats {
  twitter: TwitterPreferences;
  linkedin: LinkedinPreferences;
  instagram: InstagramPreferences;
  facebook: FacebookPreferences;
  newsletter: NewsletterPreferences;
  tiktok: TikTokPreferences;
  discord: DiscordPreferences;
}

export interface UserPreferences {
  tone?: string;
  writingStyle?: string;
  targetAudience?: string;
  useCasualTone?: boolean;
  useProfessionalLanguage?: boolean;
  useEmojis?: boolean;
  formatByPlatform?: boolean;
  includeHashtags?: boolean;
  includeImages?: boolean;
  aiModel?: string;
  platforms: PlatformFormats;
  platformPreferences: PlatformFormats;
  contentTypes?: {
    shortForm?: boolean;
    longForm?: boolean;
    threads?: boolean;
    polls?: boolean;
  };
  tokenLimits?: {
    twitter?: number;
    linkedin?: number;
    facebook?: number;
    instagram?: number;
    [key: string]: number | undefined;
  };
  darkMode?: boolean;
  language?: string;
  fontFamily?: string;
  fontSize?: number;
  timezone?: string;
  maxContentLength?: number;
  maxTokenCount?: number;
  contentPreferences?: {
    postFrequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly';
    includeEmojis?: boolean;
    includeHashtags?: boolean;
    includeLinks?: boolean;
    includeMentions?: boolean;
    contentTypes?: string[];
    brandGuidelines?: string;
  };
  uiPreferences?: {
    previewMode?: 'simple' | 'realistic';
    showWordCount?: boolean;
    showCharacterCount?: boolean;
    showTokenCount?: boolean;
    enableSpellCheck?: boolean;
    enableAutosave?: boolean;
  };
  userProfile?: {
    name?: string;
    username?: string;
    avatar?: string;
    bio?: string;
    company?: string;
    position?: string;
  };
}
