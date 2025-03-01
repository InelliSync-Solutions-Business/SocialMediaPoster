import { UserPreferences } from '@/types/preferences';
import CONTENT_PROMPTS from './contentPrompts';
import { generateLongFormPrompt } from './longFormPrompt';
import { generateShortFormPrompt } from './shortFormPrompt';
import { OpenAI } from 'openai';

// Import builders
import { 
  PollPromptBuilder,
  ImagePromptBuilder
} from './builders';

// Import centralized utilities
import { estimateTokenCount, calculatePromptCost, getOpenAIModel } from '../ai/tokenUtils';
import { parseThreadContent as parseThread, fillTemplate } from './contentProcessors';
import { mapStyleToTone } from './styleMapper';
import { SYSTEM_PROMPTS } from './templates';

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
  model?: string;
}) {
  try {
    // Build the prompt
    const prompt = buildNewsletterPrompt(params);
    
    // Estimate tokens and cost using centralized utilities
    const inputTokens = estimateTokenCount(prompt);
    const estimatedOutputTokens = 
      params.length === 'short' ? 2000 :
      params.length === 'medium' ? 4000 : 6000;
    
    const model = getOpenAIModel(params.model);
    const systemPrompt = SYSTEM_PROMPTS.newsletter;
    const estimatedCost = calculatePromptCost(systemPrompt, prompt, estimatedOutputTokens, model);
    
    console.log(`Estimated tokens - Input: ${inputTokens}, Output: ${estimatedOutputTokens}`);
    console.log(`Estimated cost: $${estimatedCost.toFixed(6)}`);
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    });

    // Generate content
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.newsletter
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: params.length === 'short' ? 1500 : params.length === 'medium' ? 2500 : 3500,
    });

    // Extract and return the generated content
    const content = response.choices[0]?.message?.content || '';
    
    // Log actual token usage using centralized utilities
    const actualInputTokens = response.usage?.prompt_tokens || 0;
    const actualOutputTokens = response.usage?.completion_tokens || 0;
    
    // Calculate actual cost using the token usage
    const actualCost = calculatePromptCost(systemPrompt, prompt, actualOutputTokens, model);
    
    console.log(`Actual tokens - Input: ${actualInputTokens}, Output: ${actualOutputTokens}`);
    console.log(`Actual cost: $${actualCost.toFixed(6)}`);
    
    return {
      content,
      usage: {
        inputTokens: actualInputTokens,
        outputTokens: actualOutputTokens,
        estimatedCost: actualCost
      }
    };
  } catch (error) {
    console.error('Error generating newsletter:', error);
    throw error;
  }
}

// Use the centralized getOpenAIModel function from tokenUtils.ts
// This comment is kept to maintain code documentation

// Helper function to parse thread content
export function parseThreadContent(content: string) {
  if (!content) return [];
  
  // Use the centralized parseThread function
  const tweets = parseThread(content);
  
  // Format the result to maintain the same return structure
  return tweets.filter(tweet => tweet.length > 0).map(tweet => ({
    content: tweet,
    characterCount: tweet.length
  }));
}

// Export builder-based prompt generation functions
export function generatePollPrompt(params: any) {
  const builder = new PollPromptBuilder();
  return builder.build({
    topic: params.topic,
    targetAudience: params.audience,
    tone: params.tone,
    writingStyle: params.style,
    additionalGuidelines: params.guidelines,
    platform: params.platform,
    optionCount: params.optionCount
  });
}

export function generateImagePrompt(params: any) {
  const builder = new ImagePromptBuilder();
  return builder.build({
    topic: params.topic,
    targetAudience: params.audience,
    tone: params.tone,
    writingStyle: params.writingStyle || params.style,
    additionalGuidelines: params.guidelines,
    style: params.style, // Use the style parameter directly as ImagePromptBuilder expects
    mood: params.mood,
    visualElements: params.visualElements,
    aspectRatio: params.aspectRatio,
    content: params.content // Add content parameter
  });
}

// Re-export other prompt functions for consistency
export {
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
  generateImagePrompt,
  generateLongFormPrompt,
  generateShortFormPrompt,
  generateNewsletter
};
