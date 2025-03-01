/**
 * @deprecated This file is deprecated and will be removed in a future release.
 * Please import types from './types/index.ts' instead.
 * This file is maintained only for backward compatibility.
 */

import { UserPreferences } from '@/types/preferences';

/**
 * @deprecated Use BasePromptParams from './types/index.ts' instead
 * Base parameters for all prompt types
 */
export interface BasePromptParams {
  // Core content parameters
  topic: string;
  audience: string;
  
  // Optional parameters
  guidelines?: string;
  tone?: 'professional' | 'casual' | 'inspirational' | 'humorous';
  
  // Model parameters
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * Parameters for social media post prompts
 */
export interface SocialPostPromptParams extends BasePromptParams {
  platform: 'twitter' | 'linkedin' | 'facebook' | 'instagram';
  contentType?: 'post' | 'thread' | 'poll';
  includeHashtags?: boolean;
  includeEmojis?: boolean;
  callToAction?: string;
}

/**
 * Parameters for newsletter prompts
 */
export interface NewsletterPromptParams extends BasePromptParams {
  sections?: string[];
  includeIntroduction?: boolean;
  includeConclusion?: boolean;
  formatType?: 'markdown' | 'html';
  length?: 'short' | 'medium' | 'long';
}

/**
 * Parameters for thread prompts
 */
export interface ThreadPromptParams extends SocialPostPromptParams {
  threadCount?: number;
  threadStyle?: 'educational' | 'storytelling' | 'listicle';
}

/**
 * Parameters for poll prompts
 */
export interface PollPromptParams extends SocialPostPromptParams {
  optionCount?: 2 | 3 | 4;
  duration?: '1day' | '3days' | '7days';
}

/**
 * Parameters for image prompts
 */
export interface ImagePromptParams extends BasePromptParams {
  style?: string;
  mood?: string;
  visualElements?: string[];
  aspectRatio?: '1:1' | '16:9' | '4:3' | '9:16';
}

/**
 * Response format for all prompt generators
 */
export interface PromptResponse {
  prompt: string;
  estimatedTokens: number;
  model: string;
  systemPrompt?: string;
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
