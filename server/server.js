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

// Helper function to build prompt
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
          content: 'You are a creative AI specialized in generating engaging social media content.'
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
