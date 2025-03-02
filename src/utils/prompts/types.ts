/**
 * @deprecated This file is deprecated and will be removed in a future release.
 * Please import types from './types/index.ts' instead.
 * This file is maintained only for backward compatibility.
 *
 * Legacy type system for the prompt management system
 */

import { UserPreferences } from '@/types/preferences';

// Basic tone options available across content types
export type ToneType = 'professional' | 'casual' | 'inspirational' | 'humorous' | 'analytical' | 'conversational';

// Basic content length options
export type ContentLength = 'short' | 'medium' | 'long';

/**
 * Common base for all prompt parameters
 */
export interface BasePromptParams {
  // Core content parameters (required)
  topic: string;
  targetAudience: string;
  
  // Optional stylistic parameters
  tone?: ToneType;
  writingStyle?: string;
  additionalGuidelines?: string;
  
  // Optional AI model parameters
  model?: string;
  temperature?: number;
  maxTokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

/**
 * Social media specific parameters
 */
export interface SocialMediaParams extends BasePromptParams {
  platform?: 'twitter' | 'x' | 'linkedin' | 'facebook' | 'instagram' | 'threads';
  includeHashtags?: boolean;
  includeEmojis?: boolean;
  callToAction?: string;
}

/**
 * Alias for SocialMediaParams for consistency with builder naming
 */
export type SocialParams = SocialMediaParams;

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
}

/**
 * Thread specific parameters
 */
export interface ThreadParams extends SocialMediaParams {
  threadCount?: number;
  threadStyle?: 'educational' | 'storytelling' | 'listicle';
  maxLengthPerPost?: number;
}

/**
 * Poll specific parameters
 */
export interface PollParams extends SocialMediaParams {
  optionCount?: 2 | 3 | 4;
  pollDuration?: '1day' | '3days' | '7days';
}

/**
 * Image generation specific parameters
 */
export interface ImageParams extends BasePromptParams {
  /** Style of the image (e.g., 'realistic', 'artistic', 'minimalist') */
  style?: string;
  
  /** Mood or atmosphere of the image (e.g., 'professional', 'cheerful', 'serious') */
  mood?: string;
  
  /** Specific visual elements to include in the image */
  visualElements?: string[];
  
  /** Aspect ratio for the generated image */
  aspectRatio?: '1:1' | '16:9' | '4:3' | '9:16';
  
  /** Image generation model to use */
  model?: 'dall-e-2' | 'dall-e-3';
  
  /** Quality setting for the generated image */
  quality?: 'standard' | 'hd';
}

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
  provider: 'openai' | 'anthropic' | 'other';
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
