const { OpenAI } = require('openai');
const dotenv = require('dotenv');

dotenv.config();

// Helper function to build prompt
function buildPrompt({ postType, topic, audience, style, guidelines }) {
  return `Create a ${postType} about ${topic} targeting ${audience} in a ${style} tone. 
  Follow these guidelines: ${guidelines}`;
}

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ message: 'Method Not Allowed' }) 
    };
  }

  try {
    const { postType, topic, audience, style, guidelines } = JSON.parse(event.body);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = buildPrompt({ postType, topic, audience, style, guidelines });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        generatedPost: completion.choices[0].message.content
      })
    };
  } catch (error) {
    console.error('Error generating post:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error generating post', 
        error: error.message 
      })
    };
  }
};
