/**
 * Platform Constants
 * 
 * This file centralizes all platform-specific constants that were previously
 * duplicated across multiple files.
 */

import { PlatformType } from './index';

/**
 * Character limits for different platforms
 */
export const PLATFORM_CHARACTER_LIMITS: Record<PlatformType, number> = {
  twitter: 280,
  x: 280,
  linkedin: 3000,
  facebook: 63206,
  instagram: 2200,
  threads: 500
};

/**
 * Maximum number of hashtags recommended per platform
 */
export const PLATFORM_HASHTAG_LIMITS: Record<PlatformType, number> = {
  twitter: 3,
  x: 3,
  linkedin: 5,
  facebook: 5,
  instagram: 30,
  threads: 10
};

/**
 * Maximum number of posts in a thread per platform
 */
export const PLATFORM_THREAD_LIMITS: Record<PlatformType, number> = {
  twitter: 25,
  x: 25,
  linkedin: 1, // LinkedIn doesn't support native threads
  facebook: 1, // Facebook doesn't support native threads
  instagram: 1, // Instagram doesn't support native threads
  threads: 10
};

/**
 * Maximum number of poll options per platform
 */
export const PLATFORM_POLL_OPTION_LIMITS: Record<PlatformType, number> = {
  twitter: 4,
  x: 4,
  linkedin: 4,
  facebook: 0, // Facebook doesn't support native polls
  instagram: 0, // Instagram doesn't support native polls
  threads: 0  // Threads doesn't support native polls
};

/**
 * Character limits for poll options per platform
 */
export const PLATFORM_POLL_OPTION_CHARACTER_LIMITS: Record<PlatformType, number> = {
  twitter: 25,
  x: 25,
  linkedin: 30,
  facebook: 0,
  instagram: 0,
  threads: 0
};

/**
 * Maximum number of images per post per platform
 */
export const PLATFORM_IMAGE_LIMITS: Record<PlatformType, number> = {
  twitter: 4,
  x: 4,
  linkedin: 9,
  facebook: 10,
  instagram: 10,
  threads: 10
};

/**
 * Supported aspect ratios per platform
 */
export const PLATFORM_SUPPORTED_ASPECT_RATIOS: Record<PlatformType, string[]> = {
  twitter: ['1:1', '16:9', '4:3'],
  x: ['1:1', '16:9', '4:3'],
  linkedin: ['1:1', '16:9', '4:3'],
  facebook: ['1:1', '16:9', '4:3', '9:16'],
  instagram: ['1:1', '4:5', '9:16'],
  threads: ['1:1', '4:5', '9:16']
};

/**
 * Platform display names
 */
export const PLATFORM_DISPLAY_NAMES: Record<PlatformType, string> = {
  twitter: 'Twitter',
  x: 'X',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  instagram: 'Instagram',
  threads: 'Threads'
};

/**
 * Get character limit for a specific platform
 * @param platform The platform to get the character limit for
 * @returns The character limit for the specified platform
 */
export function getPlatformCharacterLimit(platform: PlatformType): number {
  return PLATFORM_CHARACTER_LIMITS[platform] || 280; // Default to Twitter limit
}

/**
 * Get hashtag limit for a specific platform
 * @param platform The platform to get the hashtag limit for
 * @returns The hashtag limit for the specified platform
 */
export function getPlatformHashtagLimit(platform: PlatformType): number {
  return PLATFORM_HASHTAG_LIMITS[platform] || 3; // Default to Twitter limit
}

/**
 * Check if a platform supports threads
 * @param platform The platform to check
 * @returns Boolean indicating if the platform supports threads
 */
export function platformSupportsThreads(platform: PlatformType): boolean {
  return PLATFORM_THREAD_LIMITS[platform] > 1;
}

/**
 * Check if a platform supports polls
 * @param platform The platform to check
 * @returns Boolean indicating if the platform supports polls
 */
export function platformSupportsPolls(platform: PlatformType): boolean {
  return PLATFORM_POLL_OPTION_LIMITS[platform] > 0;
}

/**
 * Get supported aspect ratios for a platform
 * @param platform The platform to get supported aspect ratios for
 * @returns Array of supported aspect ratios
 */
export function getSupportedAspectRatios(platform: PlatformType): string[] {
  return PLATFORM_SUPPORTED_ASPECT_RATIOS[platform] || ['1:1'];
}

/**
 * Get display name for a platform
 * @param platform The platform to get the display name for
 * @returns The display name for the specified platform
 */
export function getPlatformDisplayName(platform: PlatformType): string {
  return PLATFORM_DISPLAY_NAMES[platform] || platform;
}
