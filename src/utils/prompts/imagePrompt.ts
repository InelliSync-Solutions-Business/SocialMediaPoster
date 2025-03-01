import { UserPreferences } from '@/types/preferences';

export interface ImagePromptParams {
  content: string;
  style?: 'realistic' | 'artistic' | 'minimalist' | 'professional';
  format?: 'social-media' | 'banner' | 'profile';
  platform?: 'twitter' | 'linkedin' | 'facebook' | 'instagram';
}

// Helper function to truncate content to a reasonable length for image generation
export const truncateContent = (content: string, maxLength: number = 500): string => {
  if (!content) return '';
  
  // If content is already within limits, return it as is
  if (content.length <= maxLength) return content;
  
  // Extract title/headline if it exists (usually in markdown format with # or ** markers)
  let title = '';
  const titleMatch = content.match(/^(#+\s+.*?|\*\*.*?\*\*)$/m);
  if (titleMatch) {
    title = titleMatch[0];
  }
  
  // Extract hashtags if they exist
  let hashtags = '';
  const hashtagMatch = content.match(/(#\w+\s*)+$/m);
  if (hashtagMatch) {
    hashtags = hashtagMatch[0];
  }
  
  // Calculate how much space we have left for the main content
  const reservedLength = title.length + hashtags.length + 20; // 20 chars buffer
  const mainContentLength = maxLength - reservedLength;
  
  // Extract the first few sentences of the main content
  let mainContent = '';
  const contentWithoutTitleAndHashtags = content
    .replace(title, '')
    .replace(hashtags, '')
    .trim();
  
  // Take the first paragraph or first few sentences
  const firstParagraph = contentWithoutTitleAndHashtags.split('\n\n')[0];
  if (firstParagraph.length <= mainContentLength) {
    mainContent = firstParagraph;
  } else {
    // Take just enough sentences to fit within the limit
    const sentences = firstParagraph.match(/[^.!?]+[.!?]+/g) || [];
    for (const sentence of sentences) {
      if ((mainContent + sentence).length <= mainContentLength) {
        mainContent += sentence;
      } else {
        break;
      }
    }
  }
  
  // Combine the parts with appropriate spacing
  let result = '';
  if (title) result += title + '\n\n';
  if (mainContent) result += mainContent + '\n\n';
  if (hashtags) result += hashtags;
  
  return result.trim();
};

export const generateImagePrompt = (
  params: ImagePromptParams,
  preferences?: UserPreferences
) => {
  // Truncate content to ensure it fits within OpenAI's limits
  const truncatedContent = truncateContent(params.content, 500);
  
  return `Create an image that visually represents the following social media content: ${truncatedContent}
${params.style ? `\nStyle: ${params.style}` : ''}
${params.format ? `\nFormat: Optimize for ${params.format}` : ''}
${params.platform ? `\nPlatform: Optimize for ${params.platform}` : ''}`;
};
