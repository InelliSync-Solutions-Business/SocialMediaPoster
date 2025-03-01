/**
 * Central export point for all prompt templates
 */

import newsletterTemplates from './newsletterTemplates';
import pollTemplates from './pollTemplates';
import threadTemplates from './threadTemplates';
import imageTemplates from './imageTemplates';
import socialTemplates from './socialTemplates';

// Consolidated system prompts
export const SYSTEM_PROMPTS = {
  newsletter: newsletterTemplates.NEWSLETTER_SYSTEM_PROMPT,
  poll: pollTemplates.POLL_SYSTEM_PROMPT,
  thread: threadTemplates.THREAD_SYSTEM_PROMPT,
  image: imageTemplates.IMAGE_SYSTEM_PROMPT,
  social: socialTemplates.SOCIAL_SYSTEM_PROMPT,
  // Base system prompt for all content types
  base: `You are NOVA (Neural Optimized Virtual Assistant), a specialized AI designed to create high-quality, engaging content. Your task is to create content based on the specified parameters that delivers genuine value to the audience while adhering to best practices for the specified content type.`
};

// Template mapping
export const PROMPT_TEMPLATES = {
  newsletter: newsletterTemplates.NEWSLETTER_BASE_TEMPLATE,
  poll: pollTemplates.POLL_BASE_TEMPLATE,
  thread: threadTemplates.THREAD_BASE_TEMPLATE,
  image: imageTemplates.IMAGE_BASE_TEMPLATE,
  social: socialTemplates.SOCIAL_BASE_TEMPLATE
};

// Configuration options
export const CONFIG = {
  newsletter: {
    lengthConfig: newsletterTemplates.LENGTH_CONFIGS,
    toneTemplates: newsletterTemplates.TONE_TEMPLATES
  },
  poll: {
    platformGuidance: pollTemplates.PLATFORM_GUIDANCE
  },
  thread: {
    platformGuidance: threadTemplates.PLATFORM_GUIDANCE,
    characterLimits: threadTemplates.CHARACTER_LIMITS
  },
  image: {
    styleOptions: imageTemplates.STYLE_OPTIONS,
    moodOptions: imageTemplates.MOOD_OPTIONS
  },
  social: {
    platformGuidance: socialTemplates.PLATFORM_GUIDANCE,
    characterLimits: socialTemplates.CHARACTER_LIMITS
  }
};

export {
  newsletterTemplates,
  pollTemplates,
  threadTemplates,
  imageTemplates,
  socialTemplates
};
