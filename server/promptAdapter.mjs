/**
 * Adapter file to handle importing prompt functions for the server
 * This file provides a bridge between the server and the TypeScript prompt manager
 * Using ES Module syntax
 */

// Since we can't directly import TypeScript files in Node.js without transpilation,
// we'll implement the necessary functions here directly

// System prompts for different content types
export const systemPrompts = {
  social: `You are an expert social media content creator with years of experience crafting engaging, platform-optimized posts. Your task is to create compelling social media content that resonates with the specified audience, follows the requested style, and adheres to platform best practices.`,
  newsletter: `You are an expert newsletter writer with years of experience crafting engaging, informative newsletters. Your task is to create a compelling newsletter that resonates with the specified audience, follows the requested style, and delivers valuable information.`,
  poll: `You are an expert at creating engaging polls that drive audience interaction. Your task is to create compelling poll questions with appropriate options that will generate interest and participation from the target audience.`,
  image: `You are NOVA (Neural Optimized Visual Assistant), an expert at creating detailed prompts for AI image generation. Your task is to create a detailed, descriptive prompt that will result in a compelling image related to the specified topic.`
};

/**
 * Maps writing style to tone for better prompt results
 */
function mapStyleToTone(style) {
  const styleMap = {
    'professional': 'professional',
    'casual': 'conversational',
    'humorous': 'humorous',
    'informative': 'analytical',
    'inspirational': 'inspirational',
    'controversial': 'provocative',
    'formal': 'formal',
    'storytelling': 'narrative',
    'educational': 'educational'
  };
  
  return styleMap[style?.toLowerCase()] || 'conversational';
}

/**
 * Builds a prompt for standard social media posts
 */
export function buildStandardPostPrompt(platform, topic, style, audience, additionalGuidelines = '') {
  return `
Generate a social media post.
Post Type: ${platform}
Topic: ${topic}
Target Audience: ${audience}
Style: ${style}
Guidelines: ${additionalGuidelines}

FORMATTING REQUIREMENTS:
- Use clear, structured formatting with proper sections
- Include a compelling headline/title
- Use bullet points or numbered lists where appropriate
- Highlight key points with emphasis
- For longer posts, use clear section headings
- Use emojis strategically where appropriate
- End with a clear call-to-action
`;
}

/**
 * Builds a prompt for social media threads
 */
export function buildThreadPrompt(platform, topic, style, audience, additionalGuidelines = '') {
  return `
Generate a social media thread on ${platform}.
Topic: ${topic}
Target Audience: ${audience}
Style: ${style}
Guidelines: ${additionalGuidelines}

FORMATTING REQUIREMENTS:
- Create a cohesive thread with 3-5 connected posts
- Each post should be clearly separated with [POST 1], [POST 2], etc.
- First post should hook the reader
- Middle posts should develop the topic
- Final post should include a call-to-action
- Each post must respect platform character limits
- Use emojis and formatting appropriately
- Ensure each post can stand alone but also works as part of the thread
`;
}

/**
 * Builds a prompt for social media polls
 */
export function buildPollPrompt(platform, topic, style, audience, additionalGuidelines = '') {
  try {
    // Validate input parameters
    if (!topic) {
      console.warn('No topic provided for poll prompt generation');
      topic = 'general discussion';
    }
    
    // Log the poll prompt generation
    console.log(`Generating poll prompt for ${platform || 'social media'} about ${topic}`);
    
    const tone = mapStyleToTone(style);
    
    return `
    Create a poll for ${platform || 'twitter'} about ${topic}.
    Target audience: ${audience || 'General audience'}
    Tone: ${tone}
    Style: ${style || 'conversational'}
    Additional guidelines: ${additionalGuidelines || ''}
    
    Format your response as follows:
    Question: [The poll question]
    
    Options:
    1. [First option]
    2. [Second option]
    3. [Third option]
    4. [Fourth option (optional)]
    `;
  } catch (error) {
    console.error('Error in buildPollPrompt:', error);
    // Return a fallback prompt in case of error
    return `
Generate an engaging social media poll.
Topic: ${topic || 'general discussion'}

Please format the response with proper structure and include 2-4 compelling options.
`;
  }
}

/**
 * Parses thread content into structured format
 */
export function parseThreadContent(content) {
  if (!content) return [];
  
  try {
    // Try different parsing strategies
    // Strategy 1: Look for [POST X] markers
    const postMarkerRegex = /\[POST \d+\]|POST \d+:/gi;
    if (postMarkerRegex.test(content)) {
      const posts = content.split(/\[POST \d+\]|POST \d+:/gi).filter(post => post.trim().length > 0);
      return posts.map((post, index) => ({
        id: `post-${index + 1}`,
        content: post.trim()
      }));
    }
    
    // Strategy 2: Look for numbered posts (1. Post content)
    const numberedPostRegex = /^\d+\.\s/gm;
    if (numberedPostRegex.test(content)) {
      const posts = content.split(/^\d+\.\s/gm).filter(post => post.trim().length > 0);
      return posts.map((post, index) => ({
        id: `post-${index + 1}`,
        content: post.trim()
      }));
    }
    
    // Strategy 3: Split by double newlines for simple posts
    const posts = content.split(/\n\s*\n/).filter(post => post.trim().length > 0);
    return posts.map((post, index) => ({
      id: `post-${index + 1}`,
      content: post.trim()
    }));
  } catch (error) {
    console.error('Error parsing thread content:', error);
    // Fallback to a simple parsing approach
    const posts = content.split(/\n\s*\n/).filter(post => post.trim().length > 0);
    return posts.map((post, index) => ({
      id: `post-${index + 1}`,
      content: post.trim()
    }));
  }
}

