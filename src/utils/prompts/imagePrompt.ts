import { UserPreferences } from '@/types/preferences';

export interface ImagePromptParams {
  content: string;
  style?: 'realistic' | 'artistic' | 'minimalist' | 'professional';
  format?: 'social-media' | 'banner' | 'profile';
  platform?: 'twitter' | 'linkedin' | 'facebook' | 'instagram';
}

export const generateImagePrompt = (
  params: ImagePromptParams,
  preferences?: UserPreferences
) => `Create an image that visually represents the following social media content: ${params.content}
${params.style ? `\nStyle: ${params.style}` : ''}
${params.format ? `\nFormat: Optimize for ${params.format}` : ''}
${params.platform ? `\nPlatform: Optimize for ${params.platform}` : ''}`;
