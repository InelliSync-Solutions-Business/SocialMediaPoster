/**
 * Centralized prompt system exports
 * This file serves as the main entry point for the prompt system
 */

// === New Prompt System Exports ===

// Type system exports
export * from './types/index';

// Template exports
export * from './templates';

// Builder exports
export * from './builders';

// Parser exports
export * from './parsers';

// Adapter exports
export * from './adapters';

// Utility exports - now from centralized modules
export * from '../ai/tokenUtils';
export * from './contentProcessors';
export * from './styleMapper';

// === Factory Functions ===

/**
 * Factory function to get the appropriate prompt builder for a content type
 * 
 * @param contentType The type of content to build a prompt for
 * @returns The appropriate prompt builder
 */
export function getPromptBuilder(contentType: string) {
  return require('./builders').getPromptBuilder(contentType);
}

/**
 * Factory function to get the appropriate parser for a content type
 * 
 * @param contentType The type of content to parse
 * @returns The appropriate content parser
 */
export function getParser(contentType: string) {
  const parsers = require('./parsers').default;
  
  switch (contentType.toLowerCase()) {
    case 'newsletter':
      return parsers.newsletter;
    case 'thread':
      return parsers.thread;
    case 'poll':
      return parsers.poll;
    case 'image':
      return parsers.image;
    default:
      return null;
  }
}

// === Legacy Compatibility Layer ===
// These exports maintain backward compatibility with existing code

import { estimateTokenCount, estimateTokenCost } from '../ai/tokenUtils';
import { truncateContent, parseThreadContent } from './contentProcessors';
import { formatContentForPlatform } from './contentProcessors';

// Export legacy functions to maintain compatibility
export { 
  estimateTokenCount,
  estimateTokenCost,
  truncateContent,
  parseThreadContent,
  formatContentForPlatform
};

// Legacy prompt generators (redirected to new system)
export const generateNewsletterPrompt = (params: any, preferences?: any) => 
  getPromptBuilder('newsletter').buildPrompt(params, preferences);

export const generateSocialPostPrompt = (params: any, preferences?: any) =>
  getPromptBuilder('social').buildPrompt(params, preferences);

export const generateThreadPrompt = (params: any, preferences?: any) =>
  getPromptBuilder('thread').buildPrompt(params, preferences);

export const generatePollPrompt = (params: any, preferences?: any) =>
  getPromptBuilder('poll').buildPrompt(params, preferences);

export const generateImagePrompt = (params: any, preferences?: any) =>
  getPromptBuilder('image').buildPrompt(params, preferences);

/**
 * Unified prompt manager that provides a single interface for all prompt types
 */
export const promptManager = {
  // Newsletter generation
  buildNewsletterPrompt: (params: any, preferences?: any) => 
    getPromptBuilder('newsletter').buildPrompt(params, preferences),
  
  // Social post generation
  buildSocialPostPrompt: (params: any, preferences?: any) => 
    getPromptBuilder('social').buildPrompt(params, preferences),
  
  // Thread generation
  buildThreadPrompt: (params: any, preferences?: any) => 
    getPromptBuilder('thread').buildPrompt(params, preferences),
  
  // Poll generation
  buildPollPrompt: (params: any, preferences?: any) => 
    getPromptBuilder('poll').buildPrompt(params, preferences),
  
  // Image prompt generation
  buildImagePrompt: (params: any, preferences?: any) => 
    getPromptBuilder('image').buildPrompt(params, preferences),
  
  // Utility functions
  estimateTokens: (text: string) => estimateTokenCount(text),
  estimateCost: (usage: any, model: string) => estimateTokenCost(usage, model),
  parseThreadContent: (content: string) => parseThreadContent(content),
  formatContent: (content: string, platform: string, contentType?: string) => 
    formatContentForPlatform(content, platform)
};
