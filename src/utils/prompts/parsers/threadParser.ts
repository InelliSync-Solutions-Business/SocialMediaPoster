/**
 * Parser for thread content
 */

/**
 * Parses a thread from AI-generated content
 * 
 * @param content The AI-generated content to parse
 * @returns Array of thread posts
 */
export function parseThreadContent(content: string): string[] {
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
}

/**
 * Validates and trims thread posts to fit platform constraints
 * 
 * @param posts Array of thread posts
 * @param minChars Minimum characters per post
 * @param maxChars Maximum characters per post
 * @returns Validated and trimmed posts
 */
export function validateAndTrimThreadPosts(
  posts: string[],
  minChars = 20,
  maxChars = 280
): string[] {
  return posts
    .filter(post => post.length >= minChars)
    .map(post => {
      // Keep posts under the character limit
      if (post.length > maxChars) {
        // Try to trim at sentence boundary
        const sentences = post.match(/[^.!?]+[.!?]+/g) || [];
        let trimmedPost = '';
        
        for (const sentence of sentences) {
          if ((trimmedPost + sentence).length <= maxChars) {
            trimmedPost += sentence;
          } else {
            break;
          }
        }
        
        // If no complete sentence fits, just truncate
        if (!trimmedPost) {
          trimmedPost = post.substring(0, maxChars - 3) + '...';
        }
        
        return trimmedPost;
      }
      
      return post;
    });
}

export default {
  parseThreadContent,
  validateAndTrimThreadPosts
};
