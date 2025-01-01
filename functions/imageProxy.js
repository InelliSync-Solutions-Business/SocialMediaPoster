const fetch = require('node-fetch');

const imageUrls = new Map();

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return { 
      statusCode: 405, 
      body: JSON.stringify({ message: 'Method Not Allowed' }) 
    };
  }

  try {
    const imageId = event.path.split('/').pop();
    console.log('Image proxy request received for ID:', imageId);
    
    const imageUrl = imageUrls.get(imageId);
    
    if (!imageUrl) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Image not found' })
      };
    }

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.buffer();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': imageResponse.headers.get('content-type'),
        'Access-Control-Allow-Origin': '*'
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
