/**
 * Unified Type System for Prompt Management
 * 
 * This file serves as the single source of truth for all types used in the prompt system.
 * It consolidates previously duplicated types from promptTypes.ts and types.ts.
 */

import { UserPreferences } from '@/types/preferences';

// ===== Core Types =====

/**
 * Basic tone options available across content types
 */
export type ToneType = 
  | 'professional' 
  | 'casual' 
  | 'inspirational' 
  | 'humorous' 
  | 'analytical' 
  | 'conversational'
  | 'technical'
  | 'engaging'
  | 'authoritative'
  | 'storytelling'
  | 'persuasive'
  | 'insightful'
  | 'visionary'
  | 'educational'
  | 'empathetic'
  | 'controversial';

/**
 * Basic content length options
 */
export type ContentLength = 'short' | 'medium' | 'long';

/**
 * Social media platform types
 */
export type PlatformType = 
  | 'twitter' 
  | 'x' 
  | 'linkedin' 
  | 'facebook' 
  | 'instagram' 
  | 'threads';

/**
 * Thread style options
 */
export type ThreadStyleType = 'educational' | 'storytelling' | 'listicle';

/**
 * Poll duration options
 */
export type PollDurationType = '1day' | '3days' | '7days';

/**
 * Image aspect ratio options
 */
export type AspectRatioType = '1:1' | '16:9' | '4:3' | '9:16';

/**
 * Image model options
 */
export type ImageModelType = 'dall-e-2' | 'dall-e-3' | 'stable-diffusion';

/**
 * Image quality options
 */
export type ImageQualityType = 'standard' | 'hd';

/**
 * AI model provider options
 */
export type ModelProviderType = 'openai' | 'anthropic' | 'other';

// ===== Parameter Interfaces =====

/**
 * Common base interface for all prompt parameters
 */
export interface BasePromptParams {
  // Core content parameters (required)
  topic: string;
  audience: string;
  
  // Optional stylistic parameters
  tone?: ToneType;
  writingStyle?: string;
  guidelines?: string;
  
  // Optional AI model parameters
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Social media specific parameters
 */
export interface SocialMediaParams extends BasePromptParams {
  platform: PlatformType;
  includeHashtags?: boolean;
  includeEmojis?: boolean;
  callToAction?: string;
}

/**
 * Newsletter specific parameters
 */
export interface NewsletterParams extends BasePromptParams {
  newsletterType: string;
  length: ContentLength;
  sections?: string[];
  includeHeadlines?: boolean;
  includeSummary?: boolean;
  includeCta?: boolean;
  formatType?: 'markdown' | 'html';
}

/**
 * Thread specific parameters
 */
export interface ThreadParams extends SocialMediaParams {
  threadCount?: number;
  threadStyle?: ThreadStyleType;
  maxLengthPerPost?: number;
}

/**
 * Poll specific parameters
 */
export interface PollParams extends SocialMediaParams {
  optionCount?: 2 | 3 | 4;
  pollDuration?: PollDurationType;
}

/**
 * Image generation specific parameters
 */
export interface ImageParams extends BasePromptParams {
  style?: string;
  mood?: string;
  visualElements?: string[];
  aspectRatio?: AspectRatioType;
  model?: ImageModelType;
  quality?: ImageQualityType;
}

/**
 * Long-form content parameters
 */
export interface LongFormParams extends BasePromptParams {
  length: ContentLength;
  includeHeadings?: boolean;
  includeConclusion?: boolean;
  includeSources?: boolean;
}

/**
 * Short-form content parameters
 */
export interface ShortFormParams extends SocialMediaParams {
  maxLength?: number;
}

// ===== Response Interfaces =====

/**
 * Standard response format for all prompt generators
 */
export interface PromptResponse {
  prompt: string;
  systemPrompt?: string;
  estimatedTokens: number;
  model: string;
  temperature?: number;
}

/**
 * Token usage tracking
 */
export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number;
}

/**
 * AI Model configuration
 */
export interface ModelConfig {
  name: string;
  displayName: string;
  provider: ModelProviderType;
  maxTokens: number;
  costPerInputToken: number;
  costPerOutputToken: number;
  supportsStreaming: boolean;
  supportsImages: boolean;
  defaultForContentType?: string;
}

/**
 * AI response with token usage information
 */
export interface AIResponse<T = string> {
  content: T;
  usage: TokenUsage;
  model: string;
}

/**
 * Error response from prompt system
 */
export interface PromptError {
  message: string;
  code: string;
  details?: unknown;
}

// ===== Parser Types =====

/**
 * Thread post structure
 */
export interface ThreadPost {
  content: string;
  characterCount: number;
  index?: number;
}

/**
 * Parsed thread content
 */
export interface ParsedThreadContent {
  posts: ThreadPost[];
  totalCharacterCount: number;
  averageCharacterCount: number;
}

/**
 * Newsletter section structure
 */
export interface NewsletterSection {
  title: string;
  content: string;
  type: 'introduction' | 'body' | 'conclusion' | 'cta';
}

/**
 * Parsed newsletter content
 */
export interface ParsedNewsletterContent {
  title: string;
  sections: NewsletterSection[];
  wordCount: number;
}

/**
 * Poll option structure
 */
export interface PollOption {
  text: string;
  characterCount: number;
}

/**
 * Parsed poll content
 */
export interface ParsedPollContent {
  question: string;
  options: PollOption[];
  context?: string;
}

/**
 * Image prompt structure
 */
export interface ParsedImagePrompt {
  subject: string;
  style: string;
  mood: string;
  details: string;
  fullPrompt: string;
}

// ===== Legacy Type Aliases =====
// These are provided for backward compatibility

/**
 * @deprecated Use BasePromptParams instead
 */
export type LegacyBasePromptParams = BasePromptParams;

/**
 * @deprecated Use SocialMediaParams instead
 */
export type SocialPostPromptParams = SocialMediaParams;

/**
 * @deprecated Use NewsletterParams instead
 */
export type NewsletterPromptParams = NewsletterParams;

/**
 * @deprecated Use ThreadParams instead
 */
export type ThreadPromptParams = ThreadParams;

/**
 * @deprecated Use PollParams instead
 */
export type PollPromptParams = PollParams;

/**
 * @deprecated Use ImageParams instead
 */
export type ImagePromptParams = ImageParams;

/**
 * @deprecated Use LongFormParams instead
 */
export type LongFormPromptParams = LongFormParams;

/**
 * @deprecated Use ShortFormParams instead
 */
export type ShortFormPromptParams = ShortFormParams;
