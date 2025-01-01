import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';

// Use dynamic import for node-fetch
const fetchModule = await import('node-fetch');

// Initialize Express
const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Parse JSON bodies
app.use(express.json());

// OpenAI Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Validate OpenAI configuration at startup
console.log('OpenAI Configuration:', {
  apiKeyPresent: !!process.env.OPENAI_API_KEY,
  apiKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0,
});

/**
 * Helper function to build the prompt based on post type and other parameters
 */
function buildPrompt({ postType, topic, audience, style, guidelines }) {
  if (postType === 'thread') {
    return `
      Generate a multi-post thread for a Twitter-like platform.
      Topic: ${topic}
      Target Audience: ${audience}
      Writing Style: ${style}
      Additional Guidelines: ${guidelines}
      
      Split the response into several numbered parts, each suitable for a single tweet.
      Ensure each part flows naturally into the next while maintaining engagement.
    `;
  }

  return `
    Generate a ${postType} social media post.
    Topic: ${topic}
    Target Audience: ${audience}
    Writing Style: ${style}
    Additional Guidelines: ${guidelines}
    
    Create a ${postType === 'short' ? 'concise' : 'detailed'} post that's engaging and well-structured.
    ${postType === 'short' ? 'Keep it brief and impactful.' : 'Elaborate on key points while maintaining reader interest.'}
  `;
}

/**
 * POST /api/generatePost
 * Generates social media posts based on user input
 */
app.post('/api/generatePost', async (req, res, next) => {
  try {
    console.log('Received post generation request');
    
    const { postType, topic, audience, style, guidelines } = req.body;
    console.log('Request body:', { postType, topic, audience, style, guidelines });

    // Input validation
    if (!postType || !topic) {
      console.log('Validation failed: missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Post type and topic are required',
      });
    }

    // Validate OpenAI configuration
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key is not configured'
      });
    }

    const prompt = buildPrompt({
      postType,
      topic,
      audience,
      style,
      guidelines,
    });

    console.log('Built prompt:', prompt);

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
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }).catch(error => {
      console.error('OpenAI API Error:', error);
      throw new Error(`OpenAI API Error: ${error.message}`);
    });

    console.log('OpenAI response received');

    if (!completion.choices || !completion.choices[0] || !completion.choices[0].message) {
      console.error('Invalid completion response:', completion);
      throw new Error('Invalid response from OpenAI');
    }

    const generatedContent = completion.choices[0].message.content;
    console.log('Content generated successfully');

    return res.json({
      success: true,
      content: generatedContent,
    });
  } catch (error) {
    console.error('Error in post generation:', error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate content',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
});

/**
 * POST /api/generateImage
 * Generates an image using DALL-E 3 based on user input
 */
app.post('/api/generateImage', async (req, res) => {
  try {
    const { prompt, quality = 'standard', size = '1024x1024', style = 'vivid' } = req.body;

    // Validate input
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Log detailed request information
    console.log('Image Generation Request:', {
      prompt,
      quality,
      size,
      style,
      apiKeyPresent: !!process.env.OPENAI_API_KEY
    });

    // Generate image with DALL-E
    const imageResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: prompt,
      n: 1,
      quality: quality,
      size: size,
      style: style
    });

    const originalUrl = imageResponse.data[0].url;
    const revisedPrompt = imageResponse.data[0].revised_prompt;

    // Generate a unique ID for the image using timestamp and random string
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const imageId = `${timestamp}-${randomStr}`;
    
    // Store the mapping
    imageUrls.set(imageId, originalUrl);
    
    const proxyUrl = `/api/image/${imageId}`;

    // Detailed logging of response
    console.log('Image Generation Response:', {
      proxyUrl,
      imageId,
      originalUrl,
      revisedPrompt
    });

    // Return the proxied image URL
    res.json({
      imageUrl: proxyUrl,
      revisedPrompt: revisedPrompt
    });
  } catch (error) {
    console.error('Error generating image:', error);
    console.error('Full error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      response: error.response ? JSON.stringify(error.response) : 'No response',
      apiKeyPresent: !!process.env.OPENAI_API_KEY,
      apiKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0
    });
    res.status(500).json({ 
      error: 'Failed to generate image', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// Store image URLs temporarily
const imageUrls = new Map();

// Add image proxy endpoint
app.get('/api/image/:id', async (req, res) => {
  try {
    console.log('Image proxy request received for ID:', req.params.id);
    
    const imageUrl = imageUrls.get(req.params.id);
    if (!imageUrl) {
      console.error('Image URL not found:', {
        requestedId: req.params.id,
        availableIds: Array.from(imageUrls.keys())
      });
      return res.status(404).json({ 
        error: 'Image not found',
        details: `No image found for ID: ${req.params.id}`
      });
    }

    console.log('Found image URL:', imageUrl);

    // Fetch the image
    const { default: fetch } = await fetchModule;
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      console.error('Failed to fetch image:', {
        status: response.status,
        statusText: response.statusText,
        url: imageUrl
      });
      return res.status(response.status).json({ 
        error: 'Failed to fetch image',
        details: `HTTP ${response.status}: ${response.statusText}`
      });
    }

    // Get content type from response
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      console.error('Invalid content type:', {
        contentType,
        url: imageUrl
      });
      return res.status(400).json({
        error: 'Invalid image response',
        details: 'Response is not an image'
      });
    }

    console.log('Image fetched successfully:', {
      contentType,
      url: imageUrl
    });

    // Set response headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    
    // Convert response to buffer and send
    const buffer = await response.buffer();
    console.log('Image buffer created, size:', buffer.length);
    
    res.send(buffer);
    console.log('Image sent successfully');
  } catch (error) {
    console.error('Error in image proxy:', error);
    if (!res.headersSent) {
      res.status(500).json({
        error: 'Failed to proxy image',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the app for potential testing or further use
export default app;
