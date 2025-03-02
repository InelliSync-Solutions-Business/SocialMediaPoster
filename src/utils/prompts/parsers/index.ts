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

// Note: ThreadPost and ParsedThreadContent are defined in types.ts, not in threadParser
// These types should be imported from '../types' instead

// Default export as a unified parsers object
export default {
  thread: threadParser,
  newsletter: newsletterParser,
  poll: pollParser,
  image: imageParser,
  formatter: contentFormatter
};
