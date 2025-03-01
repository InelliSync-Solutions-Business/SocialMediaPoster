import { OpenAI } from 'openai';
import dotenv from 'dotenv';
import { 
  PollPromptBuilder,
  ImagePromptBuilder,
  ThreadPromptBuilder,
  NewsletterPromptBuilder,
  SocialPromptBuilder
} from '../src/utils/prompts/builders/index.ts';
dotenv.config();

// Use builders for different content types
const getPromptBuilder = (type) => {
  switch (type) {
    case 'image':
      return new ImagePromptBuilder();
    case 'poll':
      return new PollPromptBuilder();
    case 'newsletter':
      return new NewsletterPromptBuilder();
    case 'thread':
      return new ThreadPromptBuilder();
    default:
      // For other types, use the social builder as a fallback
      return new SocialPromptBuilder();
  }
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
  // Get the appropriate builder for this content type
  const builder = getPromptBuilder(postType);
  
  // Set up common parameters
  builder
    .setTopic(params.topic)
    .setTargetAudience(params.targetAudience || 'general audience')
    .setWritingStyle(params.writingStyle || 'informative')
    .setAdditionalGuidelines(params.additionalGuidelines || '');
    
  // Add type-specific parameters
  if (postType === 'newsletter') {
    builder
      .setLength(params.length || 'medium')
      .setNewsletterType(params.newsletterType || 'general')
      .setTone(params.tone || 'professional');
  } else if (postType === 'thread') {
    builder
      .setPlatform(params.platform || 'twitter')
      .setTone(params.tone || 'professional');
  } else if (postType === 'poll') {
    builder
      .setPlatform(params.platform || 'twitter')
      .setTone(params.tone || 'professional');
  } else if (postType === 'image') {
    builder
      .setStyle(params.style || 'realistic')
      .setMood(params.mood || 'neutral')
      .setFormat(params.format || 'square');
  }
  
  // Build the prompt
  const { prompt, systemPrompt } = builder.build();
  
  const toneConfig = TONE_CONFIGS[params.tone] || TONE_CONFIGS.professional;
  
  return { 
    prompt, 
    systemPrompt,
    temperature: toneConfig.temperature 
  };
}

