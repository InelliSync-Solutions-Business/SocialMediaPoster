import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { 
  buildStandardPostPrompt, 
  buildThreadPrompt, 
  buildPollPrompt, 
  parseThreadContent,
  buildNewsletterPrompt,
  generateImagePrompt,
  systemPrompts
} from './promptAdapter.mjs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Helper function to get valid OpenAI model name
const getOpenAIModel = (modelPreference) => {
  const validModels = {
    'gpt-4o': 'gpt-4o',
    'gpt-4o-mini': 'gpt-4o-mini',
    'gpt-3.5-turbo': 'gpt-3.5-turbo',
    'gpt-4.5': 'gpt-4.5',
    'o1': 'o1',
    'o1-mini': 'o1-mini'
  };
  
  // Check if the model is valid
  if (modelPreference && validModels[modelPreference]) {
    console.log(`Using requested model: ${modelPreference}`);
    return validModels[modelPreference];
  }
  
  // Default to gpt-4o-mini
  console.log(`Defaulting to gpt-4o-mini (requested: ${modelPreference || 'none'})`);
  return 'gpt-4o-mini';
};

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true,
  exposedHeaders: ['Content-Type']
}));
app.use(express.json());

// Middleware logging
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.path}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Generate post endpoint
app.post('/api/generatePost', async (req, res) => {
  try {
    const { postType, topic, audience, style, guidelines, model } = req.body;
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

    // Use the appropriate prompt builder based on post type
    let prompt;
    if (postType === 'thread') {
      prompt = buildThreadPrompt(postType, topic, style, audience, guidelines);
    } else {
      prompt = buildStandardPostPrompt(postType, topic, style, audience, guidelines);
    }
    
    console.log('Built prompt:', prompt);

    const completion = await openai.chat.completions.create({
      model: getOpenAIModel(model),
      messages: [
        {
          role: 'system',
          content: systemPrompts.social
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
        isThread: true,
        usage: {
          inputTokens: completion.usage?.prompt_tokens || 0,
          outputTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0
        }
      });
    } else {
      res.json({
        success: true,
        content: generatedContent,
        usage: {
          inputTokens: completion.usage?.prompt_tokens || 0,
          outputTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0
        }
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
    const { prompt, model, content, style, format, platform } = req.body;
    console.log('Received image generation request:', { prompt, content, style, format, platform });
    
    // If content is provided but no prompt, generate the prompt
    let finalPrompt;
    
    if (prompt) {
      // If prompt is provided directly, check its length
      if (prompt.length > 1000) {
        console.log(`Prompt too long (${prompt.length} chars), truncating...`);
        // Extract just the first part of the prompt to stay under the limit
        finalPrompt = prompt.substring(0, 950) + '...'; 
      } else {
        finalPrompt = prompt;
      }
    } else if (content) {
      // Generate prompt from content using our adapter function (which handles truncation)
      finalPrompt = generateImagePrompt({ content, style, format, platform });
    } else {
      finalPrompt = null;
    }
    
    // Log the final prompt length
    if (finalPrompt) {
      console.log(`Final prompt length: ${finalPrompt.length} characters`);
    }

    // Input validation
    if (!finalPrompt) {
      return res.status(400).json({
        success: false,
        error: 'Either prompt or content is required'
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
    // For image generation, we should use the appropriate model
    // The OpenAI image generation API doesn't use the same models as text completion
    // Default to dall-e-3 unless dall-e-2 is explicitly requested.
    // In future other Image generation models can be added such as Mid-Journey, Stable Diffusion, etc.
    const imageModel = model === 'dall-e-2' ? 'dall-e-2' : 'dall-e-3';
    
    console.log(`Using image model: ${imageModel}`);
    
    let response;
    try {
      response = await openai.images.generate({
        model: imageModel,
        prompt: finalPrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url"
      });
      
      console.log('Image generation successful');
    } catch (error) {
      console.error('Error in OpenAI image generation API call:', error);
      throw error;
    }
    
    if (!response.data || !response.data[0] || !response.data[0].url) {
      console.error('Invalid response from OpenAI:', response);
      return res.status(500).json({
        success: false,
        error: 'Invalid response from image generation service'
      });
    }
    
    console.log('Received valid response from OpenAI with image URL');

    res.json({
      success: true,
      imageUrl: response.data[0].url,
      usage: {
        inputTokens: response.usage?.prompt_tokens || 0,
        outputTokens: response.usage?.completion_tokens || 0,
        totalTokens: response.usage?.total_tokens || 0
      }
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
    const { topic, audience, style, guidelines, model } = req.body;
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

    const prompt = buildPollPrompt('social-media', topic, style, audience, guidelines);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use a specific model directly instead of getOpenAIModel
      messages: [
        {
          role: 'system',
          content: systemPrompts.poll
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = completion.choices[0].message.content.trim();
    const lines = content.split('\n').filter(line => line.trim());
    
    // Extract the title (line starting with #)
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1].trim() : '';
    
    // Extract the question (line after ## Poll Question)
    let question = '';
    const questionMatch = content.match(/##\s+Poll\s+Question\s*\n+([^\n#]+)/i);
    if (questionMatch) {
      question = questionMatch[1].trim();
    } else {
      // Fallback to old format if needed
      const questionLine = lines.find(line => !line.startsWith('#'));
      if (questionLine) {
        question = questionLine.replace(/^[0-9]+\.\s*/, '').trim();
      }
    }
    
    // Extract options (lines after ## Options)
    const options = [];
    const optionsSection = content.match(/##\s+Options\s*\n+([\s\S]*?)(?=\n##|$)/i);
    
    if (optionsSection) {
      // Extract bullet points
      const optionMatches = optionsSection[1].match(/[-*]\s+Option\s+[A-D]:\s+([^\n]+)/gi);
      if (optionMatches) {
        optionMatches.forEach(match => {
          const option = match.replace(/[-*]\s+Option\s+[A-D]:\s+/i, '').trim();
          options.push(option);
        });
      }
    }
    
    // Fallback to old format if needed
    if (options.length === 0) {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // Match lines that start with 2., 3., 4., or 5. followed by text
        if (/^[2-5]\.\s/.test(line)) {
          options.push(line.replace(/^[0-9]+\.\s*/, '').trim());
        }
        // Stop once we have 4 options
        if (options.length === 4) break;
      }
    }
    
    res.json({
      success: true,
      content: content,
      title: title,
      question: question,
      options: options,
      usage: {
        inputTokens: completion.usage?.prompt_tokens || 0,
        outputTokens: completion.usage?.completion_tokens || 0,
        totalTokens: completion.usage?.total_tokens || 0
      }
    });
  } catch (error) {
    console.error('Poll generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate poll'
    });
  }
});

// Generate newsletter endpoint with Server-Sent Events for streaming requests
app.get('/api/generate-newsletter', async (req, res) => {
  try {
    // Check if this is a streaming request
    if (!req.query.stream) {
      return res.status(400).json({
        success: false,
        error: 'For streaming requests, please use ?stream=true'
      });
    }

    console.log('Streaming request received:', {
      method: req.method,
      url: req.url,
      query: req.query
    });

    // Extract parameters from query
    const topic = req.query.topic || '';
    const targetAudience = req.query.targetAudience || '';
    const writingStyle = req.query.writingStyle || 'Informative';
    const additionalGuidelines = req.query.additionalGuidelines || '';
    const type = req.query.type || 'tech-trends';
    const length = req.query.length || 'medium';
    const tone = req.query.tone || 'professional';
    const model = req.query.model || 'gpt-4o-mini';
    
    console.log('Extracted parameters:', {
      topic,
      targetAudience,
      writingStyle,
      type,
      length,
      tone,
      model
    });

    // Validate required fields
    if (!topic || !targetAudience) {
      console.error('Missing required parameters:', { topic, targetAudience });
      return res.status(400).json({ 
        error: 'Missing required parameters: topic and targetAudience are required' 
      });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    // Generate the prompt
    const promptData = buildNewsletterPrompt(
      type,
      topic,
      writingStyle,
      targetAudience,
      additionalGuidelines,
      length,
      tone
    );

    // Extract the prompt and systemPrompt from the returned object
    const { prompt, systemPrompt, maxTokens } = promptData;

    console.log('Generated prompt:', prompt);

    // Set headers for Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'X-Accel-Buffering': 'no'
    });

    // Send initial connection message
    res.write(`data: ${JSON.stringify({ connected: true })}\n\n`);

    // Create streaming completion
    const stream = await openai.chat.completions.create({
      model: getOpenAIModel(model),
      messages: [
        {
          role: 'system',
          content: systemPrompt || systemPrompts.newsletter
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: maxTokens || (length === 'short' ? 1500 : length === 'medium' ? 2500 : 3500),
      stream: true
    });
    
    // Variables to track usage and content
    let fullContent = '';
    let inputTokens = 0;
    let outputTokens = 0;
    
    // Stream the response
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullContent += content;
      outputTokens += 1; // Rough estimate
      
      // Send content chunks as SSE
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
    
    // Estimate input tokens (rough calculation)
    inputTokens = (typeof prompt === 'string' ? prompt.length : JSON.stringify(prompt).length) / 4;
    
    // Send final message with usage statistics
    res.write(`data: ${JSON.stringify({ 
      done: true, 
      usage: {
        inputTokens: Math.round(inputTokens),
        outputTokens: Math.round(outputTokens),
        totalTokens: Math.round(inputTokens + outputTokens),
        estimatedCost: calculateCost(model, Math.round(inputTokens), Math.round(outputTokens))
      }
    })}\n\n`);
    
    // Clean up
    res.end();

  } catch (error) {
    console.error('Newsletter streaming error:', error);
    console.error('Error stack:', error.stack);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Unknown server error' });
    } else {
      res.write(`data: ${JSON.stringify({ error: true, message: error.message || 'Unknown server error' })}\n\n`);
      res.end();
    }
  }
});

// Newsletter generation endpoint with streaming support
app.post('/api/generate-newsletter', async (req, res) => {
  try {
    console.log('Received newsletter generation request:', req.body);
    
    // Validate required fields
    if (!req.body.topic || !req.body.targetAudience) {
      return res.status(400).json({ error: 'Missing required parameters: topic and targetAudience are required' });
    }
    
    // Extract parameters from request body
    const { 
      topic, 
      targetAudience, 
      writingStyle = 'Informative', 
      additionalGuidelines = '', 
      type = 'tech-trends',
      length = 'medium',
      tone = 'professional',
      model = 'gpt-4o-mini'
    } = req.body;
    
    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Generate the prompt using the updated function
    const promptData = buildNewsletterPrompt(
      type,
      topic,
      writingStyle,
      targetAudience,
      additionalGuidelines,
      length,
      tone
    );

    // Extract the prompt and systemPrompt from the returned object
    const { prompt, systemPrompt, maxTokens } = promptData;

    console.log('Generated prompt:', prompt);
    
    // Set headers for Server-Sent Events
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',  // Add explicit CORS header
      'X-Accel-Buffering': 'no' // Disable proxy buffering
    });
    
    // Send initial connection message
    res.write(`data: ${JSON.stringify({ connected: true })}\n\n`);
    
    // Create streaming completion
    const stream = await openai.chat.completions.create({
      model: getOpenAIModel(model),
      messages: [
        {
          role: 'system',
          content: systemPrompt || systemPrompts.newsletter
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: maxTokens || (length === 'short' ? 1500 : length === 'medium' ? 2500 : 3500),
      stream: true
    });
    
    // Variables to track usage and content
    let fullContent = '';
    let inputTokens = 0;
    let outputTokens = 0;
    
    // Stream the response
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullContent += content;
      outputTokens += 1; // Rough estimate
      
      // Send content chunks as SSE
      res.write(`data: ${JSON.stringify({ content })}\n\n`);
    }
    
    // Estimate input tokens (rough calculation)
    inputTokens = (typeof prompt === 'string' ? prompt.length : JSON.stringify(prompt).length) / 4;
    
    // Send final message with usage statistics
    res.write(`data: ${JSON.stringify({ 
      done: true, 
      usage: {
        inputTokens: Math.round(inputTokens),
        outputTokens: Math.round(outputTokens),
        totalTokens: Math.round(inputTokens + outputTokens),
        estimatedCost: calculateCost(model, Math.round(inputTokens), Math.round(outputTokens))
      }
    })}\n\n`);
    
    res.end();
  } catch (error) {
    console.error('Error generating newsletter:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // If headers haven't been sent yet, send a JSON error response
    if (!res.headersSent) {
      return res.status(500).json({ error: error.message });
    }
    
    // Otherwise, send an error event
    res.write(`data: ${JSON.stringify({ error: true, message: error.message })}\n\n`);
    res.end();
  }
});

// Image proxy endpoint to handle CORS issues with external images
app.get('/api/imageProxy', async (req, res) => {
  try {
    const imageUrl = decodeURIComponent(req.query.url || '');
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'No image URL provided' });
    }

    console.log('Proxying image from:', imageUrl);
    
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      return res.status(imageResponse.status).json({ message: 'Failed to fetch image' });
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    res.set({
      'Content-Type': imageResponse.headers.get('content-type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
    });
    
    res.send(buffer);
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ 
      message: 'Error proxying image', 
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Function to calculate estimated cost
function calculateCost(model, inputTokens, outputTokens) {
  // Pricing per 1000 tokens in USD (as of March 2025)
  const pricing = {
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-4o-mini': { input: 0.0015, output: 0.0045 },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
    'gpt-4.5': { input: 0.01, output: 0.03 },
    'o1': { input: 0.015, output: 0.075 },
    'o1-mini': { input: 0.0075, output: 0.0375 }
  };

  // Get the pricing for the specified model, or default to gpt-4o-mini
  const modelPricing = pricing[model] || pricing['gpt-4o-mini'];

  // Calculate the cost
  const inputCost = (inputTokens / 1000) * modelPricing.input;
  const outputCost = (outputTokens / 1000) * modelPricing.output;
  const totalCost = inputCost + outputCost;

  // Return the cost rounded to 4 decimal places
  return Math.round(totalCost * 10000) / 10000;
}
