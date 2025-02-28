import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { SYSTEM_PROMPT } from '../src/utils/prompts/systemPrompt.ts';
import CONTENT_PROMPTS from '../src/utils/prompts/contentPrompts.ts';
import { buildNewsletterPrompt, generateNewsletter } from '../src/utils/prompts/promptManager.ts';
dotenv.config();

const CONTENT_PROMPTS_MAP = {
  image: CONTENT_PROMPTS.imagePrompt,
  poll: CONTENT_PROMPTS.pollsPrompt,
  longForm: CONTENT_PROMPTS.longFormPrompt,
  shortForm: CONTENT_PROMPTS.shortFormPrompt,
  newsletter: buildNewsletterPrompt,
  thread: CONTENT_PROMPTS.threadPrompt
};

// Shared tone configurations
const TONE_CONFIGS = {
  professional: {
    guidelines: [
      "Use concise, business-focused language",
      "Incorporate industry hashtags",
      "Highlight key metrics",
      "Maintain brand voice consistency"
    ],
    examples: [
      "'Breaking: New AI benchmark achieves 99.8% accuracy #MachineLearning'",
      "'Case Study: How CompanyX reduced costs by 40% using our solution'",
    ],
    temperature: 0.6
  },
  inspirational: {
    guidelines: [
      "Use emojis and positive language",
      "Ask engaging questions",
      "Include motivational quotes",
      "Use trending hashtags"
    ],
    examples: [
      "'🚀 Ready to supercharge your workflow? Our latest feature is live! #ProductivityBoost'",
      '"The only limit is your imagination" - See what\'s possible with AI 🔥'
    ],
    temperature: 0.85
  },
  conversational: {
    guidelines: [
      "Use casual language and slang",
      "Incorporate pop culture references",
      "Ask for audience opinions",
      "Use humor when appropriate"
    ],
    examples: [
      "'PSA: Your code doesn't have to look like a Picasso painting to work 🎨 #DevLife'",
      "'Raise your hand if you've ever fought with a regex for 3 hours 🙋♂️ #Relatable'",
    ],
    temperature: 0.8
  }
};

function buildPrompt(postType, params) {
  // Special handling for newsletter
  if (postType === 'newsletter') {
    return {
      prompt: buildNewsletterPrompt({
        topic: params.topic,
        length: params.length,
        writingStyle: params.writingStyle,
        targetAudience: params.targetAudience,
        newsletterType: params.newsletterType || 'general',
        tone: params.tone,
        additionalGuidelines: params.additionalGuidelines
      }),
      temperature: TONE_CONFIGS[params.tone]?.temperature || 0.7
    };
  }

  // Existing logic for other post types
  const contentPrompt = CONTENT_PROMPTS_MAP[postType] ?? '';
  
  // Format the user input based on post type
  const formattedInput = params.userInput || '';

  const toneConfig = TONE_CONFIGS[params.tone] || TONE_CONFIGS.professional;

  const toneInstructions = `SOCIAL TONE GUIDELINES:\n${toneConfig.guidelines.map((g, i) => `${i+1}. ${g}`).join('\n')}`;
  const toneExamples = `POST EXAMPLES:\n${toneConfig.examples.map(e => `- ${e}`).join('\n')}`;

  const prompt = [
    SYSTEM_PROMPT,
    contentPrompt,
    toneInstructions,
    toneExamples,
    formattedInput
  ].filter(p => p.trim()).join('\n\n');
  
  return { prompt, temperature: toneConfig.temperature };
}

// Add thread post validation and trimming function
function validateAndTrimThreadPosts(threadPosts, minChars = 140, maxChars = 240) {
  return threadPosts
    .map(post => post.trim())
    .filter(post => 
      post.length >= minChars && 
      post.length <= maxChars
    )
    .slice(0, 6);
}

// Modify thread generation function
async function generateThreadPosts(openai, params, maxThreads = 6) {
  const threadPrompt = `
    Generate a series of interconnected social media thread posts about the topic: ${params.topic}
    
    Strict Guidelines:
    - Create ${maxThreads} thread posts that tell a cohesive story
    - Each thread MUST be between 140-240 characters
    - Each post should build upon the previous one
    - Maintain the ${params.tone} tone
    - Use engaging and informative language
    - Include relevant hashtags 
    - Focus on creating a narrative flow
    - Ensure clarity and impact within the character limit

    Additional Context: ${params.userInput || ''}
  `;

  const threadCompletion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: 'system', content: threadPrompt }
    ],
    temperature: TONE_CONFIGS[params.tone]?.temperature || 0.7,
    max_tokens: 1500,
    n: 1
  });

  const threadContent = threadCompletion.choices[0].message.content;
  
  // Split thread content into individual posts and validate
  const rawThreadPosts = threadContent.split('\n').filter(post => post.trim() !== '');
  const validatedThreadPosts = validateAndTrimThreadPosts(rawThreadPosts);

  // If not enough valid posts, regenerate
  if (validatedThreadPosts.length < maxThreads) {
    const retryCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: 'system', content: threadPrompt + '\n\nPrevious attempt was insufficient. Be more concise and precise.' }
      ],
      temperature: 0.8,
      max_tokens: 1500,
      n: 1
    });

    const retryThreadContent = retryCompletion.choices[0].message.content;
    const retryRawThreadPosts = retryThreadContent.split('\n').filter(post => post.trim() !== '');
    return validateAndTrimThreadPosts(retryRawThreadPosts);
  }

  return validatedThreadPosts;
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
      userInput,
      newsletterType
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

    let content;
    if (postType === 'thread') {
      content = await generateThreadPosts(openai, {
        topic,
        targetAudience,
        tone,
        userInput
      });
    } else {
      const { prompt, temperature } = buildPrompt(postType, {
        topic,
        targetAudience,
        writingStyle,
        additionalGuidelines,
        tone,
        length,
        userInput,
        newsletterType
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: 'system', content: prompt }
        ],
        temperature,
        max_tokens: postType === 'long' ? 1000 
          : postType === 'thread' ? 800 
          : postType === 'newsletter' ? 3000 
          : 400,
        presence_penalty: 0,
        frequency_penalty: 0
      });
      content = completion.choices[0].message.content;
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        content: content
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
