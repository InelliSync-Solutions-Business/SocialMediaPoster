/**
 * Adapter file to handle importing prompt functions for the server
 * This file provides a bridge between the server and the TypeScript prompt manager
 * Using ES Module syntax
 */

// Mock implementation of the prompt functions
// These will be used by the server until we can properly import the built JS files

export function buildStandardPostPrompt(platform, topic, tone, audience, additionalGuidelines = '') {
  return `
    Create a ${platform} post about ${topic} with a ${tone} tone for ${audience}.
    ${additionalGuidelines ? `Additional guidelines: ${additionalGuidelines}` : ''}
  `;
}

export function buildThreadPrompt(platform, topic, tone, audience, additionalGuidelines = '') {
  return `
    Create a ${platform} thread about ${topic} with a ${tone} tone for ${audience}.
    ${additionalGuidelines ? `Additional guidelines: ${additionalGuidelines}` : ''}
  `;
}

export function buildPollPrompt(platform, topic, tone, audience, additionalGuidelines = '') {
  return `
    Create a ${platform} poll about ${topic} with a ${tone} tone for ${audience}.
    ${additionalGuidelines ? `Additional guidelines: ${additionalGuidelines}` : ''}
  `;
}

export function parseThreadContent(content) {
  // Simple implementation to parse thread content
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const threads = [];
  
  let currentThread = '';
  for (const line of lines) {
    if (line.startsWith('Tweet') || line.startsWith('Post')) {
      if (currentThread) {
        threads.push(currentThread.trim());
      }
      currentThread = line.split(':').slice(1).join(':').trim();
    } else {
      currentThread += ' ' + line.trim();
    }
  }
  
  if (currentThread) {
    threads.push(currentThread.trim());
  }
  
  return threads.length > 0 ? threads : [content];
}

export function buildNewsletterPrompt(options) {
  const {
    topic,
    targetAudience,
    writingStyle = 'Informative',
    additionalGuidelines = '',
    newsletterType = 'industry-insights',
    length = 'medium',
    tone = 'professional'
  } = options;
  
  return `
    Create a ${newsletterType} newsletter about ${topic} with a ${tone} tone for ${targetAudience}.
    The newsletter should be ${length} in length and written in a ${writingStyle} style.
    Format the newsletter in markdown with proper headings, lists, and emphasis.
    Include a title, date placeholder, introduction, sections with headings, and a conclusion.
    ${additionalGuidelines ? `Additional guidelines: ${additionalGuidelines}` : ''}
  `;
}
