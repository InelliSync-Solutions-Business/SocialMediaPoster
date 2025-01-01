import 'dotenv/config';
import { OpenAI } from 'openai';

// OpenAI Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to build the prompt based on post type and other parameters
function buildPrompt({ postType, topic, audience, style, guidelines }) {
  if (postType === 'thread') {
    return `
      Generate a multi-post thread for a Twitter-like platform.
      Topic: ${topic}
      Target Audience: ${audience}
      Style: ${style}
      Guidelines: ${guidelines}
    `;
  }
  
  return `
    Generate a social media post.
    Post Type: ${postType}
    Topic: ${topic}
    Target Audience: ${audience}
    Style: ${style}
    Guidelines: ${guidelines}
  `;
}

// Serverless function handler
export const handler = async (event, context) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Parse the incoming request body
    const { postType, topic, audience, style, guidelines } = JSON.parse(event.body);

    // Input validation
    if (!postType || !topic) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          error: 'Post type and topic are required',
        }),
      };
    }

    // Validate OpenAI configuration
    if (!process.env.OPENAI_API_KEY) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: false,
          error: 'OpenAI API key is not configured'
        }),
      };
    }

    const prompt = buildPrompt({
      postType,
      topic,
      audience,
      style,
      guidelines,
    });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a creative AI specialized in generating engaging social media content.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Return the generated content
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        content: completion.choices[0].message.content.trim()
      }),
    };
  } catch (error) {
    console.error('Server error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: false,
        error: 'Failed to generate content',
        details: error.message
      }),
    };
  }
};
