import { encodingForModel, TiktokenModel } from 'js-tiktoken';

const DEFAULT_ENCODING: TiktokenModel = 'gpt-4o-mini';

/**
 * Count the number of tokens in a given text using OpenAI's tiktoken encoding
 * @param text The input text to count tokens for
 * @param encoding The encoding model to use (default: gpt-40-mini)
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
 * @param encoding The encoding model to use (default: gpt-3.5-turbo)
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
