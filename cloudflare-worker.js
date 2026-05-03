// Cloudflare Worker - Hugging Face Proxy for ThreatModeler
// Deploy this at: https://workers.cloudflare.com/

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

      // Hugging Face token from environment variable
      const HF_TOKEN = env.HF_TOKEN || 'YOUR_TOKEN_HERE';
      
      console.log('Calling HF API...');
      
      // Call Hugging Face API
      const response = await fetch('https://api-inference.huggingface.co/models/Qwen/Qwen2-VL-7B-Instruct', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: {
            image: image,
            question: question
          },
          parameters: {
            max_new_tokens: 2000,
            return_full_text: false
          }
        })
      });

      console.log('HF Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('HF API Error:', errorText);
        return new Response(JSON.stringify({ 
          error: `HF API Error: ${response.status} - ${errorText}` 
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      const data = await response.json();
      console.log('HF Response data:', data);

      return new Response(JSON.stringify(data), {
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
