/**
 * Central export point for all prompt builders
 */

import BasePromptBuilder from './baseBuilder';
import NewsletterPromptBuilder from './newsletterBuilder';
import PollPromptBuilder from './pollBuilder';
import ThreadPromptBuilder from './threadBuilder';
import ImagePromptBuilder from './imageBuilder';
import SocialPromptBuilder from './socialBuilder';

// Export all builders
export {
  BasePromptBuilder,
  NewsletterPromptBuilder,
  PollPromptBuilder,
  ThreadPromptBuilder,
  ImagePromptBuilder,
  SocialPromptBuilder
};

// Factory function to get the appropriate builder based on content type
export function getPromptBuilder(contentType: string): BasePromptBuilder {
  switch (contentType.toLowerCase()) {
    case 'newsletter':
      return new NewsletterPromptBuilder();
    case 'poll':
      return new PollPromptBuilder();
    case 'thread':
      return new ThreadPromptBuilder();
    case 'image':
      return new ImagePromptBuilder();
    case 'social':
      return new SocialPromptBuilder();
    default:
      return new SocialPromptBuilder(); // Use SocialPromptBuilder as the default
  }
}