// Enhanced thread post validation and trimming function
function validateAndTrimThreadPosts(threadPosts, minChars = 140, maxChars = 240, maxPosts = 6) {
  // First, clean up the posts by removing any post numbers or bullet points
  const cleanedPosts = threadPosts.map(post => {
    // Remove post numbers (e.g., "1.", "Post 1:", etc.)
    let cleaned = post.trim().replace(/^(\d+\.\s*|Post\s*\d+:\s*|Thread\s*\d+:\s*)/i, '');
    
    // Remove bullet points
    cleaned = cleaned.replace(/^[•\-\*]\s*/, '');
    
    // Ensure hashtags are properly formatted (no spaces between # and tag)
    cleaned = cleaned.replace(/\#\s+([\w\d]+)/g, '#$1');
    
    return cleaned.trim();
  });
  
  // Filter out empty posts and those that don't meet length requirements
  const validPosts = cleanedPosts
    .filter(post => post.length > 0)
    .filter(post => 
      post.length >= minChars && 
      post.length <= maxChars
    )
    .slice(0, maxPosts);
  
  // If we have fewer than the minimum required posts, log a warning
  if (validPosts.length < 3) {
    console.warn(`Warning: Only ${validPosts.length} valid thread posts generated. Minimum recommended is 3.`);
  }
  
  return validPosts;
}

// Modify thread generation function
async function generateThreadPosts(openai, params, maxThreads = 6) {
  // Use the thread builder with all available parameters
  const threadBuilder = new ThreadPromptBuilder()
    .setTopic(params.topic)
    .setTargetAudience(params.targetAudience || 'general audience')
    .setWritingStyle(params.writingStyle || 'informative')
    .setPlatform(params.platform || 'twitter')
    .setTone(params.tone || 'professional')
    .setAdditionalGuidelines(`
      - Create exactly ${maxThreads} thread posts that tell a cohesive story
      - Each thread MUST be between 140-240 characters
      - Focus on creating a narrative flow
      - Ensure clarity and impact within the character limit
      - Include relevant hashtags where appropriate
      ${params.additionalGuidelines || ''}
    `);
    
  // Add user input if provided
  if (params.userInput) {
    threadBuilder.setUserInput(params.userInput);
  }
  
  const { prompt, systemPrompt } = threadBuilder.build();

  const threadCompletion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    temperature: TONE_CONFIGS[params.tone]?.temperature || 0.7,
    max_tokens: 1500,
    n: 1
  });

  const threadContent = threadCompletion.choices[0].message.content;
  
  // Parse thread content intelligently
  let rawThreadPosts = [];
  
  // Try different parsing strategies
  if (threadContent.includes('\n\n')) {
    // Posts are likely separated by double newlines
    rawThreadPosts = threadContent.split('\n\n').filter(post => post.trim() !== '');
  } else if (threadContent.includes('\n')) {
    // Posts are separated by single newlines
    rawThreadPosts = threadContent.split('\n').filter(post => post.trim() !== '');
  } else {
    // Fallback: try to split by numbered patterns
    const postMatches = threadContent.match(/\d+\.\s*[^\d\.]+/g);
    if (postMatches && postMatches.length > 0) {
      rawThreadPosts = postMatches;
    } else {
      // Last resort: just use the whole content as one post
      rawThreadPosts = [threadContent];
    }
  }
  
  // Validate and clean the posts
  const validatedThreadPosts = validateAndTrimThreadPosts(rawThreadPosts, 140, 240, maxThreads);

  // If not enough valid posts or posts are too short/long, regenerate with more specific instructions
  if (validatedThreadPosts.length < Math.min(3, maxThreads)) {
    console.log(`Regenerating thread posts. Only got ${validatedThreadPosts.length} valid posts.`);
    
    // Add more specific guidance based on what went wrong
    let regenerationGuidance = '\n\nPrevious attempt was insufficient.';
    
    if (rawThreadPosts.length < maxThreads) {
      regenerationGuidance += ` Please create exactly ${maxThreads} separate posts.`;
    }
    
    if (rawThreadPosts.some(post => post.length > 240)) {
      regenerationGuidance += ' Make each post more concise, under 240 characters.';
    }
    
    if (rawThreadPosts.some(post => post.length < 140)) {
      regenerationGuidance += ' Ensure each post is at least 140 characters.';
    }
    
    // Add formatting guidance
    regenerationGuidance += ' Format each post on a new line. Do not number the posts.';
    
    const retryCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt + regenerationGuidance }
      ],
      temperature: 0.7, // Slightly lower temperature for more predictable results
      max_tokens: 1500,
      n: 1
    });

    const retryThreadContent = retryCompletion.choices[0].message.content;
    
    // Parse the retry content using the same logic
    let retryRawThreadPosts = [];
    if (retryThreadContent.includes('\n\n')) {
      retryRawThreadPosts = retryThreadContent.split('\n\n').filter(post => post.trim() !== '');
    } else {
      retryRawThreadPosts = retryThreadContent.split('\n').filter(post => post.trim() !== '');
    }
    
    return validateAndTrimThreadPosts(retryRawThreadPosts, 140, 240, maxThreads);
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
      newsletterType,
      maxThreads = 6 // Default to 6 thread posts if not specified
    } = JSON.parse(event.body);
    
    // Validate required parameters
    if (!postType) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          error: 'Missing required parameter: postType' 
        })
      };
    }
    
    if (!topic && !userInput) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          success: false, 
          error: 'Either topic or userInput must be provided' 
        })
      };
    }
    
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
      try {
        content = await generateThreadPosts(openai, {
          topic,
          targetAudience,
          writingStyle,
          additionalGuidelines,
          tone,
          userInput,
          platform: 'twitter'
        }, maxThreads);
        
        // Ensure we have at least one valid thread post
        if (!Array.isArray(content) || content.length === 0) {
          throw new Error('Failed to generate valid thread posts');
        }
      } catch (threadError) {
        console.error('Error in thread generation:', threadError);
        // Fallback to a single post if thread generation fails
        const { prompt, systemPrompt, temperature } = buildPrompt('social', {
          topic,
          targetAudience,
          writingStyle,
          additionalGuidelines: 'Create a single social media post that captures the essence of this topic.',
          tone,
          platform: 'twitter'
        });
        
        const fallbackCompletion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 400
        });
        
        content = [fallbackCompletion.choices[0].message.content];
      }
    } else {
      const { prompt, systemPrompt, temperature } = buildPrompt(postType, {
        topic,
        targetAudience,
        writingStyle,
        additionalGuidelines,
        tone,
        length,
        userInput,
        newsletterType,
        platform: postType === 'poll' || postType === 'thread' ? 'twitter' : undefined,
        style: postType === 'image' ? 'realistic' : undefined,
        mood: postType === 'image' ? 'neutral' : undefined,
        format: postType === 'image' ? 'square' : undefined
      });

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
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

    // Format the response based on content type
    let responseBody = {
      success: true
    };
    
    if (postType === 'thread') {
      // For thread posts, return the array of posts
      responseBody.threadPosts = content;
      responseBody.postCount = content.length;
    } else {
      // For other content types, return as a single content string
      responseBody.content = content;
    }
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(responseBody)
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
