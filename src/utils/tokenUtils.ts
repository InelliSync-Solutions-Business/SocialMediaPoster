import { encodingForModel, TiktokenModel } from 'js-tiktoken';

const DEFAULT_ENCODING: TiktokenModel = 'gpt-4o-mini';

/**
 * Count the number of tokens in a given text using OpenAI's tiktoken encoding
 * @param text The input text to count tokens for
 * @param encoding The encoding model to use (default: gpt-4o-mini)
 * @returns Number of tokens in the text
 */
export const countTokens = (text: string, encoding: TiktokenModel = DEFAULT_ENCODING): number => {
  try {
    const encoder = encodingForModel(encoding);
    const tokens = encoder.encode(text);
    return tokens.length;
  } catch (error) {
    console.error('Error counting tokens:', error);
    return 0;
  }
};

/**
 * Truncate text to a specified maximum token count
 * @param text The input text to truncate
 * @param maxTokens Maximum number of tokens allowed
 * @param encoding The encoding model to use (default: gpt-4o-mini)
 * @returns Truncated text
 */
export const truncateToMaxTokens = (text: string, maxTokens: number, encoding: TiktokenModel = DEFAULT_ENCODING): string => {
  try {
    const encoder = encodingForModel(encoding);
    const tokens = encoder.encode(text);
    
    if (tokens.length <= maxTokens) {
      return text;
    }
    
    const truncatedTokens = tokens.slice(0, maxTokens);
    return encoder.decode(truncatedTokens);
  } catch (error) {
    console.error('Error truncating tokens:', error);
    return text; // Return original text if truncation fails
  }
};

// Social media platform character limits (approximate token equivalents)
type PlatformTokenLimits = {
  twitter: number;
  linkedin: number;
  facebook: number;
  default: number;
  [key: string]: number;
};

export const PLATFORM_TOKEN_LIMITS: PlatformTokenLimits = {
  'twitter': 140,   // Twitter's character limit
  'linkedin': 3000, // LinkedIn's post character limit
  'facebook': 2000, // Facebook's post character limit
  'default': 500    // A reasonable default
};

/**
 * Get token limit for a specific platform
 * @param platform Social media platform name
 * @returns Maximum number of tokens for the platform
 */
export const getPlatformTokenLimit = (platform: string): number => {
  // Convert platform to lowercase to handle case variations
  const normalizedPlatform = platform.toLowerCase();
  
  // Return platform-specific limit or default
  return PLATFORM_TOKEN_LIMITS[normalizedPlatform] || PLATFORM_TOKEN_LIMITS['default'];
};
