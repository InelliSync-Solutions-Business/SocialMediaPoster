import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { SYSTEM_PROMPT } from '../src/utils/prompts/systemPrompt.js';
import CONTENT_PROMPTS from '../src/utils/prompts/contentPrompts.js';

dotenv.config();

// Function to determine if the date should be included
function shouldIncludeDate(topic, newsletterType) {
  const dateKeywords = ["today", "this week", "current", "latest", "recent", "monthly", "weekly", "annual", "yearly"];
  
  return dateKeywords.some(keyword => 
    topic.toLowerCase().includes(keyword) || 
    (newsletterType && newsletterType.toLowerCase().includes(keyword))
  );
}

// Function to build the newsletter prompt dynamically
export function buildNewsletterPrompt(params) {
  const { 
    topic, 
    length, 
    writingStyle, 
    targetAudience, 
    newsletterType, 
    tone, 
    additionalGuidelines 
  } = params;

  const newsletterPrompt = CONTENT_PROMPTS.newsletterPrompt || '';

  // Get current date formatted
  const currentDate = new Date();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const formattedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  // Determine if the date should be included
  const includeDate = shouldIncludeDate(topic, newsletterType);
  const dateIntro = includeDate ? `Welcome to the ${formattedDate} edition of AI Insights, ` : `Welcome to AI Insights, `;

  // Length configuration map
  const LENGTH_CONFIGS = {
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
  };

  // Get length configuration or default to medium
  const lengthConfig = LENGTH_CONFIGS[length] || LENGTH_CONFIGS.medium;

  // Tone configuration map - easily expandable
  const TONE_CONFIGS = {
    professional: {
      guidelines: [
        "Maintain formal, objective language with data-driven insights",
        "Use precise technical terminology where appropriate",
        "Employ structured paragraphs with clear topic sentences",
        "Focus on factual analysis over emotional appeal"
      ],
      examples: [
        "'Recent benchmarks indicate a 15% improvement in...'",
        "'The methodology follows three key principles...'"
      ],
      temperature: 0.65
    },
    inspirational: {
      guidelines: [
        "Use uplifting, visionary language that sparks curiosity",
        "Employ vivid imagery and creative metaphors",
        "Vary sentence structure with occasional rhetorical questions",
        "Include motivational calls to action"
      ],
      examples: [
        "'Imagine a future where AI amplifies human potential...'",
        "'This breakthrough isn't just progress - it's a launchpad for...'"
      ],
      temperature: 0.85
    },
    conversational: {
      guidelines: [
        "Use casual, approachable language",
        "Incorporate relatable analogies",
        "Use contractions and informal phrasing",
        "Address the reader directly"
      ],
      examples: [
        "'Let's break down this tech wizardry into bite-sized pieces...'",
        "'Ever felt like your code has a mind of its own? Here's why...'"
      ],
      temperature: 0.75
    },
    analytical: {
      guidelines: [
        "Focus on comparative analysis",
        "Use data visualization language",
        "Highlight patterns and correlations",
        "Maintain objective critical perspective"
      ],
      examples: [
        "'The metrics reveal a surprising correlation between...'",
        "'Benchmark comparisons show three distinct performance clusters...'"
      ],
      temperature: 0.6
    }
  };

  // Get tone configuration or default to professional
  const toneConfig = TONE_CONFIGS[tone] || TONE_CONFIGS.professional;

  // Build tone instructions from config
  const toneInstructions = `TONE GUIDELINES:\n${toneConfig.guidelines.map((g, i) => `${i+1}. ${g}`).join('\n')}`;
  const toneExamples = `EXAMPLES:\n${toneConfig.examples.map(e => `- ${e}`).join('\n')}`;
  const temperature = toneConfig.temperature;

  const formattedInput = `Generate a newsletter about ${topic}.\n` +
    `SPECIFIC LENGTH REQUIREMENTS:\n` +
    `- Aim for ${lengthConfig.wordCount[0]}-${lengthConfig.wordCount[1]} words\n` +
    `- ${lengthConfig.description}\n\n` +
    `The newsletter should start with:\n` +
    `"${dateIntro}your go-to source for the latest trends, tools, and developments in artificial intelligence. "\n` +
    `"Designed specifically for tech professionals, this newsletter aims to keep you informed and ahead of the curve."\n\n` +
    `WRITING STYLE: ${writingStyle}\n` +
    `TARGET AUDIENCE: ${targetAudience}\n` +
    `NEWSLETTER TYPE: ${newsletterType}\n` +
    `PRIMARY TONE: ${tone || 'casual'}\n\n` +
    `${toneInstructions}\n\n` +
    `${toneExamples}\n\n` +
    `${additionalGuidelines ? `ADDITIONAL GUIDELINES: ${additionalGuidelines}\n` : ''}`;

  const prompt = [
    SYSTEM_PROMPT,
    `CONTEXTUAL PARAMETERS:\n` +
    `- Current Date: ${formattedDate}\n` +
    `- Creativity Level: ${temperature}${temperature !== 0.7 ? ' (Tone-adjusted)' : ''}`,
    newsletterPrompt,
    formattedInput
  ].filter(p => p.trim()).join('\n\n');
  
  return prompt;
}

// Function to copy newsletter content to clipboard
export const copyNewsletterToClipboard = (content) => {
  try {
    // Use the Clipboard API for modern browsers
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(content).then(() => ({
        success: true,
        message: 'Newsletter content copied to clipboard!'
      }));
    } 
    // Fallback method for older browsers
    else {
      const textArea = document.createElement('textarea');
      textArea.value = content;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      return new Promise((resolve, reject) => {
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          resolve({
            success: true,
            message: 'Newsletter content copied to clipboard!'
          });
        } else {
          reject({
            success: false,
            message: 'Unable to copy newsletter content.'
          });
        }
      });
    }
  } catch (err) {
    return Promise.reject({
      success: false,
      message: 'Error copying newsletter content.',
      error: err.message
    });
  }
};

// Function to validate parameters
const validateParams = (params) => {
  const requiredFields = ['topic', 'length', 'writingStyle', 'targetAudience', 'newsletterType', 'tone'];
  const missing = requiredFields.filter(field => !params[field]);
  if (missing.length > 0) {
    throw new Error(`Missing required parameters: ${missing.join(', ')}`);
  }
};

// Function to generate newsletter
export const generateNewsletter = async (params) => {
  validateParams(params);
  
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

  const prompt = buildNewsletterPrompt({
    topic: params.topic, 
    length: params.length, 
    writingStyle: params.writingStyle, 
    targetAudience: params.targetAudience, 
    newsletterType: params.newsletterType, 
    tone: params.tone, 
    additionalGuidelines: params.additionalGuidelines
  });

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
};