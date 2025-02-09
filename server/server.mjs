import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Middleware logging
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.path}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
});

import { buildNewsletterPrompt as newsletterPostBuildPrompt } from '../functions/newsletterPost.js';

// Helper function to build Threaded Post prompt
function buildPrompt({ postType, topic, audience, style, guidelines }) {
  if (postType === 'thread') {
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
  
  return `
Generate a social media post.
Post Type: ${postType}
Topic: ${topic}
Target Audience: ${audience}
Style: ${style}
Guidelines: ${guidelines}
`;
}

// Helper function to parse thread content
function parseThreadContent(content) {
  if (!content) return [];
  const tweets = content.split('---').map(tweet => tweet.trim());
  return tweets.filter(tweet => tweet.length > 0).map(tweet => ({
    content: tweet,
    characterCount: tweet.length
  }));
}

// Helper function to build newsletter prompt
function buildNewsletterPrompt(params) {
  // Delegate to the more comprehensive prompt builder from newsletterPost.js
  return newsletterPostBuildPrompt(params);
}

// Generate post endpoint
app.post('/api/generatePost', async (req, res) => {
  try {
    const { postType, topic, audience, style, guidelines } = req.body;
    console.log('Received request:', { postType, topic, audience, style, guidelines });

    // Input validation
    if (!postType || !topic) {
      return res.status(400).json({
        success: false,
        error: 'Post type and topic are required'
      });
    }

    // Validate OpenAI configuration
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key is not configured'
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    console.log('OpenAI client initialized');

    const prompt = buildPrompt({ postType, topic, audience, style, guidelines });
    console.log('Built prompt:', prompt);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: 'system',
          content: `You are an AI-powered social media content generation assistant for Intellisync Solutions, specializing in creating engaging, platform-optimized content across multiple social media channels.

Core Objectives:
- Generate high-quality, contextually relevant social media content
- Adapt tone and style based on user-specified preferences
- Ensure content is platform-specific and meets each platform's best practices

Platform Considerations:
- Twitter: Craft concise, impactful messages under 280 characters
- LinkedIn: Maintain a professional tone
- Facebook: Balance informative and conversational styles
- Instagram: Consider visual appeal and hashtag suggestions

Tone Flexibility:
Adjust content tone to match user preference:
- Professional: Formal, authoritative, industry-focused
- Casual: Conversational, relatable, approachable
- Inspirational: Motivational, uplifting, encouraging
- Humorous: Witty, light-hearted, entertaining

Technical Guidelines:
- For threads: Separate each tweet with "---"
- Keep tweets under 280 characters
- Use emojis appropriately
- Include calls-to-action`
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });
    console.log('OpenAI response received');

    const generatedContent = completion.choices[0].message.content.trim();
    
    // Handle thread format if applicable
    if (postType === 'thread') {
      const threadPosts = parseThreadContent(generatedContent);
      res.json({
        success: true,
        content: threadPosts,
        isThread: true
      });
    } else {
      res.json({
        success: true,
        content: generatedContent
      });
    }
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      error: error.message,
      details: error.message
    });
  }
});

// Generate image endpoint
app.post('/api/generateImage', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log('Received image generation request:', { prompt });

    // Input validation
    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    // Validate OpenAI configuration
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key is not configured'
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    console.log('Sending request to OpenAI...');
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url"
    });
    console.log('Received response from OpenAI');

    if (!response.data || !response.data[0] || !response.data[0].url) {
      console.error('Invalid response from OpenAI:', response);
      return res.status(500).json({
        success: false,
        error: 'Invalid response from image generation service'
      });
    }

    res.json({
      success: true,
      imageUrl: response.data[0].url
    });
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate image'
    });
  }
});

// Generate poll endpoint
app.post('/api/generate-poll', async (req, res) => {
  try {
    const { topic, audience, style, guidelines } = req.body;
    console.log('Received poll generation request:', { topic, audience, style, guidelines });

    // Input validation
    if (!topic) {
      return res.status(400).json({
        success: false,
        error: 'Poll topic is required'
      });
    }

    // Validate OpenAI configuration
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key is not configured'
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
      Generate an engaging social media poll.
      Topic: ${topic}
      Target Audience: ${audience}
      Style: ${style}
      Guidelines: ${guidelines}

      Please format the response EXACTLY like this:
      1. Poll Question
      2. Option A
      3. Option B
      4. Option C
      5. Explanation of why this poll is engaging
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: 'system',
          content: `You are an AI-powered poll generation assistant for social media. Create engaging, interactive polls that encourage audience participation and generate meaningful discussions. Focus on clarity, relevance, and engagement potential.`
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = completion.choices[0].message.content.trim();
    const lines = content.split('\n').filter(line => line.trim());
    
    res.json({
      success: true,
      content: content,
      question: lines[0].replace(/^[0-9]+\.\s*/, '').trim(),
      options: lines.slice(1, 4).map(line => line.replace(/^[0-9]+\.\s*/, '').trim())
    });
  } catch (error) {
    console.error('Poll generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate poll'
    });
  }
});

// Generate newsletter endpoint with Server-Sent Events
app.get('/api/generate-newsletter', async (req, res) => {
  try {
    console.log('Full request details:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query
    });

    const { topic, audience, style, guidelines } = req.query;
    console.log('Received newsletter generation request:', { topic, audience, style, guidelines });

    // Input validation
    if (!topic || !audience) {
      console.error('Validation error: Missing topic or audience');
      return res.status(400).json({
        success: false,
        error: 'Topic and audience are required'
      });
    }

    // Validate OpenAI configuration
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key is not configured'
      });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Set headers for Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-open',
      'Access-Control-Allow-Origin': '*'  // Add explicit CORS header
    });

    const prompt = buildNewsletterPrompt({ 
      topic: topic.toString(), 
      audience: audience.toString(), 
      style: style?.toString() || 'Informative', 
      guidelines: guidelines?.toString() || '' 
    });

    console.log('Generated prompt:', prompt);

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: 'system',
          content: `You are an AI newsletter generation assistant for Intellisync Solutions. Create engaging, informative newsletters tailored to specific audiences.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      stream: true
    });

    let fullContent = '';
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullContent += content;

      // Send content chunks as SSE
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }

    // Send final message
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Newsletter generation error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).write(`data: ${JSON.stringify({ error: true, message: error.message })}\n\n`);
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
