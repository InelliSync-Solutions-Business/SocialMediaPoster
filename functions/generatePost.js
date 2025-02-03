import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { SYSTEM_PROMPT } from '../src/utils/prompts/systemPrompt';
import CONTENT_PROMPTS from '../src/utils/prompts/contentPrompts';

dotenv.config();

const CONTENT_PROMPTS_MAP = {
  image: CONTENT_PROMPTS.imagePrompt,
  poll: CONTENT_PROMPTS.pollsPrompt,
  longForm: CONTENT_PROMPTS.longFormPrompt,
  shortForm: CONTENT_PROMPTS.shortFormPrompt
};

function buildPrompt(postType, params) {
  const contentPrompt = CONTENT_PROMPTS_MAP[postType] ?? '';
  
  // Format the user input based on post type
  const formattedInput = params.userInput || '';

  const prompt = [
    SYSTEM_PROMPT,
    contentPrompt,
    formattedInput
  ].filter(p => p.trim()).join('\n\n');
  
  return prompt;
}

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ message: 'Method Not Allowed' }) 
    };
  }

  try {
    const { 
      postType, 
      topic, 
      targetAudience, 
      writingStyle, 
      additionalGuidelines, 
      selectedTemplate,
      tone,
      length,
      userInput
    } = JSON.parse(event.body);
    
    console.log('Received request:', { 
      postType, 
      topic, 
      targetAudience, 
      writingStyle, 
      additionalGuidelines, 
      selectedTemplate,
      tone,
      length,
      userInput
    });

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    console.log('OpenAI client initialized');

    const prompt = buildPrompt(postType, {
      topic,
      targetAudience,
      writingStyle,
      additionalGuidelines,
      tone,
      length,
      userInput
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: 'system', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: postType === 'long' ? 1000 
        : postType === 'thread' ? 800 
        : 400,
      presence_penalty: 0,
      frequency_penalty: 0
    });
    console.log('OpenAI response received');

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        content: completion.choices[0].message.content
      })
    };
  } catch (error) {
    console.error('Error generating post:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false,
        error: error.message 
      })
    };
  }
};
