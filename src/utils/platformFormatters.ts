/**
 * Platform-specific content formatters
 * These functions optimize content for different social media platforms
 */

import { PlatformFormats } from '../types/preferences';
import { PlatformKey } from '../types/platforms';

/**
 * Format content for Twitter
 * - Trims content to 280 characters
 * - Hashtag optimization
 * - Thread formatting
 */
export const formatTwitterContent = (
  content: string, 
  preferences?: PlatformFormats,
  threadMode = false
): string => {
  if (!content) return '';
  
  let formattedContent = content;
  
  // Apply character limit for non-thread content
  if (!threadMode && formattedContent.length > 280) {
    formattedContent = formattedContent.substring(0, 277) + '...';
  }
  
  // Add hashtags to improve discoverability if enabled in preferences
  if (preferences?.twitter.hashtagSuggestions) {
    // Extract potential hashtags from content
    const words = content.split(/\s+/);
    const potentialTags = words
      .filter(word => word.length > 5 && !word.includes('#'))
      .slice(0, 3)
      .map(word => `#${word.replace(/[^a-zA-Z0-9]/g, '')}`);
    
    if (potentialTags.length > 0) {
      formattedContent = formattedContent.trim() + '\n\n' + potentialTags.join(' ');
    }
  }
  
  return formattedContent;
};

/**
 * Format content for LinkedIn
 * - Professional tone
 * - Line spacing for readability
 * - Paragraph structure
 */
export const formatLinkedInContent = (
  content: string, 
  preferences?: PlatformFormats
): string => {
  if (!content) return '';
  
  let formattedContent = content;
  
  // Apply professional formatting if enabled
  if (preferences?.linkedin.professionalTone) {
    // Improve paragraph spacing
    formattedContent = formattedContent
      .split('\n\n')
      .filter(para => para.trim().length > 0)
      .join('\n\n');
      
    // Ensure proper line breaks between paragraphs
    if (!formattedContent.includes('\n\n') && formattedContent.length > 150) {
      // Split into paragraphs if it's a large block of text
      const sentences = formattedContent.match(/[^.!?]+[.!?]+/g) || [];
      if (sentences.length > 3) {
        const midPoint = Math.floor(sentences.length / 2);
        const firstHalf = sentences.slice(0, midPoint).join(' ');
        const secondHalf = sentences.slice(midPoint).join(' ');
        formattedContent = `${firstHalf}\n\n${secondHalf}`;
      }
    }
  }
  
  return formattedContent;
};

/**
 * Format content for Instagram
 * - Emoji enhancement
 * - Line breaks for readability
 * - Hashtag optimization
 */
export const formatInstagramContent = (
  content: string, 
  preferences?: PlatformFormats
): string => {
  if (!content) return '';
  
  let formattedContent = content;
  
  // Max display length for Instagram captions is around 125 chars (before "...more")
  const displayPreview = formattedContent.length > 125 
    ? formattedContent.substring(0, 125) + '...'
    : formattedContent;
    
  // Add popular hashtags if enabled
  if (preferences?.instagram.hashtagSuggestions) {
    const popularHashtags = [
      '#content', '#social', '#digital', '#marketing', 
      '#socialmedia', '#strategy', '#business'
    ];
    
    // Select random 5 hashtags
    const selectedTags = [...popularHashtags]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5)
      .join(' ');
      
    formattedContent = formattedContent.trim() + '\n\n' + selectedTags;
  }
  
  return formattedContent;
};

/**
 * Format content for Facebook
 * - Emoji enhancement
 * - URL previews
 */
export const formatFacebookContent = (
  content: string, 
  preferences?: PlatformFormats
): string => {
  if (!content) return '';
  
  // Facebook doesn't need much special formatting
  let formattedContent = content;
  
  // Add emoji if tone is casual
  if (preferences?.facebook.templateCustomization && !formattedContent.match(/[\u{1F300}-\u{1F6FF}]/u)) {
    const casualEmojis = ['😊', '👍', '🙌', '✨', '🔥'];
    const randomEmoji = casualEmojis[Math.floor(Math.random() * casualEmojis.length)];
    formattedContent = formattedContent.trim() + ' ' + randomEmoji;
  }
  
  return formattedContent;
};

/**
 * Format content for Newsletter
 * - HTML formatting
 * - Section headers
 * - Call to action
 */
export const formatNewsletterContent = (
  content: string, 
  preferences?: PlatformFormats
): string => {
  if (!content) return '';
  
  // Replace single newlines with <br> for HTML rendering
  let formattedContent = content.replace(/\n/g, '<br>');
  
  // Add a call-to-action button if newsletter customization is enabled
  if (preferences?.newsletter.templateCustomization) {
    formattedContent += `
      <br><br>
      <div style="text-align: center; margin-top: 20px;">
        <a href="#" style="background-color: #4a90e2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Subscribe to Our Newsletter
        </a>
      </div>
    `;
  }
  
  return formattedContent;
};

/**
 * Format content for the selected platform
 */
export const formatContentForPlatform = (
  content: string, 
  platform: PlatformKey, 
  preferences?: PlatformFormats,
  threadMode = false
): string => {
  if (!content) return '';
  
  switch (platform) {
    case 'twitter':
      return formatTwitterContent(content, preferences, threadMode);
    case 'linkedin':
      return formatLinkedInContent(content, preferences);
    case 'instagram':
      return formatInstagramContent(content, preferences);
    case 'facebook':
      return formatFacebookContent(content, preferences);
    case 'newsletter':
      return formatNewsletterContent(content, preferences);
    default:
      return content;
  }
};

/**
 * Generate placeholder hashtags for Instagram
 */
export const generatePlaceholderHashtags = (): string[] => {
  const hashtagSets = [
    ['#content', '#strategy', '#digital', '#marketing', '#business'],
    ['#socialmedia', '#contentcreator', '#digitalmarketing', '#growth', '#engagement'],
    ['#business', '#entrepreneur', '#success', '#productivity', '#growth']
  ];
  
  return hashtagSets[Math.floor(Math.random() * hashtagSets.length)];
};

/**
 * Extract hashtags from content
 */
export const extractHashtags = (content: string): string[] => {
  const hashtagRegex = /#(\w+)/g;
  const matches = content.match(hashtagRegex);
  return matches ? matches : [];
};

/**
 * Get character limit for platform
 */
export const getPlatformCharacterLimit = (platform: PlatformKey): number => {
  switch (platform) {
    case 'twitter':
      return 280;
    case 'instagram':
      return 2200;
    case 'linkedin':
      return 3000;
    case 'facebook':
      return 63206;
    case 'newsletter':
      return 10000;
    default:
      return 500;
  }
};
