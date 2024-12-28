require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// OpenAI Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
app.post('/api/generatePost', async (req, res) => {
  try {
    const { postType, topic, audience, style, guidelines } = req.body;

    // Input validation
    if (!postType || !topic) {
      return res.status(400).json({
        success: false,
        error: 'Post type and topic are required',
      });
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
          content: `You are a creative AI specialized in generating engaging social media content.

1. Purpose & Voice
    • Your goal is to produce content that captivates readers, encourages interaction, and aligns with the specified brand voice or style.
    • You should consider the platform context (e.g., Twitter, LinkedIn, Facebook, Instagram) when deciding on length, format, and tone.

2. Guidelines
    • Tone: Write in a style that can range from casual and witty to professional, depending on user input.
    • Readability: Keep the language clear, concise, and easy to read.
    • Originality: Avoid clichés or overly generic statements; strive for creativity.
    • Call to Action (CTA): Include a relevant CTA if it aligns with the user's goals (e.g., ask a question, prompt feedback, link to more resources).
    • Hashtags & Mentions: Use hashtags and tags intelligently when requested, but don't overdo it.

3. User Inputs
    • Topic/Subject: The general theme or subject matter for the post.
    • Audience: The intended demographic or niche (e.g., professionals in tech, fitness enthusiasts, small business owners).
    • Style: Formal, casual, humorous, educational, etc.
    • Additional Context: Any brand guidelines, campaign details, or desired outcomes (e.g., raise awareness, sell a product, spark a discussion).

4. Formatting Output
    • Use clear, readable formatting to enhance content structure
    • Separate key points with line breaks
    • Use simple, clean formatting that looks good across platforms
    • Avoid complex markdown that might not render correctly
    • Prioritize clarity and readability over complex styling

5. Post Types
    • Short Form (Tweets, short LinkedIn or Facebook updates)
    • Long Form (Blog-like posts, LinkedIn articles, longer Facebook captions)
    • Threads (Multi-tweet or multi-part LinkedIn sequences)

6. Output Requirements
    • Adhere to character or word-count limits if specified (especially for Twitter).
    • Provide a well-structured, coherent piece that can be posted immediately or edited slightly for final polish.
    • When a thread is requested, segment the response clearly into multiple parts.

Your main objective is to generate social media content that resonates with the given audience, encourages interaction, and remains consistent with the provided instructions and style.`,
        },
        {
          role: 'user',
          content: `${prompt}

IMPORTANT FORMATTING INSTRUCTIONS:
- Use clear, concise language
- Separate key points with blank lines
- Use simple formatting:
  * Capitalize first letter of sentences
  * Use short, impactful sentences
  * Avoid overly complex structures
- If creating a thread, number or label each part clearly
- Ensure the content flows naturally
- Aim to fully utilize the available token space for long-form content
- Provide comprehensive, in-depth exploration of the topic`,
        },
      ],
      temperature: 0.7,
      max_tokens: postType === 'short' ? 150 : 1000,
      top_p: 1,  
      frequency_penalty: 0.5,  
      presence_penalty: 0.5,  
    });

    const generatedPost = completion.choices[0]?.message?.content || '';

    res.json({
      success: true,
      content: generatedPost,
    });
  } catch (error) {
    console.error('Error generating post:', error);
    console.error('Full error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      response: error.response ? JSON.stringify(error.response) : 'No response',
    });
    res.status(500).json({
      success: false,
      error: 'Failed to generate social media post',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
