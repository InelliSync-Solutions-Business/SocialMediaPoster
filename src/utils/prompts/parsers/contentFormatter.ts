/**
 * Formatter for adapting content to different platforms
 */

/**
 * Format content for a specific platform
 * 
 * @param content The content to format
 * @param platform The target platform
 * @returns Formatted content
 */
export function formatContentForPlatform(
  content: string,
  platform: string
): string {
  const platformLower = (platform || '').toLowerCase();
  
  switch (platformLower) {
    case 'twitter':
    case 'x':
      return formatForTwitter(content);
    case 'linkedin':
      return formatForLinkedIn(content);
    case 'facebook':
      return formatForFacebook(content);
    case 'instagram':
      return formatForInstagram(content);
    default:
      return content;
  }
}

/**
 * Format content for Twitter/X
 */
function formatForTwitter(content: string): string {
  // Limit to 280 characters
  if (content.length <= 280) return content;
  
  // Try to find a good breakpoint
  const breakpoint = findBreakpoint(content, 270);
  return content.substring(0, breakpoint) + '...';
}

/**
 * Format content for LinkedIn
 */
function formatForLinkedIn(content: string): string {
  // LinkedIn post limit is around 3000 characters
  if (content.length <= 3000) return content;
  
  // Try to find a good breakpoint
  const breakpoint = findBreakpoint(content, 2980);
  return content.substring(0, breakpoint) + '... (continued in comments)';
}

/**
 * Format content for Facebook
 */
function formatForFacebook(content: string): string {
  // Facebook post limit is around 63,206 characters
  // Usually no truncation needed, but ensure good formatting
  return content;
}

/**
 * Format content for Instagram
 */
function formatForInstagram(content: string): string {
  // Instagram caption limit is 2,200 characters
  if (content.length <= 2200) return content;
  
  // Try to find a good breakpoint
  const breakpoint = findBreakpoint(content, 2180);
  return content.substring(0, breakpoint) + '...';
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
 * Format text with links
 * 
 * @param text The text to format
 * @returns Text with properly formatted links
 */
export function formatTextWithLinks(text: string): string {
  // Convert URLs to clickable links
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
}

/**
 * Format hashtags
 * 
 * @param text The text to format
 * @returns Text with properly formatted hashtags
 */
export function formatHashtags(text: string): string {
  // Make hashtags clickable/highlighted
  const hashtagRegex = /(^|\s)(#[a-zA-Z0-9_]+)(\s|$)/g;
  return text.replace(hashtagRegex, '$1<span class="hashtag">$2</span>$3');
}

export default {
  formatContentForPlatform,
  formatTextWithLinks,
  formatHashtags
};
