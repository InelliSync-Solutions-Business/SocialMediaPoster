import { UserPreferences } from '@/types/preferences';
import CONTENT_PROMPTS from './contentPrompts';
import { generatePollPrompt, PollPromptParams } from './pollsPrompt';
import { generateImagePrompt as imagePromptGenerator } from './imagePrompt';
import { generateLongFormPrompt } from './longFormPrompt';
import { generateShortFormPrompt } from './shortFormPrompt';
import { OpenAI } from 'openai';

// Helper function to build standard post prompt
export function buildStandardPostPrompt({ postType, topic, audience, style, guidelines }: {
  postType: string;
  topic: string;
  audience: string;
  style: string;
  guidelines: string;
}) {
  return `
Generate a social media post.
Post Type: ${postType}
Topic: ${topic}
Target Audience: ${audience}
Style: ${style}
Guidelines: ${guidelines}

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

// Helper function to build Twitter thread prompt
export function buildThreadPrompt({ topic, audience, style, guidelines }: {
  topic: string;
  audience: string;
  style: string;
  guidelines: string;
}) {
  return `
Generate a Twitter thread (4-6 tweets) about the following topic. Each tweet should be separated by "---" and be under 280 characters.

Topic: ${topic}
Target Audience: ${audience}
Writing Style: ${style}
Additional Guidelines: ${guidelines}

Requirements:
1. Start with a hook tweet that grabs attention
2. Each tweet should flow naturally to the next
3. Include relevant emojis where appropriate
4. End with a call-to-action
5. Keep each tweet under 280 characters
6. Separate tweets with "---"

Example Format:
🧵 First tweet here...
---
Second tweet continues the story...
---
Final tweet with call-to-action 🎯

Please generate the thread now:`;
}

// Helper function to build poll prompt
export function buildPollPrompt({ topic, audience, style, guidelines }: {
  topic: string;
  audience: string;
  style: string;
  guidelines: string;
}) {
  return `
Generate an engaging social media poll.
Topic: ${topic}
Target Audience: ${audience}
Style: ${style}
Guidelines: ${guidelines}

Please format the response with proper structure and formatting:
# [ENGAGING POLL TITLE]

## Poll Question
[Your question here]

## Options
- Option A: [First option]
- Option B: [Second option]
- Option C: [Third option]
- Option D: [Fourth option]

## Engagement Strategy
[Brief explanation of why this poll is engaging and how it connects with the audience]
`;
}

// Helper function to build newsletter prompt
export function buildNewsletterPrompt(params: {
  topic: string;
  length: 'short' | 'medium' | 'long';
  writingStyle: string;
  targetAudience: string;
  newsletterType: string; 
  tone: 'professional' | 'inspirational' | 'conversational' | 'analytical';
  additionalGuidelines?: string;
}) {
  const { 
    topic, 
    length, 
    writingStyle, 
    targetAudience, 
    newsletterType, 
    tone, 
    additionalGuidelines 
  } = params;

  // Get current date formatted
  const currentDate = new Date();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const formattedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  // Determine if the date should be included based on topic keywords
  const dateKeywords = ["today", "this week", "current", "latest", "recent", "monthly", "weekly", "annual", "yearly"];
  const includeDate = dateKeywords.some(keyword => 
    topic.toLowerCase().includes(keyword) || 
    (newsletterType && newsletterType.toLowerCase().includes(keyword))
  );
  
  const dateIntro = includeDate ? `Welcome to the ${formattedDate} edition, ` : `Welcome to `;

  // Length configuration
  const lengthConfig = {
    short: {
      wordCount: '800-1200 words',
      sections: '3-4 sections',
      depth: 'Focused overview with key points'
    },
    medium: {
      wordCount: '1200-2000 words',
      sections: '4-6 sections',
      depth: 'Comprehensive coverage with detailed insights'
    },
    long: {
      wordCount: '2000-3000 words',
      sections: '6-8 sections',
      depth: 'In-depth analysis with expert perspectives'
    }
  }[length] || {
    wordCount: '1200-2000 words',
    sections: '4-6 sections', 
    depth: 'Balanced content with key insights'
  };

  return `
Generate a professional newsletter about ${topic}.

NEWSLETTER DETAILS:
- Type: ${newsletterType}
- Target Audience: ${targetAudience}
- Writing Style: ${writingStyle}
- Tone: ${tone}
- Length: ${length} (${lengthConfig.wordCount})
${additionalGuidelines ? `- Additional Guidelines: ${additionalGuidelines}` : ''}

STRUCTURE REQUIREMENTS:
- Include a clear, engaging title/headline
- Start with a brief introduction (${dateIntro})
- Create ${lengthConfig.sections}
- Use proper headings (markdown format with # and ##)
- Include bullet points for key takeaways
- End with a concise conclusion and call-to-action

FORMATTING REQUIREMENTS:
- Use markdown formatting throughout
- Create a visually structured document with clear section headings
- Use bold for important terms or concepts
- Use bullet points or numbered lists for clarity
- Include a "Key Takeaways" section
- End with "Next Steps" or a clear CTA

Please generate the full newsletter with proper formatting and sectioning:
`;
}

// Function to generate newsletter with OpenAI
export async function generateNewsletter(params: {
  topic: string;
  length: 'short' | 'medium' | 'long';
  writingStyle: string;
  targetAudience: string;
  newsletterType: string; 
  tone: 'professional' | 'inspirational' | 'conversational' | 'analytical';
  additionalGuidelines?: string;
}) {
  // Validate required parameters
  if (!params.topic || !params.targetAudience) {
    throw new Error('Missing required parameters: topic and targetAudience are required');
  }
  
  console.log('Received newsletter generation request:', { 
    topic: params.topic, 
    length: params.length, 
    writingStyle: params.writingStyle, 
    targetAudience: params.targetAudience, 
    newsletterType: params.newsletterType, 
    tone: params.tone, 
    additionalGuidelines: params.additionalGuidelines 
  });

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log('OpenAI client initialized');

  const prompt = buildNewsletterPrompt(params);

  const lengthConfig = {
    short: {
      wordCount: [800, 1200],
      description: "Concise and to-the-point newsletter"
    },
    medium: {
      wordCount: [1200, 2000],
      description: "Balanced newsletter with key insights"
    },
    long: {
      wordCount: [2000, 3000],
      description: "Comprehensive newsletter with in-depth exploration"
    }
  }[params.length] || {
    wordCount: [1200, 2000],
    description: "Balanced newsletter with key insights"
  };

  const toneConfig = {
    professional: {
      temperature: 0.65
    },
    inspirational: {
      temperature: 0.85
    },
    conversational: {
      temperature: 0.75
    },
    analytical: {
      temperature: 0.6
    }
  }[params.tone] || {
    temperature: 0.65
  };

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: 'system', content: prompt }
    ],
    temperature: toneConfig.temperature || 0.7,
    max_tokens: lengthConfig.wordCount[1],
    presence_penalty: 0,
    frequency_penalty: 0
  });

  return completion.choices[0].message.content;
}

// Helper function to parse thread content
export function parseThreadContent(content: string) {
  if (!content) return [];
  const tweets = content.split('---').map(tweet => tweet.trim());
  return tweets.filter(tweet => tweet.length > 0).map(tweet => ({
    content: tweet,
    characterCount: tweet.length
  }));
}

// Re-export other prompt functions for consistency
export { 
  generatePollPrompt,
  imagePromptGenerator as generateImagePrompt,
  generateLongFormPrompt,
  generateShortFormPrompt
};

// Export a unified prompt interface
export default {
  buildStandardPostPrompt,
  buildThreadPrompt,
  buildPollPrompt,
  buildNewsletterPrompt,
  parseThreadContent,
  generatePollPrompt,
  generateImagePrompt: imagePromptGenerator,
  generateLongFormPrompt,
  generateShortFormPrompt,
  generateNewsletter
};
