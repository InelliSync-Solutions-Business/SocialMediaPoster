/**
 * Central export for all parsers
 */

import threadParser from './threadParser';
import newsletterParser from './newsletterParser';
import pollParser from './pollParser';
import imageParser from './imageParser';
import contentFormatter from './contentFormatter';

export { 
  // Thread parser
  threadParser,
  
  // Newsletter parser
  newsletterParser,
  
  // Poll parser
  pollParser,
  
  // Image parser
  imageParser,
  
  // Content formatter
  contentFormatter
};

// Type re-exports for convenience
export type { 
  ThreadPost,
  ParsedThreadContent 
} from './threadParser';

// Default export as a unified parsers object
export default {
  thread: threadParser,
  newsletter: newsletterParser,
  poll: pollParser,
  image: imageParser,
  formatter: contentFormatter
};
