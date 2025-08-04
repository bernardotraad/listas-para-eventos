import { NextRequest, NextResponse } from 'next/server';

const API_URL = 'https://listas-eventos-backend.onrender.com/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, 'GET', params.path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, 'POST', params.path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, 'PUT', params.path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, 'DELETE', params.path);
}

async function handleRequest(
  request: NextRequest, 
  method: string, 
  pathSegments: string[]
) {
  try {
    // Reconstruct the path from segments
    const path = '/' + pathSegments.join('/');
    
    // Get query parameters
    const url = new URL(request.url);
    const queryString = url.search;
    
    // Construct the full URL
    const fullUrl = `${API_URL}${path}${queryString}`;
    
    console.log(`🔄 Proxying ${method} request to: ${fullUrl}`);
    
    // Get headers
    const headers = new Headers();
    headers.set('Content-Type', 'application/json');
    
    // Copy relevant headers from the original request
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers.set('Authorization', authHeader);
    }
    
    // Get body for non-GET requests
    let body: string | undefined;
    if (method !== 'GET') {
      body = await request.text();
    }
    
    // Forward the request to the backend
    const response = await fetch(fullUrl, {
      method,
      headers,
      body,
    });
    
    const responseData = await response.text();
    
    console.log(`✅ Response from backend: ${response.status}`);
    
    // Return the response
    return new NextResponse(responseData, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      },
    });
  } catch (error) {
    console.error('❌ API Proxy Error:', error);
    return new NextResponse(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    },
  });
} 