import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { SYSTEM_PROMPT } from '../src/utils/prompts/systemPrompt';
import CONTENT_PROMPTS from '../src/utils/prompts/contentPrompts';

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
function buildNewsletterPrompt(params) {
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

  // Build dynamic prompt
  const formattedInput = `Generate a ${length || 'medium'} length newsletter about ${topic}.
The newsletter should start with:
"${dateIntro}your go-to source for the latest trends, tools, and developments in artificial intelligence. Designed specifically for tech professionals, this newsletter aims to keep you informed and ahead of the curve in an ever-evolving landscape."

Writing Style: ${writingStyle}
Target Audience: ${targetAudience}
Newsletter Type: ${newsletterType}
Tone: ${tone || 'professional'}
${additionalGuidelines ? `Additional Guidelines: ${additionalGuidelines}` : ''}`;

  const prompt = [
    SYSTEM_PROMPT,
    newsletterPrompt,
    formattedInput
  ].filter(p => p.trim()).join('\n\n');
  
  return prompt;
}

// Function to generate newsletter
export const generateNewsletter = async (params) => {
  const { 
    topic, 
    length, 
    writingStyle, 
    targetAudience, 
    newsletterType, 
    tone, 
    additionalGuidelines 
  } = params;
  
  console.log('Received newsletter generation request:', { 
    topic, 
    length, 
    writingStyle, 
    targetAudience, 
    newsletterType, 
    tone, 
    additionalGuidelines 
  });

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  console.log('OpenAI client initialized');

  const prompt = buildNewsletterPrompt({
    topic, 
    length, 
    writingStyle, 
    targetAudience, 
    newsletterType, 
    tone, 
    additionalGuidelines
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: 'system', content: prompt }
    ],
    temperature: 0.8,
    max_tokens: 4000,
    presence_penalty: 0.2,
    frequency_penalty: 0.3
  });
  console.log('OpenAI newsletter response received');

  return {
    success: true,
    content: completion.choices[0].message.content,
    metadata: {
      topic,
      length,
      writingStyle,
      targetAudience,
      newsletterType,
      tone
    }
  };
};