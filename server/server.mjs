import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { 
  buildStandardPostPrompt, 
  buildThreadPrompt, 
  buildPollPrompt, 
  parseThreadContent,
  buildNewsletterPrompt
} from './promptAdapter.mjs';

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

    // Use the appropriate prompt builder based on post type
    const prompt = postType === 'thread' 
      ? buildThreadPrompt({ topic, audience, style, guidelines })
      : buildStandardPostPrompt({ postType, topic, audience, style, guidelines });
    
    console.log('Built prompt:', prompt);

    const completion = await openai.chat.completions.create({
      model: getOpenAIModel(model),
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
    const { prompt, model } = req.body;
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
      model: getOpenAIModel(model),
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

    const prompt = buildPollPrompt({ topic, audience, style, guidelines });

    const completion = await openai.chat.completions.create({
      model: getOpenAIModel(model),
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

// Generate newsletter endpoint with Server-Sent Events
app.get('/api/generate-newsletter', async (req, res) => {
  try {
    console.log('Full request details:', {
      method: req.method,
      url: req.url,
      headers: req.headers,
      query: req.query
    });

    const { topic, audience, style, guidelines, model } = req.query;
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
      targetAudience: audience.toString(),
      writingStyle: style?.toString() || 'Informative',
      additionalGuidelines: guidelines?.toString() || '',
      newsletterType: 'industry-insights',
      length: 'medium',
      tone: 'professional'
    });

    console.log('Generated prompt:', prompt);

    const stream = await openai.chat.completions.create({
      model: getOpenAIModel(model),
      messages: [
        {
          role: 'system',
          content: `You are an AI newsletter generation assistant for Intellisync Solutions. Create engaging, informative newsletters tailored to specific audiences. 
Format your response in proper markdown with headings (using # syntax), lists (using - or * syntax), emphasis (**bold** or *italic*), and other markdown elements as appropriate.
Always include a clear structure with a title, date placeholder, introduction, well-organized sections, and a conclusion.`
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

// Newsletter generation endpoint
app.post('/api/generate-newsletter', async (req, res) => {
  try {
    console.log('Received newsletter generation request:', req.body);
    
    // Validate required fields
    if (!req.body.topic || !req.body.targetAudience) {
      return res.status(400).json({ error: 'Missing required parameters: topic and targetAudience are required' });
    }
    
    // Import the generateNewsletter function from promptManager
    const { generateNewsletter } = await import('../src/utils/prompts/promptManager.js');
    
    // Generate the newsletter
    const result = await generateNewsletter({
      topic: req.body.topic,
      length: req.body.length || 'medium',
      writingStyle: req.body.writingStyle || 'Informative',
      targetAudience: req.body.targetAudience,
      newsletterType: req.body.type || 'tech-trends',
      tone: req.body.tone || 'professional',
      additionalGuidelines: req.body.additionalGuidelines || '',
      model: req.body.model || 'gpt-4o-mini',
      keyPoints: req.body.keyPoints || []
    });
    
    // Return the generated content and usage information
    res.json({
      content: result.content,
      usage: result.usage
    });
  } catch (error) {
    console.error('Error generating newsletter:', error);
    res.status(500).json({ error: 'Failed to generate newsletter content' });
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
