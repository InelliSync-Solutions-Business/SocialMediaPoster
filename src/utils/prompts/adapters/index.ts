/**
 * Central export for all adapters
 */

import openaiAdapter from './openaiAdapter';
import platformAdapter from './platformAdapter';

export {
  // OpenAI API adapter
  openaiAdapter,
  
  // Platform-specific adapter
  platformAdapter
};

// Type re-exports for convenience
export type { 
  // Add any adapter-specific types here if needed
};

// Default export as a unified adapters object
export default {
  openai: openaiAdapter,
  platform: platformAdapter
};
