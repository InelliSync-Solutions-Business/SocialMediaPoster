const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ message: 'Method Not Allowed' }) 
    };
  }

  try {
    const imageUrl = decodeURIComponent(event.queryStringParameters?.url || '');
    
    if (!imageUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'No image URL provided' })
      };
    }

    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      return {
        statusCode: imageResponse.status,
        body: JSON.stringify({ message: 'Failed to fetch image' })
      };
    }

    const imageBuffer = await imageResponse.buffer();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': imageResponse.headers.get('content-type') || 'image/jpeg',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
      },
      body: imageBuffer.toString('base64'),
      isBase64Encoded: true
    };
  } catch (error) {
    console.error('Error proxying image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error proxying image', 
        error: error.message 
      })
    };
  }
};