/**
 * Truncates content to a specified length while preserving important elements
 */
export function truncateContent(content, maxLength = 500) {
  if (!content) return '';
  
  try {
    // If content is already within limits, return it as is
    if (content.length <= maxLength) return content;
    
    // Try to find a good breakpoint
    const breakpoint = findBreakpoint(content, maxLength - 3);
    return content.substring(0, breakpoint) + '...';
  } catch (error) {
    console.error('Error truncating content:', error);
    
    // Fallback implementation
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength - 3) + '...';
  }
}

/**
 * Helper function to find a good breakpoint for truncation
 */
function findBreakpoint(text, maxLength) {
  // If text is shorter than maxLength, return its length
  if (text.length <= maxLength) return text.length;
  
  // Try to break at a sentence ending (period, question mark, exclamation point)
  const lastSentenceEnd = Math.max(
    text.lastIndexOf('.', maxLength),
    text.lastIndexOf('?', maxLength),
    text.lastIndexOf('!', maxLength)
  );
  
  if (lastSentenceEnd > maxLength * 0.7) {
    return lastSentenceEnd + 1; // Include the punctuation
  }
  
  // Try to break at a paragraph
  const lastParagraph = text.lastIndexOf('\n', maxLength);
  if (lastParagraph > maxLength * 0.7) {
    return lastParagraph;
  }
  
  // Try to break at a space
  const lastSpace = text.lastIndexOf(' ', maxLength);
  if (lastSpace > 0) {
    return lastSpace;
  }
  
  // If all else fails, just break at maxLength
  return maxLength;
}

/**
 * Generates an image prompt based on content
 */
export function generateImagePrompt(params) {
  const style = params.imageStyle || params.style || 'realistic';
  const mood = params.mood || 'neutral';
  const aspectRatio = params.aspectRatio || '1:1';
  const topic = params.topic || '';
  const audience = params.audience || 'general audience';
  const visualElements = params.visualElements || [];
  
  const instructions = `You are NOVA (Neural Optimized Virtual Assistant), an expert at creating detailed prompts for AI image generation.

CORE OBJECTIVE:
Create a detailed, descriptive prompt for generating an image related to ${topic} that will resonate with ${audience}.

IMAGE PARAMETERS:
- Subject: ${topic}
- Style: ${style}
- Mood/Atmosphere: ${mood}
- Aspect Ratio: ${aspectRatio}
${visualElements && visualElements.length > 0 ? `- Key Visual Elements: ${visualElements.join(', ')}` : ''}

PROMPT STRUCTURE:
1. Main Subject Description - Detailed description of the primary subject
2. Setting/Background - Context and environment details
3. Lighting and Atmosphere - Mood, time of day, weather, etc.
4. Style Specifications - Artistic style, rendering approach
5. Composition Details - Framing, perspective, focal points
6. Technical Specifications - Resolution, aspect ratio, rendering quality

PROMPT REQUIREMENTS:
- Be highly detailed and specific
- Use descriptive adjectives and clear visual language
- Avoid ambiguous terms or contradictory descriptions
- Include both foreground and background elements
- Specify lighting, colors, and atmosphere
- Mention artistic style and technical preferences
- Keep the total prompt length between 100-200 words for optimal results`;
  
  return {
    prompt: instructions,
    systemPrompt: systemPrompts.image,
    maxTokens: 500
  };
}

/**
 * Builds a newsletter prompt
 */
export function buildNewsletterPrompt(newsletterType, topic, style, audience, additionalGuidelines = '', length = 'medium', tone = 'professional') {
  // Format the length guidance
  let lengthGuidance = '';
  switch (length) {
    case 'short':
      lengthGuidance = 'Keep the newsletter concise and focused, around 300-500 words.';
      break;
    case 'long':
      lengthGuidance = 'Create a comprehensive newsletter with detailed sections, around 1000-1500 words.';
      break;
    case 'medium':
    default:
      lengthGuidance = 'Create a balanced newsletter with moderate detail, around 600-900 words.';
      break;
  }
  
  // Map the tone using the existing function
  const mappedTone = mapStyleToTone(tone);
  
  // Format the tone guidance
  let toneGuidance = '';
  switch (mappedTone) {
    case 'inspirational':
      toneGuidance = 'Use motivational language, inspiring examples, and an uplifting tone.';
      break;
    case 'conversational':
      toneGuidance = 'Write in a friendly, approachable manner as if speaking directly to the reader.';
      break;
    case 'analytical':
      toneGuidance = 'Present information logically with data, analysis, and evidence-based insights.';
      break;
    case 'humorous':
      toneGuidance = 'Incorporate appropriate humor and light-hearted elements while maintaining professionalism.';
      break;
    case 'professional':
    default:
      toneGuidance = 'Maintain a polished, authoritative tone appropriate for a business context.';
      break;
  }
  
  // Build the prompt
  const prompt = `
Generate a ${newsletterType} newsletter about ${topic}.

TARGET AUDIENCE:
${audience}

WRITING STYLE:
${style}

TONE:
${toneGuidance}

LENGTH:
${lengthGuidance}

ADDITIONAL GUIDELINES:
${additionalGuidelines || 'Follow best practices for newsletter writing.'}

FORMATTING REQUIREMENTS:
- Include a compelling subject line/title
- Create a brief introduction that hooks the reader
- Organize content into clear, well-structured sections with headings
- Use bullet points or numbered lists where appropriate
- Include a conclusion with a clear call-to-action
- Format for readability with appropriate spacing
- Use markdown formatting for emphasis and structure
`;

  return {
    prompt,
    systemPrompt: systemPrompts.newsletter,
    maxTokens: 1500
  };
}

// Note: systemPrompts are already defined at the top of the file
