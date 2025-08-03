const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  // Get the API URL from environment variables
  const API_URL = process.env.BACKEND_API_URL || 'https://your-backend-url.herokuapp.com';
  
  // Get the path from the event
  const path = event.path.replace('/.netlify/functions/api-proxy', '');
  
  // Construct the full URL
  const url = `${API_URL}${path}`;
  
  // Get query parameters
  const queryString = event.queryStringParameters 
    ? '?' + new URLSearchParams(event.queryStringParameters).toString() 
    : '';
  
  try {
    // Forward the request to the backend
    const response = await fetch(url + queryString, {
      method: event.httpMethod,
      headers: {
        'Content-Type': 'application/json',
        ...event.headers,
        // Remove host header to avoid conflicts
        host: undefined,
      },
      body: event.httpMethod !== 'GET' && event.httpMethod !== 'HEAD' 
        ? event.body 
        : undefined,
    });

    const data = await response.text();
    
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
      body: data,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
    };
  }
}; 