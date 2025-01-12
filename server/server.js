const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

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

// Helper function to build Threaded Post prompt
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
- Instagram: Consider image generation and hashtag suggestions
- LinkedIn: Maintain a professional tone
- Twitter: Craft concise, impactful messages
- TikTok: Create trendy, engaging content
- Facebook: Balance informative and conversational styles
- Discord: Adapt to community-specific communication norms

Tone Flexibility:
Adjust content tone to match user preference:
- Professional: Formal, authoritative, industry-focused
- Casual: Conversational, relatable, approachable
- Inspirational: Motivational, uplifting, encouraging
- Humorous: Witty, light-hearted, entertaining

Technical and Ethical Guidelines:
- Prioritize clarity and engagement
- Avoid sensitive or controversial topics
- Respect platform-specific content guidelines
- Maintain user privacy and confidentiality

Performance Expectations:
- Generate content quickly and efficiently
- Offer suggestions for content optimization`
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });
    console.log('OpenAI response received');

    res.json({
      success: true,
      content: completion.choices[0].message.content.trim()
    });
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
