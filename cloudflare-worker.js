// Cloudflare Worker - Gemini API Proxy for ThreatModeler
// Deploy this at: https://workers.cloudflare.com/
// Updated: 2026-05-03 13:45

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { image, question } = await request.json();

      // Gemini API key from environment variable
      const GEMINI_API_KEY = env.GEMINI_API_KEY || 'YOUR_KEY_HERE';
      
      console.log('Calling Gemini API...');
      
      // Call Gemini API with correct model name (gemini-2.5-flash)
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                text: question
              },
              {
                inline_data: {
                  mime_type: "image/png",
                  data: image
                }
              }
            ]
          }]
        })
      });

      console.log('Gemini Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error:', errorText);
        return new Response(JSON.stringify({ 
          error: `Gemini API Error: ${response.status} - ${errorText}` 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      const data = await response.json();
      console.log('Gemini Response data:', data);

      // Extract text from Gemini response
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);

      return new Response(JSON.stringify({ generated_text: text }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: error.message, stack: error.stack }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
