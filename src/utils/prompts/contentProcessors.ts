/**
 * Centralized content processing utilities
 * This file provides functions for content manipulation, formatting, and parsing
 */

import { estimateTokenCount } from '../ai/tokenUtils';
import { getPlatformConstraints } from './adapters/platformAdapter';

/**
 * Truncates content to fit within token limits,
 * prioritizing important elements
 */
export const truncateContent = (
  content: string,
  maxTokens: number = 4000
): string => {
  if (!content) return '';
  
  const estimatedTokens = estimateTokenCount(content);
  
  if (estimatedTokens <= maxTokens) {
    return content;
  }
  
  // Approximate characters to retain (adding buffer)
  const targetLength = Math.floor(maxTokens * 3.5);
  
  // If we're only slightly over, do a simple truncation
  if (estimatedTokens < maxTokens * 1.2) {
    return content.slice(0, targetLength) + '...';
  }
  
  // For more significant truncation, try to preserve structure
  // Extract title if present (assume it's at the beginning)
  const titleMatch = content.match(/^(.*?)\n/);
  const title = titleMatch ? titleMatch[1] : '';
  
  // Split content into paragraphs
  const paragraphs = content.split(/\n\n+/);
  
  // Always keep the title and first paragraph
  let result = title ? title + '\n\n' : '';
  
  if (paragraphs.length > 0) {
    result += paragraphs[0] + '\n\n';
  }
  
  // Extract hashtags if present (usually at end)
  const hashtagMatch = content.match(/(#\w+\s*)+$/);
  const hashtags = hashtagMatch ? hashtagMatch[0] : '';
  
  // Add as many additional paragraphs as will fit
  let currentLength = result.length;
  let i = 1;
  
  while (i < paragraphs.length && currentLength + paragraphs[i].length + 4 < targetLength) {
    // Skip if this paragraph is the hashtags we already extracted
    if (paragraphs[i] !== hashtags) {
      result += paragraphs[i] + '\n\n';
      currentLength += paragraphs[i].length + 4; // +4 for the newlines
    }
    i++;
  }
  
  // Add hashtags at the end if they exist and fit
  if (hashtags && currentLength + hashtags.length < targetLength) {
    result += hashtags;
  }
  
  // Add truncation indicator
  if (i < paragraphs.length) {
    result += '...';
  }
  
  return result;
};

/**
 * Find a natural breakpoint in text (sentence end, paragraph break, etc.)
 */
export const findBreakpoint = (text: string, targetLength: number): number => {
  if (text.length <= targetLength) return text.length;
  
  // Look for paragraph breaks near the target length
  const paragraphBreak = text.lastIndexOf('\n\n', targetLength);
  if (paragraphBreak > targetLength * 0.8) return paragraphBreak;
  
  // Look for line breaks
  const lineBreak = text.lastIndexOf('\n', targetLength);
  if (lineBreak > targetLength * 0.8) return lineBreak;
  
  // Look for sentence ends
  const sentenceEnd = Math.max(
    text.lastIndexOf('. ', targetLength),
    text.lastIndexOf('! ', targetLength),
    text.lastIndexOf('? ', targetLength)
  );
  if (sentenceEnd > targetLength * 0.7) return sentenceEnd + 1;
  
  // Look for other punctuation
  const punctuation = Math.max(
    text.lastIndexOf(', ', targetLength),
    text.lastIndexOf('; ', targetLength),
    text.lastIndexOf(': ', targetLength)
  );
  if (punctuation > targetLength * 0.8) return punctuation + 1;
  
  // Look for space
  const space = text.lastIndexOf(' ', targetLength);
  if (space > 0) return space;
  
  // If no good breakpoint found, just cut at target length
  return targetLength;
};

/**
 * Truncate content to fit platform character limits
 * 
 * @param content The content to truncate
 * @param platform The target platform
 * @returns Truncated content
 */
export const truncateForPlatform = (content: string, platform: string): string => {
  const constraints = getPlatformConstraints(platform);
  
  if (content.length <= constraints.maxCharacters) {
    return content;
  }
  
  // Find a good breakpoint to truncate
  const breakpointIndex = findBreakpoint(content, constraints.maxCharacters - 3);
  return content.substring(0, breakpointIndex) + '...';
};

/**
 * Parses thread content into an array of individual posts
 */
export const parseThreadContent = (content: string): string[] => {
  if (!content) return [];
  
  // If the content already follows our POST X/Y format
  if (content.includes('POST 1/')) {
    return content
      .split(/POST \d+\/\d+:/)
      .filter(Boolean)
      .map(post => post.trim());
  }
  
  // Alternative format: numbered posts with blank lines between
  if (/^\d+\/\d+\s/.test(content)) {
    return content
      .split(/\d+\/\d+\s/)
      .filter(Boolean)
      .map(post => post.trim());
  }
  
  // If the content is simply separated by blank lines or markdown separators
  return content
    .split(/\n\s*\n|\n---\n/)
    .filter(post => post.trim().length > 0)
    .map(post => post.trim());
};

/**
 * Helper function to replace template variables
 */
export const fillTemplate = (template: string, variables: Record<string, string | number | boolean>): string => {
  let result = template;
  
  // Replace each variable
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(placeholder, String(value));
  }
  
  // Clean up any remaining placeholders
  result = result.replace(/{{[^}]+}}/g, '');
  
  return result;
};

/**
 * Formats content for specific platforms
 */
export const formatContentForPlatform = (
  content: string,
  platform: string
): string => {
  // Get platform constraints
  const constraints = getPlatformConstraints(platform);
  
  // Truncate content if it exceeds platform limits
  if (content.length > constraints.maxCharacters) {
    return truncateForPlatform(content, platform);
  }
  
  return content;
};

export default {
  truncateContent,
  truncateForPlatform,
  parseThreadContent,
  fillTemplate,
  formatContentForPlatform,
  findBreakpoint
};
