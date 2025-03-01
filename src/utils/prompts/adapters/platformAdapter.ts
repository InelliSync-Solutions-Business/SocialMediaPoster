/**
 * Adapter for platform-specific content adjustments
 */

// Platform limitations and constraints
export const PLATFORM_CONSTRAINTS = {
  twitter: {
    maxCharacters: 280,
    maxMedia: 4,
    maxHashtags: 5,
    recommendedHashtags: 2,
    supportsFormatting: false,
    supportsThreads: true,
    supportsPoll: true
  },
  x: {
    maxCharacters: 280,
    maxMedia: 4,
    maxHashtags: 5,
    recommendedHashtags: 2,
    supportsFormatting: false,
    supportsThreads: true,
    supportsPoll: true
  },
  linkedin: {
    maxCharacters: 3000,
    maxMedia: 20,
    maxHashtags: 10,
    recommendedHashtags: 3,
    supportsFormatting: true,
    supportsThreads: false,
    supportsPoll: true
  },
  facebook: {
    maxCharacters: 63206,
    maxMedia: 10,
    maxHashtags: 30,
    recommendedHashtags: 2,
    supportsFormatting: true,
    supportsThreads: false,
    supportsPoll: true
  },
  instagram: {
    maxCharacters: 2200,
    maxMedia: 10,
    maxHashtags: 30,
    recommendedHashtags: 10,
    supportsFormatting: false,
    supportsThreads: false,
    supportsPoll: true
  },
  medium: {
    maxCharacters: 100000,
    maxMedia: 100,
    maxHashtags: 5,
    recommendedHashtags: 3,
    supportsFormatting: true,
    supportsThreads: false,
    supportsPoll: false
  },
  substack: {
    maxCharacters: 500000,
    maxMedia: 100,
    maxHashtags: 0,
    recommendedHashtags: 0,
    supportsFormatting: true,
    supportsThreads: false,
    supportsPoll: false
  }
};

// Default constraint values for unsupported platforms
const DEFAULT_CONSTRAINTS = {
  maxCharacters: 1000,
  maxMedia: 4,
  maxHashtags: 5,
  recommendedHashtags: 3,
  supportsFormatting: true,
  supportsThreads: false,
  supportsPoll: false
};

/**
 * Get constraints for a specific platform
 * 
 * @param platform The platform name
 * @returns Platform constraints
 */
export function getPlatformConstraints(platform: string) {
  const platformLower = (platform || '').toLowerCase();
  return PLATFORM_CONSTRAINTS[platformLower as keyof typeof PLATFORM_CONSTRAINTS] || DEFAULT_CONSTRAINTS;
}

/**
 * Check if content exceeds platform character limits
 * 
 * @param content The content to check
 * @param platform The target platform
 * @returns Whether the content exceeds the limit
 */
export function exceedsCharacterLimit(content: string, platform: string): boolean {
  const constraints = getPlatformConstraints(platform);
  return content.length > constraints.maxCharacters;
}

/**
 * Truncate content to fit platform character limits
 * 
 * @param content The content to truncate
 * @param platform The target platform
 * @returns Truncated content
 */
export function truncateForPlatform(content: string, platform: string): string {
  const constraints = getPlatformConstraints(platform);
  
  if (content.length <= constraints.maxCharacters) {
    return content;
  }
  
  // Find a good breakpoint to truncate
  const breakpointIndex = findBreakpoint(content, constraints.maxCharacters - 3);
  return content.substring(0, breakpointIndex) + '...';
}

/**
 * Find a natural breakpoint in text (sentence end, paragraph break, etc.)
 */
function findBreakpoint(text: string, targetLength: number): number {
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
}

/**
 * Format hashtags for a specific platform
 * 
 * @param hashtags Array of hashtag strings (without # symbol)
 * @param platform The target platform
 * @returns Formatted hashtag string
 */
export function formatHashtags(hashtags: string[], platform: string): string {
  if (!hashtags || hashtags.length === 0) return '';
  
  const constraints = getPlatformConstraints(platform);
  const platformLower = (platform || '').toLowerCase();
  
  // Limit number of hashtags based on platform
  const limitedHashtags = hashtags.slice(0, constraints.maxHashtags);
  
  // Format based on platform
  switch (platformLower) {
    case 'twitter':
    case 'x':
    case 'instagram':
      // Space-separated hashtags with # symbol
      return limitedHashtags
        .map(tag => `#${tag.replace(/\s+/g, '')}`)
        .join(' ');
      
    case 'linkedin':
      // Space-separated hashtags with # symbol, preferably at the end
      return '\n\n' + limitedHashtags
        .map(tag => `#${tag.replace(/\s+/g, '')}`)
        .join(' ');
      
    case 'facebook':
      // Space-separated hashtags with # symbol
      return limitedHashtags
        .map(tag => `#${tag.replace(/\s+/g, '')}`)
        .join(' ');
      
    default:
      // Generic format
      return limitedHashtags
        .map(tag => `#${tag.replace(/\s+/g, '')}`)
        .join(' ');
  }
}

/**
 * Check if a feature is supported by the platform
 * 
 * @param feature The feature to check ('threads', 'poll', 'formatting')
 * @param platform The target platform
 * @returns Whether the feature is supported
 */
export function supportsFeature(feature: string, platform: string): boolean {
  const constraints = getPlatformConstraints(platform);
  const featureLower = feature.toLowerCase();
  
  switch (featureLower) {
    case 'threads':
      return constraints.supportsThreads;
    case 'poll':
      return constraints.supportsPoll;
    case 'formatting':
      return constraints.supportsFormatting;
    default:
      return false;
  }
}

export default {
  PLATFORM_CONSTRAINTS,
  getPlatformConstraints,
  exceedsCharacterLimit,
  truncateForPlatform,
  formatHashtags,
  supportsFeature
};
